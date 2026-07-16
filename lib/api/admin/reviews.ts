import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Admin-only review moderation.
 */

/**
 * Admin: Get all reviews
 */
export async function getAllReviews() {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select(`
      *,
      packages (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Admin: Approve review
 */
export async function approveReview(id: string) {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Reject review
 */
export async function rejectReview(id: string) {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update({ is_approved: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete review
 */
export async function deleteReview(id: string) {
  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
