'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import type {
  VisaAttachmentFileInput,
  VisaAttachmentInput,
} from '@/lib/validations/visa.schema';

export const VISA_ATTACHMENTS_KEY = ['visa-attachments'] as const;

export interface VisaAttachment {
  id: string;
  country_name: string;
  file_url: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

export function useAdminVisaAttachments() {
  return useQuery({
    queryKey: VISA_ATTACHMENTS_KEY,
    queryFn: () => fetchJson<VisaAttachment[]>('/api/admin/visa-attachments'),
  });
}

export function useCreateVisaAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VisaAttachmentInput) =>
      fetchJson<VisaAttachment>('/api/admin/visa-attachments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VISA_ATTACHMENTS_KEY }),
  });
}

/** Swaps the document, leaving the country name alone. */
export function useReplaceVisaAttachmentFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: VisaAttachmentFileInput }) =>
      fetchJson<VisaAttachment>(`/api/admin/visa-attachments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(file),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VISA_ATTACHMENTS_KEY }),
  });
}

export function useDeleteVisaAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<VisaAttachment>(`/api/admin/visa-attachments/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VISA_ATTACHMENTS_KEY }),
  });
}
