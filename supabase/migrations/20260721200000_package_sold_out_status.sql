-- "Sold out" becomes a package status rather than a flag.
--
-- A sold-out package must stay visible to customers, so every anon-facing policy that
-- gated on `status = 'published'` now has to accept `sold_out` as well. That rule lives in
-- one function so the next status change is a one-line edit instead of fourteen.

ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_status_check;
ALTER TABLE packages
  ADD CONSTRAINT packages_status_check
  CHECK (status IN ('draft', 'published', 'archived', 'sold_out'));

CREATE OR REPLACE FUNCTION public.is_package_visible(p_status TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$ SELECT p_status IN ('published', 'sold_out') $$;

GRANT EXECUTE ON FUNCTION public.is_package_visible(TEXT) TO anon, authenticated;

-- Carry over anything already flagged sold out before the column goes away.
UPDATE packages SET status = 'sold_out' WHERE is_sold_out IS TRUE AND status = 'published';
ALTER TABLE packages DROP COLUMN IF EXISTS is_sold_out;

-- The package itself.
DROP POLICY IF EXISTS "Public can read published packages" ON packages;
CREATE POLICY "Public can read published packages"
ON packages FOR SELECT TO anon
USING (public.is_package_visible(status));

-- Children: reached through their package.
DROP POLICY IF EXISTS "Public can read galleries of published packages" ON package_gallery;
CREATE POLICY "Public can read galleries of published packages"
ON package_gallery FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_gallery.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read videos of published packages" ON package_videos;
CREATE POLICY "Public can read videos of published packages"
ON package_videos FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_videos.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read itinerary days of published packages" ON itinerary_days;
CREATE POLICY "Public can read itinerary days of published packages"
ON itinerary_days FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = itinerary_days.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read inclusions of published packages" ON package_inclusions;
CREATE POLICY "Public can read inclusions of published packages"
ON package_inclusions FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_inclusions.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read stay details of published packages" ON stay_details;
CREATE POLICY "Public can read stay details of published packages"
ON stay_details FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = stay_details.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read travel tips of published packages" ON travel_tips;
CREATE POLICY "Public can read travel tips of published packages"
ON travel_tips FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = travel_tips.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read best time of published packages" ON best_time_to_visit;
CREATE POLICY "Public can read best time of published packages"
ON best_time_to_visit FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = best_time_to_visit.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read places of published packages" ON places_to_visit;
CREATE POLICY "Public can read places of published packages"
ON places_to_visit FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = places_to_visit.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read package categories of published packages" ON package_categories;
CREATE POLICY "Public can read package categories of published packages"
ON package_categories FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_categories.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read package subcategories of published packages" ON package_subcategories;
CREATE POLICY "Public can read package subcategories of published packages"
ON package_subcategories FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_subcategories.package_id AND public.is_package_visible(p.status)));

DROP POLICY IF EXISTS "Public can read destinations of published packages" ON package_destinations;
CREATE POLICY "Public can read destinations of published packages"
ON package_destinations FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_destinations.package_id AND public.is_package_visible(p.status)));

-- Grandchildren: reached through the itinerary day.
DROP POLICY IF EXISTS "Public can read itinerary images of published packages" ON itinerary_day_images;
CREATE POLICY "Public can read itinerary images of published packages"
ON itinerary_day_images FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM itinerary_days d
  JOIN packages p ON p.id = d.package_id
  WHERE d.id = itinerary_day_images.itinerary_day_id AND public.is_package_visible(p.status)
));

DROP POLICY IF EXISTS "Public can read itinerary entries of published packages" ON itinerary_entries;
CREATE POLICY "Public can read itinerary entries of published packages"
ON itinerary_entries FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM itinerary_days d
  JOIN packages p ON p.id = d.package_id
  WHERE d.id = itinerary_entries.itinerary_day_id AND public.is_package_visible(p.status)
));
