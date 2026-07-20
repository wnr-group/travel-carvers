'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { reviewSchema, type ReviewFormData } from '@/lib/validations/review.schema';
/**
 * Public: Submit a review.
 */
export async function createReview(input: ReviewFormData) {
  const reviewData = reviewSchema.parse(input);

  const isApproved = reviewData.rating >= 4 ? true : null;

/**
 * Public: Submit a review.
 *
 * Reviews ALWAYS enter moderation (is_approved = NULL) and are only shown
 * publicly after an admin approves them in /admin/reviews. The client cannot
 * influence approval. Photo URLs must reference our own review-images bucket;
 * foreign URLs are rejected. Uploaded files are cleaned up if the insert fails.
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
      package_id: reviewData.package_id,
      reviewer_name: reviewData.reviewer_name,
      reviewer_email: reviewData.reviewer_email,
      rating: reviewData.rating,
      review_text: reviewData.review_text,
      is_approved: isApproved,
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
