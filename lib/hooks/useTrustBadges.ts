'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';

export const TRUST_BADGES_KEY = ['trust-badges'] as const;

export interface TrustBadge {
  id: string;
  text: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export function useTrustBadges() {
  return useQuery({
    queryKey: TRUST_BADGES_KEY,
    queryFn: () => fetchJson<TrustBadge[]>('/api/admin/trust-badges'),
  });
}

export function useCreateTrustBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TrustBadge, 'id' | 'created_at'>) =>
      fetchJson<TrustBadge>('/api/admin/trust-badges', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUST_BADGES_KEY });
    },
    onError: (error) => console.error('[trust badge mutation]', error),
  });
}

export function useDeleteTrustBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ success: boolean }>(`/api/admin/trust-badges/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUST_BADGES_KEY });
    },
    onError: (error) => console.error('[trust badge mutation]', error),
  });
}
