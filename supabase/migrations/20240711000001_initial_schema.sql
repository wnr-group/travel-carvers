-- Travel Carvers Initial Database Schema
-- Created: 2024-07-11
-- This migration creates all 21 tables needed for the Travel Carvers application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================
-- 1. CATEGORIES & SUBCATEGORIES
-- =====================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE category_subcategory (
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (category_id, subcategory_id)
);

-- =====================================================
-- 2. PACKAGES
-- =====================================================

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Pricing
  price_adult DECIMAL(10,2),
  price_child DECIMAL(10,2),
  price_infant DECIMAL(10,2),
  show_price BOOLEAN DEFAULT true,

  -- Duration
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,

  -- Details
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'hard')),
  group_size_min INTEGER,
  group_size_max INTEGER,
  age_restriction VARCHAR(50),

  -- Location
  destination_name VARCHAR(200),
  main_destination_lat DECIMAL(10,8),
  main_destination_lng DECIMAL(11,8),

  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,

  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT,
  og_image TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Package-Category junction tables
CREATE TABLE package_categories (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, category_id)
);

CREATE TABLE package_subcategories (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, subcategory_id)
);

-- =====================================================
-- 3. PACKAGE GALLERY & VIDEOS
-- =====================================================

CREATE TABLE package_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE package_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. ITINERARY
-- =====================================================

CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  morning_activity TEXT,
  afternoon_activity TEXT,
  evening_activity TEXT,
  breakfast BOOLEAN DEFAULT false,
  lunch BOOLEAN DEFAULT false,
  dinner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE itinerary_day_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PACKAGE INCLUSIONS
-- =====================================================

CREATE TABLE package_inclusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  icon_name VARCHAR(50),
  is_included BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. STAY DETAILS
-- =====================================================

CREATE TABLE stay_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  hotel_name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  room_type VARCHAR(100),
  amenities TEXT[], -- Array of amenities
  image_url TEXT,
  check_in_date VARCHAR(50),
  check_out_date VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. ADDITIONAL PACKAGE INFO
-- =====================================================

CREATE TABLE travel_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  tip_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE best_time_to_visit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  month_start VARCHAR(20),
  month_end VARCHAR(20),
  description TEXT,
  weather_condition VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE places_to_visit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  place_name VARCHAR(200) NOT NULL,
  description TEXT,
  distance_from_hotel VARCHAR(50),
  entry_fee VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. LEADS & REVIEWS
-- =====================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  number_of_adults INTEGER DEFAULT 1,
  number_of_children INTEGER DEFAULT 0,
  number_of_infants INTEGER DEFAULT 0,
  travel_start_date DATE,
  travel_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_email VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT NULL, -- NULL = pending, true = approved, false = rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. HOMEPAGE & SITE SETTINGS
-- =====================================================

CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_cta_text VARCHAR(50),
  featured_title VARCHAR(100),
  featured_description TEXT,
  trending_title VARCHAR(100),
  trending_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trust_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text VARCHAR(200) NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(100),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  address TEXT,
  show_prices_globally BOOLEAN DEFAULT true,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE static_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key VARCHAR(50) UNIQUE NOT NULL, -- 'about', 'contact', 'terms', etc.
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_featured ON packages(is_featured) WHERE is_featured = true;
CREATE INDEX idx_packages_trending ON packages(is_trending) WHERE is_trending = true;
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_subcategories_slug ON subcategories(slug);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_itinerary_package ON itinerary_days(package_id, day_number);

-- =====================================================
-- 11. UPDATED_AT TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. TESTIMONIALS
-- =====================================================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_role VARCHAR(255),
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- service_role policy
CREATE POLICY "Enable all operations for service_role on testimonials"
ON testimonials FOR ALL
TO service_role
USING (true);

-- public read policy
CREATE POLICY "Public can read testimonials"
ON testimonials FOR SELECT
TO anon, authenticated
USING (true);

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON SCHEMA public IS 'Travel Carvers Database Schema - Initial Migration';
