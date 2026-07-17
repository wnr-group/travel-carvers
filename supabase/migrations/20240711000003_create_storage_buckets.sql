-- Create Storage Buckets for Travel Carvers
-- This creates all image storage buckets with proper permissions

-- 1. Insert buckets into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('package-images', 'package-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]),
  ('itinerary-images', 'itinerary-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]),
  ('hotel-images', 'hotel-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]),
  ('category-images', 'category-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]),
  ('testimonial-images', 'testimonial-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]),
  ('review-images', 'review-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[])
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for package-images bucket
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
USING (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Service role can manage package images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'package-images');

-- 3. Create storage policies for itinerary-images bucket
CREATE POLICY "Public can view itinerary images"
ON storage.objects FOR SELECT
USING (bucket_id = 'itinerary-images');

CREATE POLICY "Authenticated users can upload itinerary images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'itinerary-images');

CREATE POLICY "Service role can manage itinerary images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'itinerary-images');

-- 4. Create storage policies for hotel-images bucket
CREATE POLICY "Public can view hotel images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can upload hotel images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "Service role can manage hotel images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hotel-images');

-- 5. Create storage policies for category-images bucket
CREATE POLICY "Public can view category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Service role can manage category images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'category-images');

-- 6. Create storage policies for testimonial-images bucket
-- Uploads go exclusively through the admin-guarded upload route (service role);
-- there is no direct anon/authenticated write, which would otherwise let the
-- public browser key write arbitrary files into this public bucket.
CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-images');

CREATE POLICY "Service role can manage testimonial images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'testimonial-images');

-- 7. Create storage policies for review-images bucket
-- Review photo uploads run server-side via the rate-limited uploadReviewPhoto
-- server action (service role). No direct browser writes.
CREATE POLICY "Public can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Service role can manage review images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'review-images');

-- Note: file_size_limit is in bytes (5242880 = 5MB)
