-- Stop draft and archived package content leaking to the public.

DROP POLICY IF EXISTS "Public can read package galleries" ON package_gallery;
CREATE POLICY "Public can read galleries of published packages"
ON package_gallery FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_gallery.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read package videos" ON package_videos;
CREATE POLICY "Public can read videos of published packages"
ON package_videos FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_videos.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read itinerary days" ON itinerary_days;
CREATE POLICY "Public can read itinerary days of published packages"
ON itinerary_days FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = itinerary_days.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read package inclusions" ON package_inclusions;
CREATE POLICY "Public can read inclusions of published packages"
ON package_inclusions FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_inclusions.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read stay details" ON stay_details;
CREATE POLICY "Public can read stay details of published packages"
ON stay_details FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = stay_details.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read travel tips" ON travel_tips;
CREATE POLICY "Public can read travel tips of published packages"
ON travel_tips FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = travel_tips.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read best time" ON best_time_to_visit;
CREATE POLICY "Public can read best time of published packages"
ON best_time_to_visit FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = best_time_to_visit.package_id AND p.status = 'published'));

DROP POLICY IF EXISTS "Public can read places" ON places_to_visit;
CREATE POLICY "Public can read places of published packages"
ON places_to_visit FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = places_to_visit.package_id AND p.status = 'published'));

-- Grandchild: itinerary_day_images points at itinerary_days.id, not at the package, so it has to
-- reach the package through the day it belongs to.
DROP POLICY IF EXISTS "Public can read itinerary images" ON itinerary_day_images;
CREATE POLICY "Public can read itinerary images of published packages"
ON itinerary_day_images FOR SELECT TO anon
USING (EXISTS (
  SELECT 1
  FROM itinerary_days d
  JOIN packages p ON p.id = d.package_id
  WHERE d.id = itinerary_day_images.itinerary_day_id AND p.status = 'published'
));
