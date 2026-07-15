'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';

export const HOMEPAGE_SECTIONS_KEY = ['homepage-sections'] as const;

export interface HomepageSections {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  featured_title: string;
  featured_description: string;
  trending_title: string;
  trending_description: string;
  updated_at?: string;
}

export function useHomepageSections() {
  return useQuery({
    queryKey: HOMEPAGE_SECTIONS_KEY,
    queryFn: () => fetchJson<HomepageSections>('/api/admin/homepage-sections'),
  });
}

export function useUpdateHomepageSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HomepageSections) =>
      fetchJson<HomepageSections>('/api/admin/homepage-sections', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOMEPAGE_SECTIONS_KEY });
    },
    onError: (error) => console.error('[homepage sections mutation]', error),
  });
}
