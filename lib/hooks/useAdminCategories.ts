'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { ADMIN_CATEGORIES_KEY } from '@/lib/queryKeys'
import type { Category } from '@/lib/types/category'

/**
 * Every category, including inactive ones — this is the admin view.
 *
 * Shared by the categories page (which lists them) and the packages page (which filters by
 * them), so both read from the same cache entry and one invalidation updates both.
 */
export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => fetchJson<Category[]>('/api/admin/categories'),
  })
}
