import { supabase } from '@/lib/supabase/client';

export interface HomepageSectionsContent {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_text: string | null;
  featured_title: string | null;
  featured_description: string | null;
  trending_title: string | null;
  trending_description: string | null;
}

const FIELDS = `
  hero_title,
  hero_subtitle,
  hero_cta_text,
  featured_title,
  featured_description,
  trending_title,
  trending_description
`;

export async function getHomepageSections(): Promise<HomepageSectionsContent | null> {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select(FIELDS)
    .maybeSingle();

  if (error) throw error;
  return data as HomepageSectionsContent | null;
}
