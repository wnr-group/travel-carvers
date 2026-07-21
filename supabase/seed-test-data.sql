-- =====================================================================
--  LOCAL DEV TEST DATA  —  NOT FOR PRODUCTION
-- =====================================================================
--  Rich, realistic demo content for local development: published packages
--  (with galleries, itineraries, inclusions, stays, tips, places), customer
--  reviews (some with photos), homepage testimonials, and sample leads.
--
--  Images use ONLY hosts whitelisted in next.config.js:
--    picsum.photos, images.unsplash.com, i.pravatar.cc
--
--  Idempotent: re-running deletes this file's fixed-UUID rows first, then
--  re-inserts. Safe to run repeatedly. Run with:  npm run seed:test
--  (or: psql "$DATABASE_URL" -f supabase/seed-test-data.sql)
-- =====================================================================

BEGIN;

-- ---- Clean up prior runs of THIS seed (cascades to all package children) ----
DELETE FROM packages WHERE id IN (
  '11111111-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000005',
  '11111111-0000-0000-0000-000000000006',
  '11111111-0000-0000-0000-000000000007',
  '11111111-0000-0000-0000-000000000008'
);
DELETE FROM testimonials WHERE id::text LIKE '22222222-0000-0000-0000-%';
DELETE FROM leads WHERE email LIKE '%@seed.local';

-- =====================================================================
--  PACKAGES
-- =====================================================================
INSERT INTO packages (
  id, title, slug, short_description, full_description, status,
  price_adult, price_child, price_infant, show_price,
  duration_days, duration_nights, difficulty_level,
  group_size_min, group_size_max, age_restriction,
  destination_name, main_destination_lat, main_destination_lng,
  is_featured, is_trending, is_new,
  meta_title, meta_description, meta_keywords, og_image
) VALUES
( '11111111-0000-0000-0000-000000000001',
  'Goa Beach Bliss Getaway', 'goa-beach-bliss-getaway',
  'Sun, sand and Susegad — 4 days of golden beaches, cruises and nightlife in North Goa.',
  'Trade your routine for the laid-back rhythm of Goa. This getaway pairs the buzzing beaches of Baga and Calangute with a sunset river cruise, a spice-plantation lunch and plenty of free time to simply soak up the coastal calm. Perfect for couples and first-time visitors.',
  'published', 24999, 14999, 2999, true, 4, 3, 'easy', 2, 12, 'All ages welcome',
  'Goa, India', 15.29199000, 74.12399000, true, true, false,
  'Goa Beach Holiday Package', 'Book a 4-day Goa beach package with cruises, nightlife and spice plantations.', 'goa, beach, honeymoon, north goa', 'https://picsum.photos/seed/goa-og/1200/630' ),

( '11111111-0000-0000-0000-000000000002',
  'Manali & Solang Snow Adventure', 'manali-solang-snow-adventure',
  'Snow-capped peaks, Solang Valley thrills and riverside cafes across 5 Himalayan days.',
  'Swap the plains for pine forests and snow. Ride the Atal Tunnel to Sissu, try paragliding and zorbing at Solang Valley, wander Old Manali cafes and stand at the dramatic Rohtang gateway. A crowd-pleasing mix of adventure and mountain calm for families and groups.',
  'published', 18999, 11999, 0, true, 5, 4, 'moderate', 2, 16, 'Suitable for ages 5+',
  'Manali, Himachal Pradesh', 32.24319000, 77.18871000, false, true, false,
  'Manali Snow Package', 'A 5-day Manali & Solang Valley adventure with snow activities and Atal Tunnel.', 'manali, himachal, snow, solang, adventure', 'https://picsum.photos/seed/manali-og/1200/630' ),

( '11111111-0000-0000-0000-000000000003',
  'Kerala Backwater Serenade', 'kerala-backwater-serenade',
  'Houseboats, tea hills and Arabian Sea sunsets — 6 unhurried days through Gods Own Country.',
  'Glide through the palm-fringed backwaters of Alleppey on a private houseboat, wake up among the tea terraces of Munnar, and end with golden evenings on Kovalam beach. A gentle, romantic journey rich in flavour, greenery and calm.',
  'published', 32999, 19999, 3999, true, 6, 5, 'easy', 2, 10, 'All ages welcome',
  'Kerala, India', 9.93119000, 76.26730000, true, false, false,
  'Kerala Backwaters Package', 'A 6-day Kerala tour: Alleppey houseboats, Munnar tea hills and Kovalam beach.', 'kerala, backwaters, houseboat, munnar, honeymoon', 'https://picsum.photos/seed/kerala-og/1200/630' ),

( '11111111-0000-0000-0000-000000000004',
  'Royal Rajasthan Heritage Tour', 'royal-rajasthan-heritage-tour',
  'Forts, palaces and desert colour across the Pink City, Blue City and Lake City in 7 days.',
  'Journey through the land of kings — Jaipurs Amber Fort, Jodhpurs towering Mehrangarh and the shimmering lakes of Udaipur. Ride a heritage tuk-tuk through bazaars, dine in a palace courtyard and watch folk dancers under desert stars.',
  'published', 27999, 16999, 0, true, 7, 6, 'easy', 2, 18, 'All ages welcome',
  'Rajasthan, India', 26.91243000, 75.78727000, true, false, false,
  'Rajasthan Heritage Tour', 'A 7-day Rajasthan tour through Jaipur, Jodhpur and Udaipur forts and palaces.', 'rajasthan, jaipur, udaipur, heritage, culture', 'https://picsum.photos/seed/rajasthan-og/1200/630' ),

