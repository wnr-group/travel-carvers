
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET search_path TO public, extensions;-- Create testimonials table and storage policies
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_role VARCHAR(255),
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- service_role policy
CREATE POLICY "Enable all operations for service_role on testimonials"
ON testimonials FOR ALL
TO service_role
USING (true);

-- public read policy
CREATE POLICY "Public can read testimonials"
ON testimonials FOR SELECT
TO anon, authenticated
USING (true);

-- insert bucket for testimonial images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('testimonial-images', 'testimonial-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[])
ON CONFLICT (id) DO NOTHING;

-- storage policies
CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-images');

CREATE POLICY "Authenticated users can upload testimonial images"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'testimonial-images');

CREATE POLICY "Service role can manage testimonial images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'testimonial-images');
