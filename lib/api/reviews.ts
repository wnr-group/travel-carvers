'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { reviewSchema, type ReviewFormData } from '@/lib/validations/review.schema';
/**
 * Public: Submit a review.
 */
export async function createReview(input: ReviewFormData) {
  const reviewData = reviewSchema.parse(input);

  const isApproved = reviewData.rating >= 4 ? true : null;

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      package_id: reviewData.package_id,
      reviewer_name: reviewData.reviewer_name,
      reviewer_email: reviewData.reviewer_email,
      rating: reviewData.rating,
      review_text: reviewData.review_text,
      is_approved: isApproved,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
