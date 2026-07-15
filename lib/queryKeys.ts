export interface PackageFilters {
  status?: string;
  category?: string;
  search?: string;
  [key: string]: string | undefined;
}

/**
 * Shared React Query keys.
 */
export const ADMIN_CATEGORIES_KEY = ['admin-categories'] as const
export const ADMIN_SUBCATEGORIES_KEY = ['admin-subcategories'] as const

export const ADMIN_PACKAGES_KEY = ['admin-packages'] as const

export const adminPackagesKey = (filters: PackageFilters) =>
  [...ADMIN_PACKAGES_KEY, filters] as const

export const adminPackageKey = (id: string) => [...ADMIN_PACKAGES_KEY, 'detail', id] as const
