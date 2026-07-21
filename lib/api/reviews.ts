'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { checkRateLimit, clientRateKey } from '@/lib/api/rateLimit';
import crypto from 'crypto';

const REVIEW_BUCKET = 'review-images';
const MAX_REVIEW_PHOTOS = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function reviewImagePublicPrefix(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return `${base}/storage/v1/object/public/${REVIEW_BUCKET}/`;
}

function reviewImageObjectPath(url: string): string | null {
  const prefix = reviewImagePublicPrefix();
  if (!url.startsWith(prefix)) return null;
  const path = decodeURIComponent(url.slice(prefix.length));
  if (!path || path.includes('..') || path.startsWith('/')) return null;
  return path;
}

/**
 * Public: Submit a review.
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
  if (!checkRateLimit(await clientRateKey('review'), 5, 10 * 60 * 1000)) {
    throw new Error('Too many submissions. Please try again in a little while.');
  }

  const urls = photoUrls ?? [];
  if (urls.length > MAX_REVIEW_PHOTOS) {
    throw new Error(`A maximum of ${MAX_REVIEW_PHOTOS} photos is allowed per review.`);
  }

  // Every photo URL must belong to our bucket; collect paths for rollback.
  const objectPaths: string[] = [];
  for (const url of urls) {
    const path = reviewImageObjectPath(url);
    if (!path) throw new Error('Invalid photo reference.');
    objectPaths.push(path);
  }

  const { data: review, error: reviewError } = await supabaseAdmin
    .from('reviews')
    .insert({
      ...reviewData,
      is_approved: null, // always pending moderation
    })
    .select()
    .single();

  if (reviewError) {
    // Don't leave uploaded photos orphaned in storage.
    if (objectPaths.length > 0) {
      await supabaseAdmin.storage.from(REVIEW_BUCKET).remove(objectPaths);
    }
    throw reviewError;
  }

  if (urls.length > 0) {
    const photoRows = urls.map((url) => ({
      review_id: review.id,
      image_url: url,
    }));
    const { error: photosError } = await supabaseAdmin
      .from('review_photos')
      .insert(photoRows);

    if (photosError) {
      // Roll back the review and the uploaded files to avoid partial state.
      await supabaseAdmin.from('reviews').delete().eq('id', review.id);
      await supabaseAdmin.storage.from(REVIEW_BUCKET).remove(objectPaths);
      throw photosError;
    }
  }

  return review;
}

/**
 * Public: Upload a single review photo to the review-images bucket.
 * Rate-limited and restricted to <=5MB JPEG/PNG/WebP images.
 */
export async function uploadReviewPhoto(formData: FormData): Promise<string> {
  if (!checkRateLimit(await clientRateKey('review-upload'), 30, 10 * 60 * 1000)) {
    throw new Error('Too many uploads. Please try again in a little while.');
  }

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB limit');

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // Resolve the effective content type, then require it to be an allowed image.
  let contentType = file.type;
  if (!contentType || contentType === 'application/octet-stream') {
    if (fileExt === 'webp') contentType = 'image/webp';
    else if (fileExt === 'png') contentType = 'image/png';
    else contentType = 'image/jpeg';
  }

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error('Unsupported image format. Use JPG, PNG, or WebP.');
  }

  const safeExt = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${crypto.randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(REVIEW_BUCKET)
    .upload(filename, buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabaseAdmin.storage
    .from(REVIEW_BUCKET)
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
