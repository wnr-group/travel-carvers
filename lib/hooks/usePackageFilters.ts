'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

/* ============================== Types ============================== */

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  durationDays: number;
  difficulty: Difficulty;
  rating: number;
  popularity: number; // 0-100, higher = more popular
  image: string;
  location: string;
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
export const PRICE_CEIL = 5000;

export const CATEGORIES = [
  { value: 'Beach', label: 'Beach' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Mountain', label: 'Mountain' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Wildlife', label: 'Wildlife' },
  { value: 'City', label: 'City' },
] as const;

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

export const DURATION_RANGES: Record<string, { label: string; min: number; max: number }> = {
  any: { label: 'Any duration', min: 0, max: Infinity },
  '1-3': { label: '1 - 3 days', min: 1, max: 3 },
  '4-7': { label: '4 - 7 days', min: 4, max: 7 },
  '8-14': { label: '8 - 14 days', min: 8, max: 14 },
  '15+': { label: '15+ days', min: 15, max: Infinity },
};

export const SORT_OPTIONS: Record<string, { label: string; compare: (a: TravelPackage, b: TravelPackage) => number }> = {
  popular: { label: 'Most popular', compare: (a, b) => b.popularity - a.popularity },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => b.price - a.price },
  'duration-asc': { label: 'Duration: shortest first', compare: (a, b) => a.durationDays - b.durationDays },
  'duration-desc': { label: 'Duration: longest first', compare: (a, b) => b.durationDays - a.durationDays },
  rating: { label: 'Highest rated', compare: (a, b) => b.rating - a.rating },
};

export const DEFAULT_FILTERS: Filters = {
  search: '',
  categories: [],
  difficulty: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  duration: 'any',
  sort: 'popular',
};

/* ============================ Mock data ============================= */

const NAME_PARTS: Record<string, string[]> = {
  Beach: ['Coastal Escape', 'Island Drift', 'Lagoon Retreat', 'Reef & Shore'],
  Adventure: ['Canyon Rush', 'Rapids Run', 'Jungle Trek', 'Desert Crossing'],
  Mountain: ['Summit Trail', 'Alpine Ridge', 'Peak Circuit', 'Highland Pass'],
  Cultural: ['Old Town Wander', 'Heritage Route', 'Artisan Trail', 'Temple Circuit'],
  Wildlife: ['Safari Horizon', 'Wild Frontier', 'Migration Watch', 'Reserve Expedition'],
  City: ['Skyline Sampler', 'Downtown Dash', 'Metro Discovery', 'Rooftop Circuit'],
};

const LOCATIONS: Record<string, string[]> = {
  Beach: ['Zanzibar', 'Palawan', 'Maldives', 'Amalfi Coast'],
  Adventure: ['Patagonia', 'Costa Rica', 'Iceland', 'Nepal'],
  Mountain: ['Swiss Alps', 'Dolomites', 'Rockies', 'Andes'],
  Cultural: ['Kyoto', 'Marrakech', 'Istanbul', 'Oaxaca'],
  Wildlife: ['Serengeti', 'Galápagos', 'Borneo', 'Kruger'],
  City: ['Lisbon', 'Singapore', 'Buenos Aires', 'Seoul'],
};

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildMockPackages(): TravelPackage[] {
  const packages: TravelPackage[] = [];
  const categories = CATEGORIES.map((c) => c.value);
  let idCounter = 1;

  categories.forEach((category, catIdx) => {
    const names = NAME_PARTS[category];
    const locations = LOCATIONS[category];
    names.forEach((namePart, i) => {
      const rand = seedRandom(catIdx * 100 + i * 7 + 3);
      const durationDays = Math.floor(rand() * 13) + 2; // 2-14
      const price = Math.round((rand() * 4200 + 300) / 10) * 10; // 300-4500
      const difficulty = DIFFICULTIES[Math.floor(rand() * DIFFICULTIES.length)];
      const rating = Math.round((rand() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0
      const popularity = Math.round(rand() * 100);
      const location = locations[i % locations.length];

      packages.push({
        id: `pkg-${idCounter++}`,
        name: `${location} ${namePart}`,
        description: `A ${durationDays}-day ${category.toLowerCase()} experience through ${location}, rated ${difficulty.toLowerCase()} for travelers seeking something memorable.`,
        category,
        price,
        durationDays,
        difficulty,
        rating,
        popularity,
        location,
        image: `https://picsum.photos/seed/travelcarvers-${idCounter}/480/320`,
      });
    });
  });

  return packages;
}

export const ALL_PACKAGES = buildMockPackages();
export const TOTAL_CATALOG_SIZE = 156; // stand-in for a larger real catalog size

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
  if (filters.sort !== 'popular') params.set('sort', filters.sort);
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
    sort: params.get('sort') ?? 'popular',
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
  return `$${value.toLocaleString('en-US')}`;
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
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 350);

  // ---- Hydrate filters from the URL on mount ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initial = searchParamsToFilters(params);
    setFilters(initial);
    setSearchInput(initial.search);
    setHydrated(true);
    window.scrollTo(0, 0);
  }, []);

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
    window.history.replaceState(null, '', newUrl);
  }, [filters, hydrated]);

  // ---- Simulate fetch latency whenever filters change ----
  useEffect(() => {
    if (!hydrated) return;
    setLoading(true);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => setLoading(false), 350);
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [filters, hydrated]);

  /* ------------------------------ Derived ------------------------------ */

  const filteredPackages = useMemo(() => {
    const range = DURATION_RANGES[filters.duration] ?? DURATION_RANGES.any;
    const query = filters.search.trim().toLowerCase();

    return ALL_PACKAGES.filter((pkg) => {
      if (query) {
        const haystack = `${pkg.name} ${pkg.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.categories.length && !filters.categories.includes(pkg.category)) return false;
      if (filters.difficulty.length && !filters.difficulty.includes(pkg.difficulty)) return false;
      if (pkg.price < filters.priceMin || pkg.price > filters.priceMax) return false;
      if (pkg.durationDays < range.min || pkg.durationDays > range.max) return false;
      return true;
    });
  }, [filters]);

  const sortedPackages = useMemo(() => {
    const sorter = SORT_OPTIONS[filters.sort] ?? SORT_OPTIONS.popular;
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
    loading,
    hydrated,
    sortedPackages,
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
