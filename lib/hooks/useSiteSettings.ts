'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import { getSiteSettings } from '@/lib/api/public/siteSettings';

/**
 * Public read of admin-managed contact details, for customer-facing surfaces
 * (footer, contact page). Reads the anon-visible site-settings row directly,
 * unlike {@link useSiteSettings} which hits the admin-guarded API.
 */
export function usePublicSiteSettings() {
  return useQuery({
    queryKey: ['site-settings', 'public'],
    queryFn: getSiteSettings,
    staleTime: 10 * 60 * 1000,
  });
}

export const SITE_SETTINGS_KEY = ['site-settings'] as const;

export interface SiteSettings {
  id?: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  show_prices_globally: boolean;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  updated_at?: string;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: () => fetchJson<SiteSettings>('/api/admin/site-settings'),
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SiteSettings) =>
      fetchJson<SiteSettings>('/api/admin/site-settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    },
    onError: (error) => console.error('[site settings mutation]', error),
  });
}