( '11111111-0000-0000-0000-000000000005',
  'Andaman Island Escape', 'andaman-island-escape',
  'Turquoise water, coral reefs and Radhanagar sunsets — 6 island days in the Andamans.',
  'Fly to the emerald Andaman Islands for snorkelling over living coral at Elephant Beach, a ferry to laid-back Havelock, and sunset at award-winning Radhanagar. Includes a sobering visit to the historic Cellular Jail light-and-sound show.',
  'published', 45999, 28999, 4999, true, 6, 5, 'easy', 2, 10, 'Suitable for ages 3+',
  'Andaman Islands, India', 11.62340000, 92.72650000, true, false, true,
  'Andaman Islands Package', 'A 6-day Andaman package: Havelock, Radhanagar Beach and coral snorkelling.', 'andaman, havelock, beach, snorkelling, honeymoon', 'https://picsum.photos/seed/andaman-og/1200/630' ),

( '11111111-0000-0000-0000-000000000006',
  'Leh Ladakh Himalayan Expedition', 'leh-ladakh-himalayan-expedition',
  'High passes, Pangong blue and monastery mornings — a 7-day Ladakh road expedition.',
  'For those who chase altitude and awe: cross Khardung La, camp beside the ever-changing blues of Pangong Tso, spin prayer wheels at Thiksey and Hemis, and drive the lunar Nubra Valley on camel-back dunes. A bucket-list adventure for seasoned travellers.',
  'published', 38999, 0, 0, true, 7, 6, 'hard', 4, 14, 'Ages 12+; basic fitness required',
  'Leh, Ladakh', 34.15258000, 77.57701000, false, true, false,
  'Leh Ladakh Expedition', 'A 7-day Ladakh road trip: Khardung La, Pangong Tso and Nubra Valley.', 'ladakh, leh, pangong, adventure, expedition', 'https://picsum.photos/seed/ladakh-og/1200/630' ),

( '11111111-0000-0000-0000-000000000007',
  'Kashmir Valley Paradise', 'kashmir-valley-paradise',
  'Shikara rides, Gulmarg gondolas and Mughal gardens — 5 days in paradise on earth.',
  'Drift across Dal Lake in a flower-decked shikara, stay in a carved houseboat, ride the Gulmarg gondola over meadows, and stroll the tiered Mughal gardens of Srinagar. A serene valley escape wrapped in snow-tipped mountains.',
  'published', 29999, 18999, 0, true, 5, 4, 'easy', 2, 12, 'All ages welcome',
  'Srinagar, Kashmir', 34.08360000, 74.79730000, false, false, true,
  'Kashmir Tour Package', 'A 5-day Kashmir tour: Dal Lake shikara, Gulmarg gondola and Mughal gardens.', 'kashmir, srinagar, gulmarg, dal lake, honeymoon', 'https://picsum.photos/seed/kashmir-og/1200/630' ),

( '11111111-0000-0000-0000-000000000008',
  'Bespoke Bhutan Luxury Retreat', 'bespoke-bhutan-luxury-retreat',
  'A tailor-made 8-day Himalayan kingdom retreat — priced on request.',
  'A fully bespoke journey through the Land of the Thunder Dragon: the cliff-clinging Tigers Nest monastery, Thimphus dzongs, the Punakha valley and private wellness rituals. Every detail is customised, so pricing is shared on request after a quick consultation.',
  'published', 0, 0, 0, false, 8, 7, 'moderate', 2, 8, 'All ages welcome',
  'Bhutan', 27.47120000, 89.63390000, true, false, true,
  'Luxury Bhutan Retreat', 'An 8-day bespoke luxury Bhutan retreat — Tigers Nest, Punakha and Thimphu.', 'bhutan, luxury, tigers nest, bespoke', 'https://picsum.photos/seed/bhutan-og/1200/630' );

-- =====================================================================
--  CATEGORY / SUBCATEGORY LINKS  (resolved by slug)
-- =====================================================================
INSERT INTO package_categories (package_id, category_id)
SELECT p.pid, c.id FROM (VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'beach'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'mountain'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'adventure'),
  ('11111111-0000-0000-0000-000000000003'::uuid, 'beach'),
  ('11111111-0000-0000-0000-000000000003'::uuid, 'cultural'),
  ('11111111-0000-0000-0000-000000000004'::uuid, 'cultural'),
  ('11111111-0000-0000-0000-000000000005'::uuid, 'beach'),
  ('11111111-0000-0000-0000-000000000006'::uuid, 'adventure'),
  ('11111111-0000-0000-0000-000000000006'::uuid, 'mountain'),
  ('11111111-0000-0000-0000-000000000007'::uuid, 'mountain'),
  ('11111111-0000-0000-0000-000000000008'::uuid, 'cultural'),
  ('11111111-0000-0000-0000-000000000008'::uuid, 'adventure')
) AS p(pid, cslug)
JOIN categories c ON c.slug = p.cslug
ON CONFLICT DO NOTHING;

INSERT INTO package_subcategories (package_id, subcategory_id)
SELECT p.pid, s.id FROM (VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'honeymoon'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'family'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'group'),
  ('11111111-0000-0000-0000-000000000003'::uuid, 'honeymoon'),
  ('11111111-0000-0000-0000-000000000003'::uuid, 'luxury'),
  ('11111111-0000-0000-0000-000000000004'::uuid, 'family'),
  ('11111111-0000-0000-0000-000000000005'::uuid, 'honeymoon'),
  ('11111111-0000-0000-0000-000000000005'::uuid, 'luxury'),
  ('11111111-0000-0000-0000-000000000006'::uuid, 'group'),
  ('11111111-0000-0000-0000-000000000007'::uuid, 'honeymoon'),
  ('11111111-0000-0000-0000-000000000008'::uuid, 'luxury')
) AS p(pid, sslug)
JOIN subcategories s ON s.slug = p.sslug
ON CONFLICT DO NOTHING;

