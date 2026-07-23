'use client'

import { Search, X } from 'lucide-react'
import { PACKAGE_STATUSES, PACKAGE_STATUS_LABELS, type PackageStatus } from '@/lib/types/package'
import type { Category } from '@/lib/types/category'

export interface PackageFilterState {
  search: string
  status: PackageStatus | ''
  category: string
}

interface PackageFiltersProps {
  filters: PackageFilterState
  onChange: (filters: PackageFilterState) => void
  categories: Category[]
  isLoadingCategories: boolean
}

const SELECT_CLASSES =
  'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium'

export const EMPTY_PACKAGE_FILTERS: PackageFilterState = { search: '', status: '', category: '' }

export default function PackageFilters({
  filters,
  onChange,
  categories,
  isLoadingCategories,
}: PackageFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' || filters.status !== '' || filters.category !== ''

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by title..."
          aria-label="Search packages by title"
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as PackageStatus | '' })}
        aria-label="Filter by status"
        className={SELECT_CLASSES}
      >
        <option value="">All statuses</option>
        {PACKAGE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {PACKAGE_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Filter by category"
        disabled={isLoadingCategories}
        className={SELECT_CLASSES}
      >
        <option value="">{isLoadingCategories ? 'Loading categories...' : 'All categories'}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Only offered when there is something to clear, so it never reads as a dead button. */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_PACKAGE_FILTERS)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand-darkest"
        >
          <X aria-hidden="true" className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </div>
  )
}
