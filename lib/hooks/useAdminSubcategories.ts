'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { ADMIN_SUBCATEGORIES_KEY } from '@/lib/queryKeys'
import type { Subcategory } from '@/lib/types/category'

export function useAdminSubcategories() {
  return useQuery({
    queryKey: ADMIN_SUBCATEGORIES_KEY,
    queryFn: () => fetchJson<Subcategory[]>('/api/admin/subcategories'),
  })
}