-- =====================================================================
--  GALLERIES  (first image per package = cover)
-- =====================================================================
INSERT INTO package_gallery (package_id, image_url, is_cover, display_order) VALUES
 ('11111111-0000-0000-0000-000000000001','https://picsum.photos/seed/goa-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000001','https://picsum.photos/seed/goa-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000001','https://picsum.photos/seed/goa-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000001','https://picsum.photos/seed/goa-4/1600/1000', false, 3),
 ('11111111-0000-0000-0000-000000000002','https://picsum.photos/seed/manali-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000002','https://picsum.photos/seed/manali-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000002','https://picsum.photos/seed/manali-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000003','https://picsum.photos/seed/kerala-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000003','https://picsum.photos/seed/kerala-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000003','https://picsum.photos/seed/kerala-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000003','https://picsum.photos/seed/kerala-4/1600/1000', false, 3),
 ('11111111-0000-0000-0000-000000000004','https://picsum.photos/seed/rajasthan-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000004','https://picsum.photos/seed/rajasthan-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000004','https://picsum.photos/seed/rajasthan-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000005','https://picsum.photos/seed/andaman-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000005','https://picsum.photos/seed/andaman-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000005','https://picsum.photos/seed/andaman-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000006','https://picsum.photos/seed/ladakh-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000006','https://picsum.photos/seed/ladakh-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000006','https://picsum.photos/seed/ladakh-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000007','https://picsum.photos/seed/kashmir-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000007','https://picsum.photos/seed/kashmir-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000007','https://picsum.photos/seed/kashmir-3/1600/1000', false, 2),
 ('11111111-0000-0000-0000-000000000008','https://picsum.photos/seed/bhutan-1/1600/1000', true, 0),
 ('11111111-0000-0000-0000-000000000008','https://picsum.photos/seed/bhutan-2/1600/1000', false, 1),
 ('11111111-0000-0000-0000-000000000008','https://picsum.photos/seed/bhutan-3/1600/1000', false, 2);

