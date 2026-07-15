import { supabase } from '@/lib/supabase/client';

/**
 * Public, client-safe read of a package's *approved* reviews.
 */
export async function getApprovedReviews(packageId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('reviewer_name, rating, review_text, created_at')
    .eq('package_id', packageId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
