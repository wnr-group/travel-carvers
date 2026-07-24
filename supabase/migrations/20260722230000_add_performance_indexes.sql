
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages (status);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages (slug);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages (destination_name);
CREATE INDEX IF NOT EXISTS idx_reviews_package ON reviews (package_id);

DROP INDEX IF EXISTS idx_reviews_approved;
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews (is_approved, rating);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_packages_search
  ON packages
  USING GIN (to_tsvector('english', title));

ANALYZE packages;
ANALYZE reviews;
ANALYZE leads;
