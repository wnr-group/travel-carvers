'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPublishedPackages } from '@/lib/api/public/packages';
import {
  mapPackage,
  formatPrice,
  type Difficulty,
  type TravelPackage,
  type RawListPackage,
} from '@/lib/packageList';

/* ============================== Types ============================== */

export { mapPackage, formatPrice };
export type { Difficulty, TravelPackage, RawListPackage };

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

export const PRICE_FLOOR = 0;
export const PRICE_CEIL = 500000;

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

export const DURATION_RANGES: Record<string, { label: string; min: number; max: number }> = {
  any: { label: 'Any duration', min: 0, max: Infinity },
  '1-3': { label: '1 - 3 days', min: 1, max: 3 },
  '4-7': { label: '4 - 7 days', min: 4, max: 7 },
  '8-14': { label: '8 - 14 days', min: 8, max: 14 },
  '15+': { label: '15+ days', min: 15, max: Infinity },
};

export const SORT_OPTIONS: Record<string, { label: string; compare: (a: TravelPackage, b: TravelPackage) => number }> = {
  newest: { label: 'Newest first', compare: (a, b) => b.createdAt - a.createdAt },
  popular: { label: 'Most popular', compare: (a, b) => b.popularity - a.popularity },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => b.price - a.price },
  'duration-asc': { label: 'Duration: shortest first', compare: (a, b) => a.durationDays - b.durationDays },
  'duration-desc': { label: 'Duration: longest first', compare: (a, b) => b.durationDays - a.durationDays },
};

export const DEFAULT_FILTERS: Filters = {
  search: '',
  categories: [],
  difficulty: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  duration: 'any',
  sort: 'newest',
};

/* ============================== Helpers ============================== */

export function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').filter(Boolean);
}

/** Parse a numeric URL param, clamping to [min, max] and falling back when invalid. */
export function clampParam(value: string | null, fallback: number, min: number, max: number): number {
  if (value === null || value === '') return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

/** Keep a URL param only when it's a known key of `allowed`, else fall back. */
export function sanitizeKey(value: string | null, allowed: Record<string, unknown>, fallback: string): string {
  return value && Object.prototype.hasOwnProperty.call(allowed, value) ? value : fallback;
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
    priceMin: clampParam(params.get('price_min'), PRICE_FLOOR, PRICE_FLOOR, PRICE_CEIL),
    priceMax: clampParam(params.get('price_max'), PRICE_CEIL, PRICE_FLOOR, PRICE_CEIL),
    duration: sanitizeKey(params.get('duration'), DURATION_RANGES, 'any'),
    sort: sanitizeKey(params.get('sort'), SORT_OPTIONS, DEFAULT_FILTERS.sort),
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
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['packages', 'published', 'list'],
    queryFn: getPublishedPackages,
    staleTime: 5 * 60 * 1000,
  });

  const packages = useMemo<TravelPackage[]>(
    () => ((data ?? []) as RawListPackage[]).map(mapPackage),
    [data],
  );

  // ---- Category options derived from the actual catalogue ----
  const availableCategories = useMemo<CategoryOption[]>(() => {
    const names = new Set<string>();
    packages.forEach((pkg) => pkg.categories.forEach((c) => names.add(c)));
    return [...names].sort().map((name) => ({ value: name, label: name }));
  }, [packages]);

  const searchParams = useSearchParams();
  const didHydrate = useRef(false);
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    const initial = searchParamsToFilters(new URLSearchParams(searchParams.toString()));
    setFilters(initial);
    setSearchInput(initial.search);
    setHydrated(true);
    window.scrollTo(0, 0);
  }, [searchParams]);

  // ---- Push debounced search text into filters ----
  useEffect(() => {
    if (!hydrated) return;
    setFilters((prev) => (prev.search === debouncedSearch ? prev : { ...prev, search: debouncedSearch }));
  }, [debouncedSearch, hydrated]);

  // ---- Sync filters -> URL (replace, no history spam) ----
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const params = filtersToSearchParams(filters);
    const query = params.toString();
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    // Only write when the URL actually changes — avoids redundant history churn
    // (and any feedback into search-param-driven effects).
    if (newUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', newUrl);
    }
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
      // "On request" packages (price 0) have no real price — don't drop them on a price filter.
      if (pkg.price > 0 && (pkg.price < filters.priceMin || pkg.price > filters.priceMax)) return false;
      if (pkg.durationDays < range.min || pkg.durationDays > range.max) return false;
      return true;
    });
  }, [packages, filters]);

  const sortedPackages = useMemo(() => {
    const sorter = SORT_OPTIONS[filters.sort] ?? SORT_OPTIONS.newest;
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
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, []);

  return {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    loading: isPending || !hydrated,
    error: isError,
    refetch,
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
