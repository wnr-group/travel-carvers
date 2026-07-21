-- Harden the destination-images bucket.
--
-- Admin destination-image uploads go through app/api/admin/upload/route.ts,
-- which is gated by requireAdmin() and writes with the service role. The broad
-- "authenticated users can upload" INSERT policy is therefore unnecessary and
-- would let any signed-in (non-admin) user write to this public bucket. Drop it
-- and keep only public read + service_role management — matching the tighter
-- pattern already used for the review-images / testimonial-images buckets.

DROP POLICY IF EXISTS "Authenticated users can upload destination images" ON storage.objects;
