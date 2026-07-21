-- Cancellation policy and required documents, per package.

CREATE TABLE IF NOT EXISTS cancellation_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  window_label VARCHAR(200) NOT NULL,
  refund_text VARCHAR(200) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS required_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  document_text VARCHAR(300) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cancellation_policies_package
  ON cancellation_policies(package_id, display_order);
CREATE INDEX IF NOT EXISTS idx_required_documents_package
  ON required_documents(package_id, display_order);

ALTER TABLE cancellation_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE required_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for service_role on cancellation_policies"
  ON cancellation_policies;
CREATE POLICY "Enable all operations for service_role on cancellation_policies"
ON cancellation_policies FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Enable all operations for service_role on required_documents"
  ON required_documents;
CREATE POLICY "Enable all operations for service_role on required_documents"
ON required_documents FOR ALL TO service_role USING (true);

-- Same visibility rule as every other package child: published and sold-out only.
DROP POLICY IF EXISTS "Public can read cancellation policies of published packages"
  ON cancellation_policies;
CREATE POLICY "Public can read cancellation policies of published packages"
ON cancellation_policies FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM packages p
  WHERE p.id = cancellation_policies.package_id AND public.is_package_visible(p.status)
));

DROP POLICY IF EXISTS "Public can read required documents of published packages"
  ON required_documents;
CREATE POLICY "Public can read required documents of published packages"
ON required_documents FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM packages p
  WHERE p.id = required_documents.package_id AND public.is_package_visible(p.status)
));

GRANT SELECT ON TABLE cancellation_policies TO anon, authenticated;
GRANT SELECT ON TABLE required_documents TO anon, authenticated;
GRANT ALL ON TABLE cancellation_policies TO service_role;
GRANT ALL ON TABLE required_documents TO service_role;
