-- Seed data for Travel Carvers
-- This file is automatically loaded by Supabase on db reset

-- Categories
INSERT INTO categories (name, slug, description, icon_name, display_order) VALUES
  ('Beach', 'beach', 'Tropical beach destinations', 'umbrella-beach', 1),
  ('Mountain', 'mountain', 'Mountain and hill stations', 'mountain', 2),
  ('Adventure', 'adventure', 'Adventure and trekking tours', 'hiking', 3),
  ('Cultural', 'cultural', 'Cultural and heritage tours', 'landmark', 4),
  ('Wildlife', 'wildlife', 'Wildlife safaris and nature tours', 'paw', 5);

-- Subcategories
INSERT INTO subcategories (name, slug, icon_name, display_order) VALUES
  ('Honeymoon', 'honeymoon', 'heart', 1),
  ('Family', 'family', 'users', 2),
  ('Budget', 'budget', 'dollar', 3),
  ('Luxury', 'luxury', 'crown', 4),
  ('Group', 'group', 'user-group', 5);

-- Homepage Sections
INSERT INTO homepage_sections (hero_title, hero_subtitle, hero_cta_text, featured_title, featured_description, trending_title, trending_description) VALUES
  ('Explore the World with Travel Carvers', 'Discover amazing destinations and create unforgettable memories', 'Browse Packages', 'Featured Destinations', 'Hand-picked destinations for an unforgettable experience', 'Trending Now', 'Most popular packages chosen by travelers');

-- Trust Badges
INSERT INTO trust_badges (text, icon, display_order) VALUES
  ('10,000+ Happy Travelers', '😊', 1),
  ('100+ Destinations', '🌍', 2),
  ('24/7 Support', '💬', 3),
  ('Best Price Guarantee', '💰', 4);

-- Site Settings
INSERT INTO site_settings (company_name, contact_email, contact_phone, address, show_prices_globally, facebook_url, instagram_url, twitter_url, linkedin_url) VALUES
  ('Travel Carvers', 'info@travelcarvers.com', '+919876543210', '123 Travel Street, Adventure City, India', true, 'https://facebook.com/travelcarvers', 'https://instagram.com/travelcarvers', 'https://twitter.com/travelcarvers', 'https://linkedin.com/company/travelcarvers');

-- Static Pages
INSERT INTO static_pages (page_key, title, content, meta_title, meta_description, is_active) VALUES
  ('about', 'About Us', '<h1>About Travel Carvers</h1><p>We are passionate about creating unforgettable travel experiences...</p>', 'About Us - Travel Carvers', 'Learn more about Travel Carvers and our mission to create amazing travel experiences', true),
  ('contact', 'Contact Us', '<h1>Contact Us</h1><p>Get in touch with our travel experts...</p>', 'Contact Us - Travel Carvers', 'Contact Travel Carvers for inquiries and bookings', true);
