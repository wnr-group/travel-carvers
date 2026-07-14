import type { PackageFilters } from '@/lib/validations/package.schema'

/**
 * Shared React Query keys.
 *
 * The admin categories key is used by both the list query and the mutations that
 * invalidate it; keeping it in one place stops a typo in one file from silently breaking
 * cache invalidation in another.
 */
export const ADMIN_CATEGORIES_KEY = ['admin-categories'] as const

export const ADMIN_PACKAGES_KEY = ['admin-packages'] as const

/**
 * The filters are part of the key, so changing one is what makes React Query refetch —
 * there is no manual refetch call anywhere. Mutations can still invalidate every filter
 * combination at once by passing the ADMIN_PACKAGES_KEY prefix.
 */
export const adminPackagesKey = (filters: PackageFilters) =>
  [...ADMIN_PACKAGES_KEY, filters] as const
