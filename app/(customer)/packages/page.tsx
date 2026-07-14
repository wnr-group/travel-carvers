'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Compass,
} from 'lucide-react';
import {
  usePackageFilters,
  SORT_OPTIONS,
  TOTAL_CATALOG_SIZE,
  PRICE_FLOOR,
  PRICE_CEIL,
  DURATION_RANGES,
  formatPrice,
} from '@/lib/hooks/usePackageFilters';
import { PackageCard } from '@/components/customer/PackageCard';
import { PackageFilters, Chip } from '@/components/customer/PackageFilters';

export default function PackageSearchFilter() {
  const {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    loading,
    sortedPackages,
    activeFilterCount,
    toggleCategory,
    toggleDifficulty,
    setPriceMin,
    setPriceMax,
    setDuration,
    setSort,
    clearFilters,
  } = usePackageFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header / search bar */}
      <div className="sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search packages by name or description..."
                className="w-full rounded-full border border-brand-light bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-brand-darkest placeholder:text-brand-medium/70 outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="relative flex shrink-0 items-center gap-2 rounded-full border border-brand-light bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-brand-darkest transition hover:bg-brand-lightest lg:hidden"
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
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-brand-light bg-[var(--background)] p-5">
            <PackageFilters
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
                  className="appearance-none rounded-full border border-brand-light bg-[var(--background)] py-2 pl-4 pr-9 text-sm font-medium text-brand-darkest outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
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
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--background)] shadow-2xl transition-transform">
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
              <PackageFilters
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)]">
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