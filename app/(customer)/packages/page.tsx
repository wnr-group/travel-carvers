'use client';

/**
 * PackageSearchFilter
 * ------------------------------------------------------------------
 * Search + filter system for travel packages.
 * Uses the Travel Carvers sage-green brand palette defined in globals.css
 * (.bg-brand-*, .text-brand-*, .border-brand-*, .bg-gradient-brand-*).
 *
 * Drop-in notes:
 * - Replace ALL_PACKAGES with your real data source (API call / props).
 * - Replace mock images with your CDN URLs.
 * - This file has no router dependency: it reads/writes the URL directly
 *   via window.history, so it works the same in the Next.js app router,
 *   pages router, or any client-rendered React setup.
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Clock3,
  MapPin,
  Compass,
  Mountain,
  Waves,
  Landmark,
  PawPrint,
  Building2,
  Tent,
} from 'lucide-react';

/* ============================== Types ============================== */

type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

interface TravelPackage {
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

interface Filters {
  search: string;
  categories: string[];
  difficulty: Difficulty[];
  priceMin: number;
  priceMax: number;
  duration: string; // key into DURATION_RANGES
  sort: string; // key into SORT_OPTIONS
}

/* ============================ Constants ============================= */

const PRICE_FLOOR = 0;
const PRICE_CEIL = 5000;

const CATEGORIES = [
  { value: 'Beach', label: 'Beach', icon: Waves },
  { value: 'Adventure', label: 'Adventure', icon: Compass },
  { value: 'Mountain', label: 'Mountain', icon: Mountain },
  { value: 'Cultural', label: 'Cultural', icon: Landmark },
  { value: 'Wildlife', label: 'Wildlife', icon: PawPrint },
  { value: 'City', label: 'City', icon: Building2 },
] as const;

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

const DURATION_RANGES: Record<string, { label: string; min: number; max: number }> = {
  any: { label: 'Any duration', min: 0, max: Infinity },
  '1-3': { label: '1 - 3 days', min: 1, max: 3 },
  '4-7': { label: '4 - 7 days', min: 4, max: 7 },
  '8-14': { label: '8 - 14 days', min: 8, max: 14 },
  '15+': { label: '15+ days', min: 15, max: Infinity },
};

const SORT_OPTIONS: Record<string, { label: string; compare: (a: TravelPackage, b: TravelPackage) => number }> = {
  popular: { label: 'Most popular', compare: (a, b) => b.popularity - a.popularity },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => b.price - a.price },
  'duration-asc': { label: 'Duration: shortest first', compare: (a, b) => a.durationDays - b.durationDays },
  'duration-desc': { label: 'Duration: longest first', compare: (a, b) => b.durationDays - a.durationDays },
  rating: { label: 'Highest rated', compare: (a, b) => b.rating - a.rating },
};

const DEFAULT_FILTERS: Filters = {
  search: '',
  categories: [],
  difficulty: [],
  priceMin: PRICE_FLOOR,
  priceMax: PRICE_CEIL,
  duration: 'any',
  sort: 'popular',
};

/* ============================ Mock data ============================= */
/* Swap this out for a real fetch/props source. Kept deterministic via
   picsum.photos seeds so the file renders standalone. */

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

const ALL_PACKAGES = buildMockPackages();
const TOTAL_CATALOG_SIZE = 156; // stand-in for a larger real catalog size

/* ============================== Helpers ============================== */

function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').filter(Boolean);
}