-- =====================================================================
--  VIDEOS  (a couple, for the detail-page media tab)
-- =====================================================================
INSERT INTO package_videos (package_id, video_url, display_order) VALUES
 ('11111111-0000-0000-0000-000000000001','https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0),
 ('11111111-0000-0000-0000-000000000005','https://www.youtube.com/watch?v=aqz-KE-bpKQ', 0);

-- =====================================================================
--  ITINERARIES
-- =====================================================================
INSERT INTO itinerary_days (package_id, day_number, title, morning_activity, afternoon_activity, evening_activity, breakfast, lunch, dinner) VALUES
 -- Goa
 ('11111111-0000-0000-0000-000000000001',1,'Arrival & North Goa Beaches','Airport pickup and hotel check-in.','Relax at Baga and Calangute beach.','Welcome dinner at a beach shack.', true,false,true),
 ('11111111-0000-0000-0000-000000000001',2,'Old Goa & Spice Plantation','Visit Basilica of Bom Jesus and Se Cathedral.','Spice plantation tour with traditional lunch.','Sunset Mandovi river cruise.', true,true,false),
 ('11111111-0000-0000-0000-000000000001',3,'South Goa Leisure','Drive to serene Palolem beach.','Kayaking and free beach time.','Live-music dinner by the sea.', true,false,true),
 ('11111111-0000-0000-0000-000000000001',4,'Departure','Leisurely breakfast and souvenir shopping.','Transfer to airport.','', true,false,false),
 -- Manali
 ('11111111-0000-0000-0000-000000000002',1,'Arrival in Manali','Pickup from Bhuntar and drive to Manali.','Check-in and Mall Road stroll.','Cafe-hopping in Old Manali.', true,false,true),
 ('11111111-0000-0000-0000-000000000002',2,'Solang Valley Adventure','Paragliding and zorbing at Solang.','Ropeway ride with valley views.','Bonfire evening at the hotel.', true,true,true),
 ('11111111-0000-0000-0000-000000000002',3,'Atal Tunnel & Sissu','Drive through the Atal Tunnel to Sissu.','Snow play and riverside lunch.','Return to Manali; free evening.', true,true,false),
 ('11111111-0000-0000-0000-000000000002',4,'Local Sightseeing','Hadimba Temple and Vashisht hot springs.','Manu Temple and Tibetan monastery.','Local Himachali dinner.', true,false,true),
 ('11111111-0000-0000-0000-000000000002',5,'Departure','Breakfast and checkout.','Transfer to Bhuntar airport.','', true,false,false),
 -- Kerala
 ('11111111-0000-0000-0000-000000000003',1,'Arrival in Kochi','Airport pickup and Fort Kochi walk.','Chinese fishing nets and cafes.','Kathakali dance performance.', true,false,true),
 ('11111111-0000-0000-0000-000000000003',2,'Munnar Tea Hills','Scenic drive to Munnar.','Tea museum and plantation visit.','Leisure evening at hill resort.', true,true,true),
 ('11111111-0000-0000-0000-000000000003',3,'Munnar Nature','Eravikulam National Park.','Mattupetty Dam and echo point.','Spice-garden dinner.', true,true,false),
 ('11111111-0000-0000-0000-000000000003',4,'Alleppey Houseboat','Transfer to Alleppey.','Board a private houseboat.','Onboard Kerala dinner on the backwaters.', true,true,true),
 ('11111111-0000-0000-0000-000000000003',5,'Kovalam Beach','Drive to Kovalam.','Beachfront relaxation.','Ayurvedic spa and sunset.', true,false,true),
 ('11111111-0000-0000-0000-000000000003',6,'Departure','Breakfast by the sea.','Transfer to Trivandrum airport.','', true,false,false),
 -- Rajasthan (condensed)
 ('11111111-0000-0000-0000-000000000004',1,'Arrival in Jaipur','Pickup and check-in.','City Palace and Jantar Mantar.','Chokhi Dhani cultural dinner.', true,false,true),
 ('11111111-0000-0000-0000-000000000004',3,'Jodhpur the Blue City','Drive to Jodhpur.','Mehrangarh Fort and Jaswant Thada.','Old-city bazaar walk.', true,true,false),
 ('11111111-0000-0000-0000-000000000004',5,'Udaipur Lake City','Drive to Udaipur.','City Palace and Lake Pichola boat ride.','Rooftop dinner over the lake.', true,true,true),
 ('11111111-0000-0000-0000-000000000004',7,'Departure','Saheliyon ki Bari gardens.','Transfer to Udaipur airport.','', true,false,false),
 -- Andaman
 ('11111111-0000-0000-0000-000000000005',1,'Arrival in Port Blair','Pickup and check-in.','Corbyns Cove beach.','Cellular Jail light & sound show.', true,false,true),
 ('11111111-0000-0000-0000-000000000005',2,'Havelock Island','Ferry to Havelock.','Radhanagar Beach sunset.','Seafood dinner.', true,true,true),
 ('11111111-0000-0000-0000-000000000005',3,'Elephant Beach Snorkelling','Boat to Elephant Beach.','Snorkelling over coral reefs.','Return to resort.', true,true,false),
 ('11111111-0000-0000-0000-000000000005',5,'Neil Island','Ferry to Neil Island.','Natural Bridge and Bharatpur Beach.','Beachside dinner.', true,true,true),
 ('11111111-0000-0000-0000-000000000005',6,'Departure','Breakfast and checkout.','Transfer to airport.','', true,false,false),
 -- Ladakh (condensed)
 ('11111111-0000-0000-0000-000000000006',1,'Arrive Leh & Acclimatise','Pickup and rest for altitude.','Short Leh market walk.','Early dinner and rest.', true,false,true),
 ('11111111-0000-0000-0000-000000000006',3,'Nubra Valley via Khardung La','Cross Khardung La pass.','Diskit monastery and dunes.','Camel safari at Hunder.', true,true,true),
 ('11111111-0000-0000-0000-000000000006',5,'Pangong Tso','Drive to Pangong Lake.','Lakeside camp and photography.','Camp dinner under the stars.', true,true,true),
 ('11111111-0000-0000-0000-000000000006',7,'Departure','Thiksey monastery sunrise.','Transfer to Leh airport.','', true,false,false),
 -- Kashmir (condensed)
 ('11111111-0000-0000-0000-000000000007',1,'Arrival in Srinagar','Pickup and houseboat check-in.','Shikara ride on Dal Lake.','Dinner on the houseboat.', true,false,true),
 ('11111111-0000-0000-0000-000000000007',2,'Gulmarg','Drive to Gulmarg.','Gondola ride to Kongdoori.','Return to Srinagar.', true,true,false),
 ('11111111-0000-0000-0000-000000000007',3,'Pahalgam','Betaab and Aru valleys.','Riverside leisure.','Local Wazwan dinner.', true,true,true),
 ('11111111-0000-0000-0000-000000000007',5,'Departure','Mughal gardens visit.','Transfer to airport.','', true,false,false),
 -- Bhutan (condensed)
 ('11111111-0000-0000-0000-000000000008',1,'Arrive Paro','Scenic flight into Paro.','Rinpung Dzong and town.','Welcome dinner.', true,false,true),
 ('11111111-0000-0000-0000-000000000008',4,'Tigers Nest Hike','Hike to Taktsang (Tigers Nest).','Monastery visit and descent.','Wellness ritual.', true,true,true),
 ('11111111-0000-0000-0000-000000000008',6,'Punakha Valley','Drive over Dochula Pass.','Punakha Dzong and suspension bridge.','Farmhouse dinner.', true,true,true),
 ('11111111-0000-0000-0000-000000000008',8,'Departure','Breakfast in Thimphu.','Transfer to Paro airport.','', true,false,false);

-- A few itinerary-day images (Goa day 1 & Kerala day 4)
INSERT INTO itinerary_day_images (itinerary_day_id, image_url, display_order)
SELECT d.id, 'https://picsum.photos/seed/goa-day1/1000/700', 0
FROM itinerary_days d WHERE d.package_id='11111111-0000-0000-0000-000000000001' AND d.day_number=1;
INSERT INTO itinerary_day_images (itinerary_day_id, image_url, display_order)
SELECT d.id, 'https://picsum.photos/seed/kerala-houseboat/1000/700', 0
FROM itinerary_days d WHERE d.package_id='11111111-0000-0000-0000-000000000003' AND d.day_number=4;

-- =====================================================================
--  INCLUSIONS / EXCLUSIONS
-- =====================================================================
INSERT INTO package_inclusions (package_id, item_text, icon_name, is_included, display_order) VALUES
 ('11111111-0000-0000-0000-000000000001','3 nights hotel accommodation','bed', true, 0),
 ('11111111-0000-0000-0000-000000000001','Daily breakfast','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000001','Airport transfers in a private cab','car', true, 2),
 ('11111111-0000-0000-0000-000000000001','Sunset river cruise tickets','ship', true, 3),
 ('11111111-0000-0000-0000-000000000001','All applicable taxes','receipt', true, 4),
 ('11111111-0000-0000-0000-000000000001','Airfare to/from Goa','plane', false, 5),
 ('11111111-0000-0000-0000-000000000001','Lunch and dinner (except mentioned)','utensils', false, 6),
 ('11111111-0000-0000-0000-000000000001','Personal expenses and tips','wallet', false, 7),
 ('11111111-0000-0000-0000-000000000002','4 nights hotel accommodation','bed', true, 0),
 ('11111111-0000-0000-0000-000000000002','Daily breakfast and dinner','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000002','Private cab for all transfers','car', true, 2),
 ('11111111-0000-0000-0000-000000000002','Atal Tunnel & Sissu excursion','mountain', true, 3),
 ('11111111-0000-0000-0000-000000000002','Adventure activity charges at Solang','activity', false, 4),
 ('11111111-0000-0000-0000-000000000002','Airfare and train tickets','plane', false, 5),
 ('11111111-0000-0000-0000-000000000003','5 nights accommodation incl. houseboat','bed', true, 0),
 ('11111111-0000-0000-0000-000000000003','Daily breakfast; full board on houseboat','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000003','All transfers in an AC vehicle','car', true, 2),
 ('11111111-0000-0000-0000-000000000003','Kathakali show tickets','ticket', true, 3),
 ('11111111-0000-0000-0000-000000000003','Airfare to Kochi / from Trivandrum','plane', false, 4),
 ('11111111-0000-0000-0000-000000000003','Monument entry fees','ticket', false, 5),
 ('11111111-0000-0000-0000-000000000004','6 nights heritage-style hotels','bed', true, 0),
 ('11111111-0000-0000-0000-000000000004','Daily breakfast','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000004','Private AC car with driver','car', true, 2),
 ('11111111-0000-0000-0000-000000000004','Chokhi Dhani cultural evening','music', true, 3),
 ('11111111-0000-0000-0000-000000000004','Monument entry fees','ticket', false, 4),
 ('11111111-0000-0000-0000-000000000005','5 nights island resorts','bed', true, 0),
 ('11111111-0000-0000-0000-000000000005','Daily breakfast and dinner','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000005','All ferry tickets (private/premium)','ship', true, 2),
 ('11111111-0000-0000-0000-000000000005','Snorkelling at Elephant Beach','activity', true, 3),
 ('11111111-0000-0000-0000-000000000005','Scuba diving (optional, on-site)','activity', false, 4),
 ('11111111-0000-0000-0000-000000000005','Airfare to Port Blair','plane', false, 5),
 ('11111111-0000-0000-0000-000000000006','6 nights hotels + Pangong camp','bed', true, 0),
 ('11111111-0000-0000-0000-000000000006','All meals during the expedition','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000006','Inner-line permits and oxygen support','shield', true, 2),
 ('11111111-0000-0000-0000-000000000006','SUV with experienced mountain driver','car', true, 3),
 ('11111111-0000-0000-0000-000000000006','Airfare to Leh','plane', false, 4),
 ('11111111-0000-0000-0000-000000000007','4 nights (houseboat + hotels)','bed', true, 0),
 ('11111111-0000-0000-0000-000000000007','Daily breakfast and dinner','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000007','Shikara ride and all transfers','ship', true, 2),
 ('11111111-0000-0000-0000-000000000007','Gulmarg gondola phase-1 ticket','ticket', true, 3),
 ('11111111-0000-0000-0000-000000000007','Airfare to Srinagar','plane', false, 4),
 ('11111111-0000-0000-0000-000000000008','7 nights luxury lodges','bed', true, 0),
 ('11111111-0000-0000-0000-000000000008','Full board fine dining','utensils', true, 1),
 ('11111111-0000-0000-0000-000000000008','Bhutan visa and sustainable-tourism fee','shield', true, 2),
 ('11111111-0000-0000-0000-000000000008','Private guide and luxury vehicle','car', true, 3),
 ('11111111-0000-0000-0000-000000000008','International airfare','plane', false, 4);

-- =====================================================================
--  STAY DETAILS
-- =====================================================================
INSERT INTO stay_details (package_id, hotel_name, location, rating, room_type, amenities, image_url, check_in_date, check_out_date, display_order) VALUES
 ('11111111-0000-0000-0000-000000000001','Ocean Pearl Resort','Candolim, North Goa',4,'Deluxe Sea-View Room', ARRAY['Pool','WiFi','Breakfast','Beach access'],'https://picsum.photos/seed/goa-hotel/1000/700','Day 1','Day 4',0),
 ('11111111-0000-0000-0000-000000000002','Snow Valley Cottages','Log Huts Area, Manali',4,'Premium Cottage', ARRAY['Mountain view','Heater','WiFi','Bonfire'],'https://picsum.photos/seed/manali-hotel/1000/700','Day 1','Day 5',0),
 ('11111111-0000-0000-0000-000000000003','Backwater Retreat & Houseboat','Alleppey, Kerala',5,'Private Houseboat + Resort', ARRAY['Full board','AC','Sun deck','WiFi'],'https://picsum.photos/seed/kerala-hotel/1000/700','Day 1','Day 6',0),
 ('11111111-0000-0000-0000-000000000004','Rawla Heritage Haveli','Jaipur / Udaipur',4,'Heritage Suite', ARRAY['Courtyard','Pool','WiFi','Cultural evenings'],'https://picsum.photos/seed/rajasthan-hotel/1000/700','Day 1','Day 7',0),
 ('11111111-0000-0000-0000-000000000005','Coral Reef Beach Resort','Havelock, Andaman',5,'Beach Villa', ARRAY['Private beach','Pool','Spa','WiFi'],'https://picsum.photos/seed/andaman-hotel/1000/700','Day 1','Day 6',0),
 ('11111111-0000-0000-0000-000000000006','Himalayan Base Camp & Lodge','Leh / Pangong',3,'Deluxe Room + Luxury Camp', ARRAY['Oxygen support','Heater','Meals','Bonfire'],'https://picsum.photos/seed/ladakh-hotel/1000/700','Day 1','Day 7',0),
 ('11111111-0000-0000-0000-000000000007','Dal Lake Heritage Houseboat','Srinagar, Kashmir',4,'Carved Wooden Suite', ARRAY['Lake view','Heater','WiFi','Shikara service'],'https://picsum.photos/seed/kashmir-hotel/1000/700','Day 1','Day 5',0),
 ('11111111-0000-0000-0000-000000000008','Thunder Dragon Luxury Lodge','Paro / Punakha / Thimphu',5,'Valley-View Suite', ARRAY['Spa','Fine dining','Butler','Wellness rituals'],'https://picsum.photos/seed/bhutan-hotel/1000/700','Day 1','Day 8',0);

-- =====================================================================
--  TRAVEL TIPS (rendered as highlights)
-- =====================================================================
INSERT INTO travel_tips (package_id, tip_text, display_order) VALUES
 ('11111111-0000-0000-0000-000000000001','Carry light cotton clothes, sunscreen and flip-flops.',0),
 ('11111111-0000-0000-0000-000000000001','Rent a scooter to explore hidden beaches at your own pace.',1),
 ('11111111-0000-0000-0000-000000000001','Bargain politely at flea markets for the best souvenirs.',2),
 ('11111111-0000-0000-0000-000000000002','Pack layered woollens; mountain evenings get cold even in summer.',0),
 ('11111111-0000-0000-0000-000000000002','Book Atal Tunnel drives early to avoid afternoon traffic.',1),
 ('11111111-0000-0000-0000-000000000002','Stay hydrated and walk slowly on the first day to adjust.',2),
 ('11111111-0000-0000-0000-000000000003','Try a traditional Kerala sadya (banana-leaf thali).',0),
 ('11111111-0000-0000-0000-000000000003','Book the houseboat sun-deck side for sunset views.',1),
 ('11111111-0000-0000-0000-000000000004','Dress modestly for temple and palace visits.',0),
 ('11111111-0000-0000-0000-000000000004','Start fort visits early to beat the desert heat.',1),
 ('11111111-0000-0000-0000-000000000005','Carry reef-safe sunscreen to protect the coral.',0),
 ('11111111-0000-0000-0000-000000000005','Ferries can sell out — pre-book premium tickets.',1),
 ('11111111-0000-0000-0000-000000000006','Spend the first 24 hours resting to prevent altitude sickness.',0),
 ('11111111-0000-0000-0000-000000000006','Carry cash; ATMs are scarce beyond Leh.',1),
 ('11111111-0000-0000-0000-000000000007','Negotiate shikara and shopping prices in advance.',0),
 ('11111111-0000-0000-0000-000000000008','Train a little before the Tigers Nest hike (2–3 hours uphill).',0);

-- =====================================================================
--  BEST TIME TO VISIT
-- =====================================================================
INSERT INTO best_time_to_visit (package_id, month_start, month_end, description, weather_condition) VALUES
 ('11111111-0000-0000-0000-000000000001','November','February','Peak season with pleasant, dry beach weather.','Warm & sunny'),
 ('11111111-0000-0000-0000-000000000002','March','June','Clear skies and accessible snow points.','Cool & crisp'),
 ('11111111-0000-0000-0000-000000000002','December','February','Heavy snowfall; great for snow lovers.','Cold & snowy'),
 ('11111111-0000-0000-0000-000000000003','September','March','Lush greenery after the monsoon.','Pleasant & humid'),
 ('11111111-0000-0000-0000-000000000004','October','March','Comfortable days ideal for sightseeing.','Warm days, cool nights'),
 ('11111111-0000-0000-0000-000000000005','October','May','Calm seas, perfect for water sports.','Warm & tropical'),
 ('11111111-0000-0000-0000-000000000006','June','September','Only window when high passes stay open.','Cold, thin air'),
 ('11111111-0000-0000-0000-000000000007','March','October','Blooming gardens through to crisp autumn.','Cool & scenic'),
 ('11111111-0000-0000-0000-000000000008','March','May','Clear skies and rhododendron blooms.','Mild & pleasant');

-- =====================================================================
--  PLACES TO VISIT
-- =====================================================================
INSERT INTO places_to_visit (package_id, place_name, description, distance_from_hotel, entry_fee) VALUES
 ('11111111-0000-0000-0000-000000000001','Fort Aguada','17th-century Portuguese fort with lighthouse views.','12 km','Free'),
 ('11111111-0000-0000-0000-000000000001','Basilica of Bom Jesus','UNESCO World Heritage baroque church.','15 km','Free'),
 ('11111111-0000-0000-0000-000000000002','Solang Valley','Adventure hub for paragliding and skiing.','14 km','Activity-based'),
 ('11111111-0000-0000-0000-000000000002','Hadimba Temple','Ancient cedar-wood temple in the forest.','3 km','Free'),
 ('11111111-0000-0000-0000-000000000003','Eravikulam National Park','Home of the endangered Nilgiri Tahr.','13 km','₹200'),
 ('11111111-0000-0000-0000-000000000003','Alleppey Backwaters','Palm-lined canals best seen by houseboat.','On route','Included'),
 ('11111111-0000-0000-0000-000000000004','Amber Fort','Hilltop fort with mirror palace and elephant rides.','11 km','₹200'),
 ('11111111-0000-0000-0000-000000000004','Lake Pichola','Scenic lake with palace islands.','2 km','Boat ₹400'),
 ('11111111-0000-0000-0000-000000000005','Radhanagar Beach','Asia''s top-rated white-sand beach.','9 km','Free'),
 ('11111111-0000-0000-0000-000000000005','Cellular Jail','Colonial-era jail with a moving light & sound show.','3 km','₹300'),
 ('11111111-0000-0000-0000-000000000006','Pangong Tso','High-altitude lake famed for its shifting blues.','160 km','Permit'),
 ('11111111-0000-0000-0000-000000000006','Khardung La','One of the world''s highest motorable passes.','40 km','Permit'),
 ('11111111-0000-0000-0000-000000000007','Gulmarg Gondola','One of the highest cable cars in the world.','50 km','₹740+'),
 ('11111111-0000-0000-0000-000000000007','Mughal Gardens','Terraced gardens of Nishat and Shalimar.','9 km','₹24'),
 ('11111111-0000-0000-0000-000000000008','Tiger''s Nest Monastery','Cliffside monastery 900m above the valley.','On route','Included');

-- =====================================================================
--  REVIEWS  (mostly approved; a few pending/rejected for the admin queue)
--  Fixed IDs on the ones that carry photos.
-- =====================================================================
INSERT INTO reviews (id, package_id, reviewer_name, reviewer_email, rating, review_text, is_approved, created_at) VALUES
 ('33333333-0000-0000-0000-000000000001','11111111-0000-0000-0000-000000000001','Ananya Sharma','ananya@seed.local',5,'Absolutely loved the Goa trip! The river cruise at sunset was magical and the hotel was right on the beach. Perfectly organised from start to finish.', true, NOW() - INTERVAL '20 days'),
 ('33333333-0000-0000-0000-000000000002','11111111-0000-0000-0000-000000000001','Rahul Mehta','rahul@seed.local',4,'Great value for a long weekend. Loved the spice plantation lunch. Would have liked one more day in South Goa.', true, NOW() - INTERVAL '12 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000001','Priya Nair','priya@seed.local',5,'Our honeymoon was stress-free thanks to the team. Highly recommend!', true, NOW() - INTERVAL '6 days'),
 ('33333333-0000-0000-0000-000000000003','11111111-0000-0000-0000-000000000002','Vikram Singh','vikram@seed.local',5,'The Solang Valley adventure was the highlight — paragliding over the snow was unreal. Guides were fantastic with the kids.', true, NOW() - INTERVAL '18 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000002','Neha Gupta','neha@seed.local',4,'Beautiful scenery and cozy cottages. The Atal Tunnel drive was a bonus. Roads were a bit bumpy but worth it.', true, NOW() - INTERVAL '9 days'),
 ('33333333-0000-0000-0000-000000000004','11111111-0000-0000-0000-000000000003','Arjun Menon','arjun@seed.local',5,'The houseboat night on the Alleppey backwaters was the most peaceful experience of our lives. Food was outstanding.', true, NOW() - INTERVAL '25 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000003','Sara Thomas','sara@seed.local',5,'Munnar tea hills took our breath away. Everything ran on time. Thank you Travel Carvers!', true, NOW() - INTERVAL '4 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000004','Karan Malhotra','karan@seed.local',4,'Rajasthan was a cultural feast. The heritage havelis were gorgeous. Slightly rushed in Jodhpur.', true, NOW() - INTERVAL '15 days'),
 ('33333333-0000-0000-0000-000000000005','11111111-0000-0000-0000-000000000005','Meera Iyer','meera@seed.local',5,'Radhanagar Beach is even better than the photos. Snorkelling at Elephant Beach was a dream. Worth every rupee.', true, NOW() - INTERVAL '11 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000006','Aditya Rao','aditya@seed.local',5,'A once-in-a-lifetime expedition. Pangong Tso at dawn is unforgettable. The oxygen support was reassuring.', true, NOW() - INTERVAL '30 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000007','Ishaan Kapoor','ishaan@seed.local',5,'Kashmir truly is paradise. The shikara ride and Gulmarg gondola were highlights. Loved the houseboat stay.', true, NOW() - INTERVAL '7 days'),
 -- Pending (awaiting moderation) — visible only in the admin queue
 (DEFAULT,'11111111-0000-0000-0000-000000000001','Anonymous Guest','pending1@seed.local',3,'It was okay overall, but check-in took a while. Sharing more feedback soon.', NULL, NOW() - INTERVAL '2 days'),
 (DEFAULT,'11111111-0000-0000-0000-000000000004','Test Reviewer','pending2@seed.local',5,'Amazing! Pending approval to appear publicly.', NULL, NOW() - INTERVAL '1 days'),
 -- Rejected (won''t show publicly)
 (DEFAULT,'11111111-0000-0000-0000-000000000002','Spam Bot','rejected@seed.local',1,'Visit my website for cheap deals!!!', false, NOW() - INTERVAL '3 days');

-- Review photos for the fixed-ID reviews (gallery + lightbox demo)
INSERT INTO review_photos (review_id, image_url) VALUES
 ('33333333-0000-0000-0000-000000000001','https://picsum.photos/seed/rev-goa-a/900/700'),
 ('33333333-0000-0000-0000-000000000001','https://picsum.photos/seed/rev-goa-b/900/700'),
 ('33333333-0000-0000-0000-000000000001','https://picsum.photos/seed/rev-goa-c/900/700'),
 ('33333333-0000-0000-0000-000000000002','https://picsum.photos/seed/rev-goa-d/900/700'),
 ('33333333-0000-0000-0000-000000000003','https://picsum.photos/seed/rev-manali-a/900/700'),
 ('33333333-0000-0000-0000-000000000003','https://picsum.photos/seed/rev-manali-b/900/700'),
 ('33333333-0000-0000-0000-000000000004','https://picsum.photos/seed/rev-kerala-a/900/700'),
 ('33333333-0000-0000-0000-000000000004','https://picsum.photos/seed/rev-kerala-b/900/700'),
 ('33333333-0000-0000-0000-000000000005','https://picsum.photos/seed/rev-andaman-a/900/700'),
 ('33333333-0000-0000-0000-000000000005','https://picsum.photos/seed/rev-andaman-b/900/700'),
 ('33333333-0000-0000-0000-000000000005','https://picsum.photos/seed/rev-andaman-c/900/700');

-- =====================================================================
--  TESTIMONIALS  (homepage carousel — featured, plus one non-featured)
-- =====================================================================
INSERT INTO testimonials (id, customer_name, customer_role, review_text, rating, photo_url, is_featured, display_order) VALUES
 ('22222222-0000-0000-0000-000000000001','Ananya Sharma','Honeymooner, Mumbai','Travel Carvers planned our dream Goa honeymoon down to the last detail. We just showed up and enjoyed!',5,'https://i.pravatar.cc/200?img=45', true, 1),
 ('22222222-0000-0000-0000-000000000002','Vikram Singh','Family Traveller, Delhi','Our Manali family trip was flawless. The kids still talk about paragliding at Solang. Highly recommended.',5,'https://i.pravatar.cc/200?img=12', true, 2),
 ('22222222-0000-0000-0000-000000000003','Meera Iyer','Solo Explorer, Bengaluru','The Andaman islands were pure magic and everything was perfectly organised. I felt safe and cared for throughout.',5,'https://i.pravatar.cc/200?img=32', true, 3),
 ('22222222-0000-0000-0000-000000000004','Arjun Menon','Photographer, Kochi','The Kerala houseboat experience was unforgettable. Great value and genuinely warm service.',5,'https://i.pravatar.cc/200?img=68', true, 4),
 ('22222222-0000-0000-0000-000000000005','Aditya Rao','Adventurer, Pune','Leh-Ladakh was the trip of a lifetime. The team handled permits, altitude and logistics like pros.',5,'https://i.pravatar.cc/200?img=15', true, 5),
 ('22222222-0000-0000-0000-000000000006','Sara Thomas','Travel Blogger, Chennai','From booking to the final transfer, everything was seamless. Travel Carvers is now my go-to for holidays.',5,'https://i.pravatar.cc/200?img=25', true, 6),
 -- Non-featured: admin can see & feature it, but it will NOT appear publicly
 ('22222222-0000-0000-0000-000000000007','Rohit Verma','Corporate Client, Hyderabad','Draft testimonial pending a feature decision — not shown on the homepage yet.',4,'https://i.pravatar.cc/200?img=51', false, 7);

-- =====================================================================
--  SAMPLE LEADS  (for the admin leads dashboard)
-- =====================================================================
INSERT INTO leads (package_id, name, email, phone, message, number_of_adults, number_of_children, number_of_infants, travel_start_date, travel_end_date) VALUES
 ('11111111-0000-0000-0000-000000000001','Deepak Joshi','deepak@seed.local','+919812345670','Interested in the Goa package for a family of four in December.',2,2,0, CURRENT_DATE + 30, CURRENT_DATE + 34),
 ('11111111-0000-0000-0000-000000000003','Fatima Khan','fatima@seed.local','+919812345671','Please share a customised Kerala honeymoon quote with flights.',2,0,0, CURRENT_DATE + 45, CURRENT_DATE + 51),
 ('11111111-0000-0000-0000-000000000006','Sandeep Kumar','sandeep@seed.local','+919812345672','A group of 6 friends wants to do Leh-Ladakh in July. Availability?',6,0,0, CURRENT_DATE + 60, CURRENT_DATE + 67),
 (NULL,'Lena Fischer','lena@seed.local','+491701234567','Looking for a bespoke Bhutan luxury retreat for an anniversary.',2,0,0, CURRENT_DATE + 90, CURRENT_DATE + 98);

COMMIT;

-- Quick summary of what this seed inserted
SELECT
  (SELECT count(*) FROM packages)                                          AS packages,
  (SELECT count(*) FROM package_gallery)                                   AS gallery_images,
  (SELECT count(*) FROM itinerary_days)                                    AS itinerary_days,
  (SELECT count(*) FROM reviews WHERE is_approved IS TRUE)                 AS approved_reviews,
  (SELECT count(*) FROM reviews WHERE is_approved IS NULL)                 AS pending_reviews,
  (SELECT count(*) FROM review_photos)                                     AS review_photos,
  (SELECT count(*) FROM testimonials)                                      AS testimonials,
  (SELECT count(*) FROM leads WHERE email LIKE '%@seed.local')             AS sample_leads;
