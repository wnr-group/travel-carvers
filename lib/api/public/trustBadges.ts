import { supabase } from '@/lib/supabase/client';

export interface TrustBadge {
  id: string;
  text: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export async function getPublicTrustBadges(): Promise<TrustBadge[]> {
  const { data, error } = await supabase
    .from('trust_badges')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public trust badges:', error);
    throw error;
  }
  return data || [];
}
