'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';

export const TESTIMONIALS_KEY = ['testimonials'] as const;

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string;
  review_text: string;
  rating: number;
  photo_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useTestimonials() {
  return useQuery({
    queryKey: TESTIMONIALS_KEY,
    queryFn: () => fetchJson<Testimonial[]>('/api/admin/testimonials'),
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) =>
      fetchJson<Testimonial>('/api/admin/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEY });
    },
    onError: (error) => console.error('[testimonial creation mutation]', error),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>> }) =>
      fetchJson<Testimonial>(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEY });
    },
    onError: (error) => console.error('[testimonial update mutation]', error),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ success: boolean }>(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEY });
    },
    onError: (error) => console.error('[testimonial deletion mutation]', error),
  });
}
