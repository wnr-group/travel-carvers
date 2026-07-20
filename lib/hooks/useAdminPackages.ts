'use client'

import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { adminPackagesKey, ADMIN_PACKAGES_KEY } from '@/lib/queryKeys'
import type { AdminPackage } from '@/lib/types/package'
import type { PackageFilters } from '@/lib/validations/package.schema'

/**
 * `keepPreviousData` holds the previous results on screen while the new ones load
 */
export function useAdminPackages(filters: PackageFilters) {
  return useQuery({
    queryKey: adminPackagesKey(filters),
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      if (filters.category) params.set('category', filters.category)

      const query = params.toString()
      return fetchJson<AdminPackage[]>(`/api/admin/packages${query ? `?${query}` : ''}`)
    },
    placeholderData: keepPreviousData,
  })
}

export function useDeletePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ success: boolean }>(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PACKAGES_KEY })
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })
}
