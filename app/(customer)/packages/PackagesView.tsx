'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import {
  usePackageFilters,
  PRICE_FLOOR,
  PRICE_CEIL,
  DURATION_RANGES,
  formatPrice,
} from '@/lib/hooks/usePackageFilters';
import Pagination from '@/components/ui/Pagination';
import { PackageCard } from '@/components/customer/PackageCard';
import { PackageFilters, Chip } from '@/components/customer/PackageFilters';
import { PackageSorting } from '@/components/customer/PackageSorting';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function PackageSearchFilter() {
  const {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    loading,
    error,
    refetch,
    sortedPackages,
    pagedPackages,
    resultCount,
    page,
    setPage,
    totalPages,
    pageSize,
    availableCategories,
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

  const handlePageChange = (next: number) => {
    setPage(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rangeStart = resultCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, resultCount);

  return (
    <div className="min-h-screen bg-brand-tint-light">
      <h1 className="sr-only">Tour Packages</h1>
      {/* Header / search bar — offset below the ~80px sticky navbar so it doesn't hide behind it. */}
      <div className="sticky top-20 z-30 bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
              <label htmlFor="package-search" className="sr-only">
                Search packages by name or description
              </label>
              <input
                id="package-search"
                type="search"
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
              categories={availableCategories}
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
              ) : error ? (
                'Unable to load packages'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-brand-darkest">
                    {rangeStart}–{rangeEnd}
                  </span>{' '}
                  of <span className="font-semibold text-brand-darkest">{resultCount}</span> packages
                </>
              )}
            </p>

            <PackageSorting value={filters.sort} onChange={setSort} />
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
              {filters.duration !== 'any' && DURATION_RANGES[filters.duration] && (
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
            <LoadingSkeleton variant="grid" count={6} />
          ) : error ? (
            <EmptyState
              variant="generic"
              icon={AlertTriangle}
              title="Couldn't load packages"
              description="Something went wrong while loading packages. Please check your connection and try again."
              actionLabel="Retry"
              onAction={() => refetch()}
            />
          ) : sortedPackages.length === 0 ? (
            <EmptyState
              variant="search"
              icon={Compass}
              title="No packages match these filters"
              description="Try widening your price range, choosing a different duration, or clearing filters to see everything we offer."
              actionLabel="Clear all filters"
              onAction={clearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pagedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-10"
              />
            </>
          )}
        </main>
      </div>

      {/* ---------------- Mobile drawer ---------------- */}
      <div className={`fixed inset-0 z-[150] lg:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="absolute inset-0 bg-brand-darkest/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-in-out ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center gap-3 border-b border-brand-light px-5 py-4">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="flex items-center justify-center rounded-full p-2 bg-brand-lightest text-brand-darkest border border-brand-light hover:bg-brand-medium hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-brand-darkest">Filters</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <PackageFilters
              filters={filters}
              categories={availableCategories}
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
              className="w-full rounded-full bg-gradient-brand-primary py-3 text-sm font-semibold text-white transition hover:opacity-90 shadow-md active:scale-95"
            >
              Apply Filters ({sortedPackages.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

