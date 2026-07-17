'use server';

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';

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
export async function createReview(
  reviewData: {
    package_id: string;
    reviewer_name: string;
    reviewer_email: string;
    rating: number;
    review_text: string;
  },
  photoUrls?: string[]
) {
  // Auto-approve if 4-5 stars
  const isApproved = reviewData.rating >= 4 ? true : null;

  const { data: review, error: reviewError } = await supabaseAdmin
    .from('reviews')
    .insert({
      ...reviewData,
      is_approved: isApproved,
    })
    .select()
    .single();

  if (reviewError) throw reviewError;

  if (photoUrls && photoUrls.length > 0) {
    const photoRows = photoUrls.map((url) => ({
      review_id: review.id,
      image_url: url,
    }));
    const { error: photosError } = await supabaseAdmin
      .from('review_photos')
      .insert(photoRows);

    if (photosError) throw photosError;
  }

  return review;
}

/**
 * Public: Upload review photo to review-images bucket
 */
export async function uploadReviewPhoto(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // Verify size and type
  if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB limit');

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowedMimes.includes(file.type) && !allowedExts.includes(fileExt)) {
    throw new Error('Unsupported image format');
  }

  const filename = `${crypto.randomUUID()}.${fileExt}`;

  // Resolve content type robustly
  let contentType = file.type;
  if (!contentType || contentType === 'application/octet-stream') {
    if (fileExt === 'webp') contentType = 'image/webp';
    else if (fileExt === 'png') contentType = 'image/png';
    else contentType = 'image/jpeg';
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from('review-images')
    .upload(filename, buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabaseAdmin.storage
    .from('review-images')
    .getPublicUrl(filename);

  return urlData.publicUrl;
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
