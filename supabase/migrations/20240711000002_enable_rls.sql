-- Enable RLS and create policies for all tables
-- This allows service_role and authenticated users to perform operations

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_subcategory ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_day_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stay_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_time_to_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE places_to_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

-- Admin policies (service_role can do everything)
CREATE POLICY "Enable all operations for service_role on categories" ON categories FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on subcategories" ON subcategories FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on category_subcategory" ON category_subcategory FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on packages" ON packages FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on package_categories" ON package_categories FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on package_subcategories" ON package_subcategories FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on package_gallery" ON package_gallery FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on package_videos" ON package_videos FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on itinerary_days" ON itinerary_days FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on itinerary_day_images" ON itinerary_day_images FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on package_inclusions" ON package_inclusions FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on stay_details" ON stay_details FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on travel_tips" ON travel_tips FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on best_time_to_visit" ON best_time_to_visit FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on places_to_visit" ON places_to_visit FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on leads" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on reviews" ON reviews FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on homepage_sections" ON homepage_sections FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on trust_badges" ON trust_badges FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on site_settings" ON site_settings FOR ALL TO service_role USING (true);
CREATE POLICY "Enable all operations for service_role on static_pages" ON static_pages FOR ALL TO service_role USING (true);

-- Public read policies for customer-facing data
CREATE POLICY "Public can read active categories" ON categories FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can read active subcategories" ON subcategories FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can read published packages" ON packages FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Public can read package galleries" ON package_gallery FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read package videos" ON package_videos FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read itinerary days" ON itinerary_days FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read itinerary images" ON itinerary_day_images FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read package inclusions" ON package_inclusions FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read stay details" ON stay_details FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read travel tips" ON travel_tips FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read best time" ON best_time_to_visit FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read places" ON places_to_visit FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Public can read homepage sections" ON homepage_sections FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read trust badges" ON trust_badges FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read active pages" ON static_pages FOR SELECT TO anon USING (is_active = true);

-- Public can submit leads and reviews
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT TO anon WITH CHECK (true);
