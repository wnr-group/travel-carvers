'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublishedPackages } from '@/lib/api/public/packages';
import { getActiveCategories } from '@/lib/api/public/categories';

/* ============================== Types ============================== */

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface TravelPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: string[];
  price: number; // 0 = "on request"
  durationDays: number;
  difficulty: Difficulty | null;
  rating: number; // 0 = no reviews yet
  popularity: number;
  image: string;
  location: string;
  createdAt: number; // epoch ms, for "newest" ordering
  isFeatured: boolean;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface Filters {
  search: string;
  categories: string[];
  difficulty: Difficulty[];
  priceMin: number;
  priceMax: number;
  duration: string; // key into DURATION_RANGES
  sort: string; // key into SORT_OPTIONS
}

/* ============================ Constants ============================= */

export const PRICE_FLOOR = 5000;
// INR ceiling that comfortably covers the catalogue; the slider filters within this range.
export const PRICE_CEIL = 100000;

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Challenging',
};

export const DURATION_RANGES: Record<string, { label: string; min: number; max: number }> = {
  any: { label: 'Any', min: 0, max: Infinity },
  '1-3': { label: '1-3 days', min: 1, max: 3 },
  '4-7': { label: '4-7 days', min: 4, max: 7 },
  '8+': { label: '8+ days', min: 8, max: Infinity },
};

export const SORT_OPTIONS: Record<string, { label: string; compare: (a: TravelPackage, b: TravelPackage) => number }> = {
  'best-match': { 
    label: 'Best Match', 
    compare: (a, b) => {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return b.createdAt - a.createdAt;
    } 
  },
  'rating-desc': { 
    label: 'Highest Rated', 
    compare: (a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.createdAt - a.createdAt;
    } 
  },
  'price-asc': { label: 'Price: Low to High', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', compare: (a, b) => b.price - a.price },
  'newest': { label: 'Newest First', compare: (a, b) => b.createdAt - a.createdAt },
  'popular': { label: 'Most Popular', compare: (a, b) => b.popularity - a.popularity },
};

export const DEFAULT_FILTERS: Filters = {
  search: '',
  categories: [],
  difficulty: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  duration: 'any',
  sort: 'best-match',
};

/* ============================== Mapping ============================== */

/** Loosely-typed shape of a published-package row (the Supabase client is untyped). */
interface RawListPackage {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  duration_days?: number | null;
  difficulty_level?: string | null;
  destination_name?: string | null;
  view_count?: number | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
  package_categories?: { categories: { name: string; slug: string } | null }[] | null;
  reviews?: { rating: number; is_approved: boolean | null }[] | null;
}

function mapPackage(row: RawListPackage): TravelPackage {
  const gallery = row.package_gallery ?? [];
  const cover = gallery.find((g) => g.is_cover) ?? gallery[0];
  const categories = (row.package_categories ?? [])
    .map((pc) => pc.categories?.name)
    .filter((name): name is string => Boolean(name));
  const price = row.price_adult == null || row.price_adult === '' ? 0 : Number(row.price_adult);

  // Calculate average rating
  const approvedReviews = (row.reviews ?? []).filter((r) => r.is_approved === true);
  const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const rating = approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;

  return {
    id: row.id,
    name: row.title,
    slug: row.slug,
    description: row.short_description ?? '',
    categories,
    price: Number.isNaN(price) ? 0 : price,
    durationDays: row.duration_days ?? 0,
    difficulty: row.difficulty_level ? DIFFICULTY_MAP[row.difficulty_level] ?? null : null,
    rating,
    popularity: row.view_count ?? 0,
    image: cover?.image_url ?? `https://picsum.photos/seed/${row.slug}/480/320`,
    location: row.destination_name ?? '',
    createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    isFeatured: !!row.is_featured,
  };
}

/* ============================== Helpers ============================== */

export function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').filter(Boolean);
}

export function filtersToSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.categories.length) params.set('category', filters.categories.join(','));
  if (filters.difficulty.length) params.set('difficulty', filters.difficulty.join(','));
  if (filters.priceMin !== PRICE_FLOOR) params.set('price_min', String(filters.priceMin));
  if (filters.priceMax !== PRICE_CEIL) params.set('price_max', String(filters.priceMax));
  if (filters.duration !== 'any') params.set('duration', filters.duration);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort);
  return params;
}

export function searchParamsToFilters(params: URLSearchParams): Filters {
  return {
    search: params.get('q') ?? '',
    categories: parseListParam(params.get('category')),
    difficulty: parseListParam(params.get('difficulty')) as Difficulty[],
    priceMin: Number(params.get('price_min') ?? PRICE_FLOOR),
    priceMax: Number(params.get('price_max') ?? PRICE_CEIL),
    duration: params.get('duration') ?? 'any',
    sort: params.get('sort') ?? DEFAULT_FILTERS.sort,
  };
}

