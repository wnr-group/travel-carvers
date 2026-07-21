'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import type { Lead } from '@/lib/types/lead';
import type { AdminLeadInput } from '@/lib/validations/lead.schema';

export const ADMIN_LEADS_KEY = ['admin-leads'] as const;

/** Record a lead that came in by phone or email rather than through the site. */
export function useCreateAdminLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminLeadInput) =>
      fetchJson<Lead>('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LEADS_KEY });
    },
  });
}

export function useAdminLeads() {
  return useQuery({
    queryKey: ADMIN_LEADS_KEY,
    queryFn: () => fetchJson<Lead[]>('/api/admin/leads'),
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
