'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import PackageFilters, { type PackageFilterState } from '@/components/admin/PackageFilters';
import PackageTable from '@/components/admin/PackageTable';
import PackageCard from '@/components/admin/PackageCard';
import { useAdminPackages } from '@/lib/hooks/useAdminPackages';
import { useAdminCategories } from '@/lib/hooks/useAdminCategories';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import type { PackageFilters as PackageFilterValues } from '@/lib/validations/package.schema';

type ViewMode = 'table' | 'grid';

const VIEW_MODE_STORAGE_KEY = 'admin:packages:view';

const isViewMode = (value: string): value is ViewMode =>
  value === 'table' || value === 'grid';

const EMPTY_FILTERS: PackageFilterState = { search: '', status: '', category: '' };

export default function PackagesPage() {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    VIEW_MODE_STORAGE_KEY,
    'table',
    isViewMode
  );
  const [filters, setFilters] = useState<PackageFilterState>(EMPTY_FILTERS);

  const debouncedSearch = useDebouncedValue(filters.search);

  const queryFilters: PackageFilterValues = useMemo(
    () => ({
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.category ? { category: filters.category } : {}),
    }),
    [debouncedSearch, filters.status, filters.category]
  );

  const { data: packages, isPending, isError, error } = useAdminPackages(queryFilters);
  const { data: categories, isPending: isLoadingCategories } = useAdminCategories();

  const hasActiveFilters = Object.keys(queryFilters).length > 0;

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleFilterChange = (newFilters: PackageFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const totalItems = packages?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPageSafe = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedPackages = useMemo(
    () => (packages ? packages.slice(startIndex, endIndex) : []),
    [packages, startIndex, endIndex]
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-darkest">Packages</h1>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-300 bg-white p-1">
            <ViewButton
              label="Table view"
              isActive={viewMode === 'table'}
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </ViewButton>
            <ViewButton
              label="Card view"
              isActive={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </ViewButton>
          </div>

          <Link
            href="/admin/packages/new"
            className="flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-white transition-colors hover:bg-brand-darkest"
          >
            <Plus className="h-5 w-5" /> Add Package
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <PackageFilters
          filters={filters}
          onChange={handleFilterChange}
          categories={categories ?? []}
          isLoadingCategories={isLoadingCategories}
        />
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 text-center shadow-sm border border-gray-100">
          <Loader2 className="w-9 h-9 animate-spin text-brand-dark mb-3" />
          <p className="text-base font-semibold text-gray-800">Loading packages...</p>
          <p className="text-xs text-gray-500 mt-1">Please wait while we fetch your package data.</p>
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold text-red-600">Could not load packages</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : totalItems === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold">
            {hasActiveFilters ? 'No packages match these filters' : 'No packages yet'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters ? (
              <button
                onClick={() => handleFilterChange(EMPTY_FILTERS)}
                className="text-brand-dark underline hover:text-brand-darkest"
              >
                Clear all filters
              </button>
            ) : (
              'Create your first package to start selling trips.'
            )}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <PackageTable packages={paginatedPackages} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          {/* Pagination bar */}
          {totalItems > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="text-sm text-gray-700 font-medium">
                Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
                <span className="font-bold text-gray-900">{endIndex}</span> of{' '}
                <span className="font-bold text-gray-900">{totalItems}</span> packages
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPageSafe === 1}
                  className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPageSafe) <= 1)
                  .map((p, idx, arr) => {
                    const isCurrent = p === currentPageSafe;
                    return (
                      <div key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-xs text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                            isCurrent
                              ? 'bg-brand-dark text-white shadow-sm'
                              : 'border border-transparent text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    );
                  })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPageSafe === totalPages || totalPages <= 1}
                  className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ViewButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        'rounded-md p-2 transition-colors',
        isActive ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-100'
      )}
    >
      {children}
    </button>
  );
}