export function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.search) count += 1;
  count += filters.categories.length;
  count += filters.difficulty.length;
  if (filters.priceMin !== PRICE_FLOOR || filters.priceMax !== PRICE_CEIL) count += 1;
  if (filters.duration !== 'any') count += 1;
  return count;
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

/* =============================== Hook ================================ */

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export function usePackageFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, 350);

  // ---- Fetch real published packages ----
  const { data, isPending } = useQuery({
    queryKey: ['packages', 'published', 'list'],
    queryFn: () => getPublishedPackages(),
    staleTime: 5 * 60 * 1000,
  });

  const packages = useMemo<TravelPackage[]>(
    () => ((data ?? []) as RawListPackage[]).map(mapPackage),
    [data],
  );

  // ---- Fetch categories from DB (independent of the package list) ----
  const { data: dbCategoriesData, isError: categoriesError } = useQuery({
    queryKey: ['categories', 'active', 'list'],
    queryFn: getActiveCategories,
    staleTime: 5 * 60 * 1000,
  });

  const availableCategories = useMemo<CategoryOption[]>(() => {
    // On error or empty result we simply render no category checkboxes; packages are never blocked on this.
    if (categoriesError || !dbCategoriesData) return [];
    return dbCategoriesData.map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [dbCategoriesData, categoriesError]);

  // ---- Hydrate filters from the URL on mount ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initial = searchParamsToFilters(params);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from the URL
    setFilters(initial);
    setSearchInput(initial.search);
    setHydrated(true);
    window.scrollTo(0, 0);
  }, []);

  // ---- Push debounced search text into filters ----
  useEffect(() => {
    if (!hydrated) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- push debounced search into filters
    setFilters((prev) => (prev.search === debouncedSearch ? prev : { ...prev, search: debouncedSearch }));
  }, [debouncedSearch, hydrated]);

  // ---- Sync filters -> URL (replace, no history spam) ----
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const params = filtersToSearchParams(filters);
    const query = params.toString();
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters, hydrated]);

  /* ------------------------------ Derived ------------------------------ */

  const filteredPackages = useMemo(() => {
    const range = DURATION_RANGES[filters.duration] ?? DURATION_RANGES.any;
    const query = filters.search.trim().toLowerCase();

    return packages.filter((pkg) => {
      if (query) {
        const haystack = `${pkg.name} ${pkg.description} ${pkg.location}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.categories.length && !pkg.categories.some((c) => filters.categories.includes(c))) return false;
      if (filters.difficulty.length && (!pkg.difficulty || !filters.difficulty.includes(pkg.difficulty))) return false;
      // "On request" packages (price 0) are exempt from the price-range filter so they always surface.
      if (pkg.price !== 0 && (pkg.price < filters.priceMin || pkg.price > filters.priceMax)) return false;
      if (pkg.durationDays < range.min || pkg.durationDays > range.max) return false;
      return true;
    });
  }, [packages, filters]);

  const sortedPackages = useMemo(() => {
    const sorter = SORT_OPTIONS[filters.sort] ?? SORT_OPTIONS['best-match'];
    return [...filteredPackages].sort(sorter.compare);
  }, [filteredPackages, filters.sort]);

  const activeFilterCount = countActiveFilters(filters);

  /* ------------------------------ Handlers ------------------------------ */

  const toggleCategory = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  }, []);

  const toggleDifficulty = useCallback((value: Difficulty) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: prev.difficulty.includes(value)
        ? prev.difficulty.filter((d) => d !== value)
        : [...prev.difficulty, value],
    }));
  }, []);

  const setPriceMin = useCallback((value: number) => {
    setFilters((prev) => ({ ...prev, priceMin: Math.min(value, prev.priceMax) }));
  }, []);

  const setPriceMax = useCallback((value: number) => {
    setFilters((prev) => ({ ...prev, priceMax: Math.max(value, prev.priceMin) }));
  }, []);

  const setDuration = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, duration: value }));
  }, []);

  const setSort = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  }, []);

  const clearFilters = useCallback(() => {
    // Sort is not a filter (it isn't counted in countActiveFilters), so preserve the current selection.
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
    setSearchInput('');
  }, []);

  return {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    loading: isPending || !hydrated,
    hydrated,
    sortedPackages,
    totalCount: packages.length,
    availableCategories,
    activeFilterCount,
    toggleCategory,
    toggleDifficulty,
    setPriceMin,
    setPriceMax,
    setDuration,
    setSort,
    clearFilters,
  };
}