function filtersToSearchParams(filters: Filters): URLSearchParams {
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

function searchParamsToFilters(params: URLSearchParams): Filters {
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

function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.search) count += 1;
  count += filters.categories.length;
  count += filters.difficulty.length;
  if (filters.priceMin !== PRICE_FLOOR || filters.priceMax !== PRICE_CEIL) count += 1;
  if (filters.duration !== 'any') count += 1;
  return count;
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

/* =============================== Hook ================================ */

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

/* ============================= Component ============================= */

export default function PackageSearchFilter() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  /* -------------------------------- Render ------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* Header / search bar */}
      <div className="sticky top-0 z-30 border-b border-brand-light bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search packages by name or description..."
                className="w-full rounded-full border border-brand-light bg-white py-2.5 pl-10 pr-4 text-sm text-brand-darkest placeholder:text-brand-medium/70 outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="relative flex shrink-0 items-center gap-2 rounded-full border border-brand-light bg-white px-4 py-2.5 text-sm font-medium text-brand-darkest transition hover:bg-brand-lightest lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-dark px-1 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* ---------------- Desktop sidebar ---------------- */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-brand-light bg-white p-5">
            <FilterPanel
              filters={filters}
              activeFilterCount={activeFilterCount}
              toggleCategory={toggleCategory}
              toggleDifficulty={toggleDifficulty}
              setPriceMin={setPriceMin}
              setPriceMax={setPriceMax}
              setDuration={setDuration}
              clearFilters={clearFilters}
            />
          </div>
        </aside>

        {/* ---------------- Results ---------------- */}
        <main className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-medium">
              {loading ? (
                'Searching packages…'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-brand-darkest">{sortedPackages.length}</span> of{' '}
                  <span className="font-semibold text-brand-darkest">{TOTAL_CATALOG_SIZE}</span> packages
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-brand-medium">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-full border border-brand-light bg-white py-2 pl-4 pr-9 text-sm font-medium text-brand-darkest outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
                >
                  {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                    <option key={key} value={key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {filters.search && (
                <Chip label={`"${filters.search}"`} onRemove={() => setSearchInput('')} />
              )}
              {filters.categories.map((c) => (
                <Chip key={c} label={c} onRemove={() => toggleCategory(c)} />
              ))}
              {filters.difficulty.map((d) => (
                <Chip key={d} label={d} onRemove={() => toggleDifficulty(d)} />
              ))}
              {(filters.priceMin !== PRICE_FLOOR || filters.priceMax !== PRICE_CEIL) && (
                <Chip
                  label={`${formatPrice(filters.priceMin)} – ${formatPrice(filters.priceMax)}`}
                  onRemove={() => setFilters((prev) => ({ ...prev, priceMin: PRICE_FLOOR, priceMax: PRICE_CEIL }))}
                />
              )}
              {filters.duration !== 'any' && (
                <Chip label={DURATION_RANGES[filters.duration].label} onRemove={() => setDuration('any')} />
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-brand-dark underline-offset-2 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <SkeletonGrid />
          ) : sortedPackages.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ---------------- Mobile drawer ---------------- */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-darkest/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform">
            <div className="flex items-center justify-between border-b border-brand-light px-5 py-4">
              <h2 className="text-base font-semibold text-brand-darkest">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-1.5 text-brand-medium transition hover:bg-brand-lightest"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterPanel
                filters={filters}
                activeFilterCount={activeFilterCount}
                toggleCategory={toggleCategory}
                toggleDifficulty={toggleDifficulty}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
                setDuration={setDuration}
                clearFilters={clearFilters}
              />
            </div>
            <div className="border-t border-brand-light px-5 py-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-gradient-brand-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Show {sortedPackages.length} packages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================= Filter panel (shared) ========================= */

interface FilterPanelProps {
  filters: Filters;
  activeFilterCount: number;
  toggleCategory: (value: string) => void;
  toggleDifficulty: (value: Difficulty) => void;
  setPriceMin: (value: number) => void;
  setPriceMax: (value: number) => void;
  setDuration: (value: string) => void;
  clearFilters: () => void;
}

function FilterPanel({
  filters,
  activeFilterCount,
  toggleCategory,
  toggleDifficulty,
  setPriceMin,
  setPriceMax,
  setDuration,
  clearFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-base font-semibold text-brand-darkest lg:block">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-sm font-medium text-brand-dark transition hover:opacity-70"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Category */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(({ value, label, icon: Icon }) => {
            const checked = filters.categories.includes(value);
            return (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${checked
                  ? 'border-brand-medium bg-brand-lightest text-brand-darkest'
                  : 'border-transparent text-brand-darkest/80 hover:bg-brand-lightest/60'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(value)}
                  className="h-4 w-4 rounded border-brand-light text-brand-dark accent-[var(--logo-forest)]"
                />
                <Icon className="h-4 w-4 text-brand-medium" />
                {label}
              </label>
            );
          })}
        </div>
      </section>

      {/* Price range */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Price range</h3>
        <div className="mb-2 flex items-center justify-between text-sm text-brand-medium">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
        <div className="relative h-6">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-brand-lightest" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-medium"
            style={{
              left: `${(filters.priceMin / PRICE_CEIL) * 100}%`,
              right: `${100 - (filters.priceMax / PRICE_CEIL) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
          />
        </div>
        <style>{`
          .range-thumb::-webkit-slider-thumb {
            pointer-events: auto;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: var(--logo-forest);
            border: 2px solid white;
            box-shadow: 0 0 0 1px var(--logo-sage-medium);
            cursor: pointer;
          }
          .range-thumb::-moz-range-thumb {
            pointer-events: auto;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: var(--logo-forest);
            border: 2px solid white;
            box-shadow: 0 0 0 1px var(--logo-sage-medium);
            cursor: pointer;
          }
        `}</style>
      </section>

      {/* Duration */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Duration</h3>
        <div className="relative">
          <select
            value={filters.duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full appearance-none rounded-lg border border-brand-light bg-white py-2.5 pl-3 pr-9 text-sm text-brand-darkest outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
          >
            {Object.entries(DURATION_RANGES).map(([key, range]) => (
              <option key={key} value={key}>
                {range.label}
              </option>
            ))}
          </select>
          <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
        </div>
      </section>

      {/* Difficulty */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((level) => {
            const checked = filters.difficulty.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleDifficulty(level)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${checked
                  ? 'border-brand-dark bg-brand-dark text-white'
                  : 'border-brand-light text-brand-darkest hover:bg-brand-lightest'
                  }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* =============================== Bits =============================== */

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1.5 rounded-full border border-brand-light bg-brand-lightest px-3 py-1 text-xs font-medium text-brand-darkest transition hover:border-brand-medium"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Easy: 'bg-brand-lightest text-brand-darkest',
    Moderate: 'bg-brand-light/70 text-brand-darkest',
    Challenging: 'bg-brand-dark text-white',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[difficulty]}`}>{difficulty}</span>
  );
}

function PackageCard({ pkg }: { pkg: TravelPackage }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-light bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pkg.image}
          alt={pkg.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="overlay-brand-primary absolute inset-0" />
        <div className="absolute left-3 top-3">
          <DifficultyBadge difficulty={pkg.difficulty} />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white">
          <MapPin className="h-3.5 w-3.5" />
          {pkg.location}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-brand-darkest">{pkg.name}</h3>
        </div>
        <p className="mb-3 line-clamp-2 text-xs text-brand-medium">{pkg.description}</p>

        <div className="mb-3 flex items-center gap-3 text-xs text-brand-medium">
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {pkg.durationDays} days
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-brand-dark" />
            {pkg.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Tent className="h-3.5 w-3.5" />
            {pkg.category}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-brand-lightest pt-3">
          <div>
            <span className="text-base font-bold text-brand-darkest">{formatPrice(pkg.price)}</span>
            <span className="ml-1 text-xs text-brand-medium">/ person</span>
          </div>
          <button
            type="button"
            className="rounded-full bg-gradient-brand-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-brand-light bg-white">
          <div className="h-44 w-full animate-pulse bg-brand-lightest" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-lightest" />
            <div className="h-3 w-full animate-pulse rounded bg-brand-lightest" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-brand-lightest" />
            <div className="h-8 w-full animate-pulse rounded-full bg-brand-lightest" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-light bg-brand-lightest/40 px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-lightest">
        <Compass className="h-7 w-7 text-brand-medium" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-brand-darkest">No packages match these filters</h3>
      <p className="mb-5 max-w-sm text-sm text-brand-medium">
        Try widening your price range, choosing a different duration, or clearing filters to see everything we
        offer.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full bg-gradient-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Clear all filters
      </button>
    </div>
  );
}