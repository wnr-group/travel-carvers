'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { ADMIN_CATEGORIES_KEY } from '@/lib/queryKeys'
import type { Category } from '@/lib/types/category'

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => fetchJson<Category[]>('/api/admin/categories'),
  })
}
