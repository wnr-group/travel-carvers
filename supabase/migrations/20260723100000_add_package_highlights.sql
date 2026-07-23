CREATE TABLE package_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  highlight_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_package_highlights_package
  ON package_highlights (package_id, display_order);

COMMENT ON TABLE package_highlights IS
  'Selling points shown in the Overview tab. Travel tips live in travel_tips.';

ALTER TABLE package_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service_role on package_highlights"
  ON package_highlights FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public can read highlights of published packages"
  ON package_highlights FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM packages p
      WHERE p.id = package_highlights.package_id
        AND public.is_package_visible(p.status)
    )
  );
