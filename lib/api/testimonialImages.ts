import { supabaseAdmin } from '@/lib/supabase/server';
import { cleanupOrphanedImages, referencedUrlsFrom } from '@/lib/supabase/storageCleanup';
import type { UploadBucket } from '@/lib/storage/buckets';

/** A testimonial has a single customer photo in the `testimonial-images` bucket. */
const TESTIMONIAL_IMAGE_BUCKETS: readonly UploadBucket[] = ['testimonial-images'];

async function testimonialImagesStillReferenced(urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();

  const photos = await supabaseAdmin
    .from('testimonials')
    .select('photo_url')
    .in('photo_url', urls);

  return referencedUrlsFrom(urls, [{ ...photos, column: 'photo_url' }]);
}

/**
 * Remove a testimonial photo from storage once no testimonial references it.
 * Best-effort — call after the testimonial delete/update has committed.
 */
export function cleanupTestimonialImages(
  candidateUrls: (string | null | undefined)[]
): Promise<void> {
  return cleanupOrphanedImages(
    candidateUrls,
    TESTIMONIAL_IMAGE_BUCKETS,
    testimonialImagesStillReferenced
  );
}
