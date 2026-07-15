'use server';

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Public: Get approved reviews for a package
 */
export async function getPackageReviews(packageId: string) {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('package_id', packageId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Public: Submit a review
 * Note: Reviews with 4-5 stars are auto-approved
 */
export async function createReview(reviewData: {
  package_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string;
}) {
  // Auto-approve if 4-5 stars
  const isApproved = reviewData.rating >= 4 ? true : null;

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      ...reviewData,
      is_approved: isApproved,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Get all reviews (requires server-side)
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
 * Admin: Approve review (requires server-side)
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
 * Admin: Reject review (requires server-side)
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
 * Admin: Delete review (requires server-side)
 */
export async function deleteReview(id: string) {

  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
