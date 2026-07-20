'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import type { Lead } from '@/lib/types/lead';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const ADMIN_LEADS_KEY = ['admin-leads'] as const;

export function useAdminLeads() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          queryClient.invalidateQueries({ queryKey: ADMIN_LEADS_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ADMIN_LEADS_KEY,
    queryFn: () => fetchJson<Lead[]>('/api/admin/leads'),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetchJson<Lead>(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LEADS_KEY });
    },
    onError: (error) => console.error('[admin lead mutation]', error),
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LEADS_KEY });
    },
    onError: (error) => console.error('[admin lead mutation]', error),
  });
}
