'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '@/lib/api/fetchJson'
import { ADMIN_ANALYTICS_KEY } from '@/lib/queryKeys'
import type { AnalyticsSummary } from '@/lib/api/analytics'

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ADMIN_ANALYTICS_KEY,
    queryFn: () => fetchJson<AnalyticsSummary>('/api/admin/analytics'),
    staleTime: 60 * 1000, 
  })
}
