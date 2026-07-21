-- Visa attachments

CREATE TABLE IF NOT EXISTS visa_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_name VARCHAR(120) NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(120),
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_visa_attachments_country
  ON visa_attachments (LOWER(country_name));

CREATE TRIGGER update_visa_attachments_updated_at BEFORE UPDATE ON visa_attachments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE visa_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for service_role on visa_attachments"
  ON visa_attachments;
CREATE POLICY "Enable all operations for service_role on visa_attachments"
ON visa_attachments FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Public can read visa attachments" ON visa_attachments;
CREATE POLICY "Public can read visa attachments"
ON visa_attachments FOR SELECT TO anon USING (true);

GRANT SELECT ON TABLE visa_attachments TO anon, authenticated;
GRANT ALL ON TABLE visa_attachments TO service_role;

-- Documents, not images: PDF and XLSX only, 10MB ceiling.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'visa-attachments',
  'visa-attachments',
  true,
  10485760,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can download visa attachments" ON storage.objects;
CREATE POLICY "Public can download visa attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'visa-attachments');

-- Writes go through the admin upload route on the service-role key only.
DROP POLICY IF EXISTS "Service role can manage visa attachments" ON storage.objects;
CREATE POLICY "Service role can manage visa attachments"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'visa-attachments');
