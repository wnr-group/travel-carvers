'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import type { Review } from '@/lib/types/review';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const ADMIN_REVIEWS_KEY = ['admin-reviews'] as const;

export function useAdminReviews() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('reviews-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        () => {
          queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ADMIN_REVIEWS_KEY,
    queryFn: () => fetchJson<Review[]>('/api/admin/reviews'),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<Review>(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ action: 'approve' }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
    },
    onError: (error) => console.error('[admin review mutation]', error),
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<Review>(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ action: 'reject' }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
    },
    onError: (error) => console.error('[admin review mutation]', error),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
    },
    onError: (error) => console.error('[admin review mutation]', error),
  });
}
