'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Plus } from 'lucide-react';
import PackageFilters, {
  EMPTY_PACKAGE_FILTERS,
  type PackageFilterState,
} from '@/components/admin/PackageFilters';
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

const EMPTY_FILTERS: PackageFilterState = EMPTY_PACKAGE_FILTERS;

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
          onChange={setFilters}
          categories={categories ?? []}
          isLoadingCategories={isLoadingCategories}
        />
      </div>

      {isPending ? (
        <div className="rounded-lg bg-white p-12 text-center text-gray-500 shadow">Loading...</div>
      ) : isError ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold text-red-600">Could not load packages</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold">
            {hasActiveFilters ? 'No packages match these filters' : 'No packages yet'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters ? (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="text-brand-dark underline hover:text-brand-darkest"
              >
                Clear all filters
              </button>
            ) : (
              'Create your first package to start selling trips.'
            )}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <PackageTable packages={packages} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
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
