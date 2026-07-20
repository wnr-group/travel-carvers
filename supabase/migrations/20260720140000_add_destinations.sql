-- Destinations

CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  slug VARCHAR(200) NOT NULL UNIQUE,
  hero_image_url TEXT,
  description TEXT,

  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,

  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  og_image TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT destinations_latitude_range CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT destinations_longitude_range CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE package_destinations (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, destination_id)
);

CREATE INDEX idx_package_destinations_destination ON package_destinations(destination_id);
CREATE INDEX idx_destinations_country ON destinations(country);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service_role on destinations"
ON destinations FOR ALL TO service_role USING (true);

CREATE POLICY "Enable all operations for service_role on package_destinations"
ON package_destinations FOR ALL TO service_role USING (true);

CREATE POLICY "Public can read active destinations"
ON destinations FOR SELECT TO anon
USING (is_active = true);

CREATE POLICY "Public can read destinations of published packages"
ON package_destinations FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM packages p
  WHERE p.id = package_destinations.package_id AND p.status = 'published'
));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'destination-images',
  'destination-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view destination images"
ON storage.objects FOR SELECT
USING (bucket_id = 'destination-images');

CREATE POLICY "Authenticated users can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'destination-images');

CREATE POLICY "Service role can manage destination images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'destination-images');
