'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { adminPackageKey } from '@/lib/queryKeys'
import type { PackageFormInput } from '@/lib/validations/package.schema'


export function useAdminPackage(id: string) {
  return useQuery({
    queryKey: adminPackageKey(id),
    queryFn: () => fetchJson<PackageFormInput>(`/api/admin/packages/${id}`),
    staleTime: Infinity,
  })
}
