# 🌍 Travel Carvers - Complete Application Specification

**Version:** 2.0  
**Date:** July 11, 2026  
**Tech Stack:** Next.js 16 + Supabase + Mailgun  
**Purpose:** Full-featured travel agency website with admin content management

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Customer-Facing Features](#customer-facing-features)
6. [Admin Panel Features](#admin-panel-features)
7. [API Endpoints](#api-endpoints)
8. [Email System](#email-system)
9. [File Upload System](#file-upload-system)
10. [SEO Implementation](#seo-implementation)
11. [UI/UX Requirements](#uiux-requirements)
12. [Implementation Phases](#implementation-phases)

---

## 1. PROJECT OVERVIEW

### Business Model
- **Type:** Lead generation travel agency (no payment processing)
- **Goal:** Showcase packages, collect customer leads via forms, send to admin
- **Admin Role:** Curate content, manage packages/categories, view leads & analytics

### Key Features
- Multi-category package system with many-to-many relationships
- Interactive world map integration (homepage)
- Dynamic pricing visibility control (global + per-package)
- Review system (public submission, auto-filter positive)
- Lead management with email notifications
- Admin-managed homepage sections (trust badges, testimonials)
- Mobile-first responsive design

---

## 2. TECH STACK

### Frontend
- **Framework:** Next.js 16.2.9 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Library:** Shadcn UI + Radix UI
- **State:** Redux Toolkit + React Query
- **Forms:** React Hook Form + Zod
- **Maps:** Leaflet.js (already implemented)
- **Animations:** Framer Motion

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (images)
- **Email:** Mailgun (transactional emails)

### Deployment
- **Hosting:** Vercel (Next.js)
- **Database:** Supabase Cloud
- **CDN:** Vercel Edge Network + Supabase CDN

### Development
- **Package Manager:** npm
- **Version Control:** Git/GitHub
- **Linting:** ESLint + Prettier

---

## 3. DATABASE SCHEMA

### Tables

#### 3.1 `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  icon_name VARCHAR(50), -- Lucide icon name
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);
```

#### 3.2 `subcategories`
```sql
CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subcategories_slug ON subcategories(slug);
```

#### 3.3 `category_subcategory` (Many-to-Many)
```sql
CREATE TABLE category_subcategory (
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (category_id, subcategory_id)
);
```

#### 3.4 `packages`
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  
  -- Pricing
  price_adult DECIMAL(10, 2),
  price_child DECIMAL(10, 2),
  price_infant DECIMAL(10, 2),
  show_price BOOLEAN DEFAULT true, -- Per-package override
  
  -- Duration & Details
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  difficulty_level VARCHAR(20), -- easy/moderate/hard
  group_size_min INTEGER,
  group_size_max INTEGER,
  age_restriction VARCHAR(100),
  
  -- Location (for map)
  main_destination_lat DECIMAL(10, 8),
  main_destination_lng DECIMAL(11, 8),
  destination_name VARCHAR(100),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- draft/published/archived
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  lead_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_is_featured ON packages(is_featured);
CREATE INDEX idx_packages_is_trending ON packages(is_trending);
CREATE INDEX idx_packages_coordinates ON packages(main_destination_lat, main_destination_lng);
```

#### 3.5 `package_categories` (Many-to-Many)
```sql
CREATE TABLE package_categories (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, category_id)
);
```

#### 3.6 `package_subcategories` (Many-to-Many)
```sql
CREATE TABLE package_subcategories (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, subcategory_id)
);
```

#### 3.7 `itinerary_days`
```sql
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Time-based activities
  morning_activity TEXT,
  afternoon_activity TEXT,
  evening_activity TEXT,
  
  -- Meals included
  breakfast_included BOOLEAN DEFAULT false,
  lunch_included BOOLEAN DEFAULT false,
  dinner_included BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_itinerary_days_package ON itinerary_days(package_id, day_number);
```

#### 3.8 `itinerary_day_images`
```sql
CREATE TABLE itinerary_day_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(200),
  display_order INTEGER DEFAULT 0
);
```

#### 3.9 `package_gallery`
```sql
CREATE TABLE package_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(200),
  is_cover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_package_gallery_package ON package_gallery(package_id);
```

#### 3.10 `package_videos`
```sql
CREATE TABLE package_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL, -- YouTube/Vimeo embed URL
  title VARCHAR(200),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.11 `places_to_visit`
```sql
CREATE TABLE places_to_visit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0
);
```

#### 3.12 `package_inclusions`
```sql
CREATE TABLE package_inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  icon_name VARCHAR(50), -- Lucide icon name
  is_included BOOLEAN DEFAULT true, -- true=included, false=excluded
  display_order INTEGER DEFAULT 0
);
```

#### 3.13 `stay_details`
```sql
CREATE TABLE stay_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  hotel_name VARCHAR(200),
  star_rating INTEGER, -- 1-5
  room_type VARCHAR(100),
  amenities TEXT[], -- Array of amenities
  location VARCHAR(200),
  display_order INTEGER DEFAULT 0
);
```

#### 3.14 `travel_tips`
```sql
CREATE TABLE travel_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  tip TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);
```

#### 3.15 `best_time_to_visit`
```sql
CREATE TABLE best_time_to_visit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  month_range VARCHAR(50), -- e.g., "March - May"
  description TEXT,
  weather_description TEXT
);
```

#### 3.16 `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  
  -- Reviewer info
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  travel_date DATE,
  
  -- Status
  is_approved BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT false, -- Auto true if rating >= 4
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_package ON reviews(package_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

#### 3.17 `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer info
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  
  -- Package interest
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  package_title VARCHAR(200), -- Snapshot in case package deleted
  
  -- Travel details
  travel_date DATE,
  number_of_travelers INTEGER,
  
  -- Metadata
  source VARCHAR(50), -- 'package_page', 'modal', 'contact_page', 'homepage'
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_package ON leads(package_id);
CREATE INDEX idx_leads_created ON leads(created_at);
```

#### 3.18 `trust_badges`
```sql
CREATE TABLE trust_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(50) NOT NULL,
  value VARCHAR(20) NOT NULL, -- e.g., "50+", "24/7"
  icon_name VARCHAR(50), -- Lucide icon name
  background_color VARCHAR(20), -- Tailwind color class
  text_color VARCHAR(20),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trust_badges_display_order ON trust_badges(display_order);
```

#### 3.19 `homepage_sections`
```sql
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(50) NOT NULL UNIQUE, -- 'hero', 'trending', 'categories', etc.
  section_name VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.20 `static_pages`
```sql
CREATE TABLE static_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key VARCHAR(50) NOT NULL UNIQUE, -- 'about_us', 'contact_us'
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL, -- Admin editable text content
  updated_by UUID, -- Admin user ID
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.21 `site_settings`
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(20), -- 'boolean', 'string', 'number', 'json'
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('global_show_prices', 'true', 'boolean', 'Global toggle to show/hide package prices'),
  ('company_name', 'Travel Carvers', 'string', 'Company name'),
  ('company_email', 'info@travelcarvers.in', 'string', 'Contact email'),
  ('company_phone', '+919876543210', 'string', 'Contact phone'),
  ('whatsapp_number', '+919876543210', 'string', 'WhatsApp number');
```

---

## 4. USER ROLES & PERMISSIONS

### 4.1 Admin (Single Super Admin)
- Full access to all admin panel features
- Create/edit/delete all content
- View analytics and leads
- Manage site settings
- **Authentication:** Email/password via Supabase Auth
- **Default credentials:** `admin@travelcarvers.in` / `Admin@123`

### 4.2 Customer (Public Users)
- Browse packages
- Submit reviews (email verified)
- Submit lead forms
- No authentication required

---

## 5. CUSTOMER-FACING FEATURES

### 5.1 Homepage

#### Hero Section (Already Implemented)
- Split-screen: Carousel (left) + Interactive World Map (right)
- Auto-rotating carousel (4 images, 5s interval)
- Map shows ALL published packages as pins
- Click pin → Show list of packages at that location
- Click package → Navigate to package detail page

#### Section: Trending Packages
- Display packages where `is_trending = true`
- Grid layout (responsive cards)
- Show: Cover image, title, duration, starting price (if visible), rating
- "View All Trending" button → `/packages/trending`

#### Section: Categories
- Display all active categories with cover images
- 6 vertical category cards (existing design)
- Click → Navigate to category page `/category/[slug]`

#### Section: Trust Badges
- Pull from `trust_badges` table
- Ordered by `display_order`
- Animated cycling effect (existing)
- Only show badges where `is_active = true`

#### Section: Testimonials (Auto-scrolling)
- Pull reviews where `is_visible = true` AND `rating >= 4`
- Sort by `created_at DESC` (newest first)
- Infinite horizontal scroll (existing animation)
- Show: Name, rating stars, comment, package title

#### Footer
- Company info, contact details
- Quick links (About, Contact, Categories)
- Social media links

### 5.2 Navigation Menu

**Desktop:**
- Logo (left)
- Menu: Home | Packages | Categories (dropdown) | Trending | About Us | Contact Us
- Search icon (right) → Opens search modal

**Mobile:**
- Hamburger menu
- Same links in drawer
- Search bar at top

**Categories Dropdown:**
- Show all categories as mega menu
- Each category shows its subcategories
- Click category → `/category/[slug]`
- Click subcategory → `/category/[category-slug]/[subcategory-slug]`

### 5.3 Global Search (Navbar)

**Features:**
- Search bar with autocomplete
- Search across: Packages, Categories, Subcategories
- Show instant results as dropdown
- Display: Package image, title, category tags
- Press Enter or click result → Navigate to page

**Implementation:**
- Debounced search (300ms)
- Full-text search using PostgreSQL `tsvector`
- Limit to 10 results

### 5.4 Package Listing Page (`/packages`)

**URL Structure:**
- All packages: `/packages`
- By category: `/category/[slug]`
- By subcategory: `/category/[category-slug]/[subcategory-slug]`
- Trending: `/packages/trending`

**Filters (Sidebar/Top on Mobile):**
- Categories (multi-select checkboxes)
- Subcategories (multi-select, dynamic based on category)
- Price range (slider) - only if prices visible
- Duration (checkboxes: 1-3 days, 4-6 days, 7-10 days, 10+ days)
- Search by destination name (text input)

**Sorting Options:**
- Rating (Highest first)
- Newest first
- Oldest first
- Popularity (most viewed)
- Price (Low to High / High to Low) - if prices visible

**Layout:**
- Grid view (3 columns desktop, 2 tablet, 1 mobile)
- Package card shows:
  - Cover image
  - Badges: Featured, Trending, New
  - Title
  - Duration (X days / Y nights)
  - Starting price (Adult: ₹X, Child: ₹Y) - if visible
  - Rating stars + review count
  - CTA: "View Details"

**Pagination:**
- 12 packages per page
- Infinite scroll or numbered pagination

### 5.5 Package Detail Page (`/package/[slug]`)

**URL:** `/package/[slug]`

**Page Structure:**

#### 1. Gallery Section
- Hero image carousel
- Up to 20 images
- Lightbox on click
- Thumbnails below
- Video embeds (YouTube) if available

#### 2. Overview Section
- Package title
- Badges: Featured, Trending, New
- Rating + review count
- Duration
- Difficulty level
- Group size
- Age restriction
- Short description
- Full description (rich text)

#### 3. Pricing Section (Conditional)
- If `show_price = true` AND `global_show_prices = true`:
  - Show: Adult: ₹X, Child: ₹Y, Infant: ₹Z
- Else:
  - Show: "Contact for Price" button → Opens enquiry modal

#### 4. Itinerary Section
- Day-by-day breakdown
- Each day shows:
  - Day number + title
  - Morning/Afternoon/Evening activities
  - Meal icons (B/L/D)
  - Images (if any)
- Expandable accordion format

#### 5. What's Included/Excluded Section
- Two columns: Included (✓ icons) | Excluded (✗ icons)
- Icon + text for each item
- Pulled from `package_inclusions` table

#### 6. Stay Details Section
- Hotel cards showing:
  - Hotel name
  - Star rating
  - Room type
  - Amenities (chips)
  - Location

#### 7. Best Time to Visit Section
- Month range
- Weather description
- Visual calendar/icons

#### 8. Travel Tips Section
- Bullet list of tips
- Collapsible if too long

#### 9. Reviews Section
- Average rating + total count
- Filter: All | 5★ | 4★
- Sort: Newest | Highest rated
- Each review shows: Name, rating, date, comment
- "Write a Review" button → Opens review modal
- Pagination (10 reviews per page)

#### 10. Enquiry Form Section
- Fixed form at bottom or sticky button
- Opens modal with lead form

**Floating Elements:**
- Sticky "Enquire Now" button (bottom right)
- Share buttons (WhatsApp, Facebook, Email)

### 5.6 Review Submission

**Modal Form Fields:**
- Name (text, required)
- Email (email, required)
- Rating (1-5 stars, required)
- Your Review (textarea, required, min 20 chars)
- Travel Date (date picker, optional)
- reCAPTCHA (spam protection)

**Flow:**
1. User fills form
2. Submit → Send verification email
3. User clicks link → Review saved with `email_verified = true`
4. If `rating >= 4` → Auto set `is_visible = true`
5. If `rating < 4` → `is_visible = false` (hidden from customers)
6. Admin can see all reviews in admin panel

### 5.7 Lead Form

**Form Fields:**
- Name (text, required)
- Email (email, required)
- Phone (tel, required, with country code)
- Package of Interest (dropdown, pre-selected if on package page)
- Travel Date (date picker, optional)
- Number of Travelers (number, optional)
- Message / Special Requirements (textarea, optional)
- reCAPTCHA

**Form Placement:**
1. Package detail page (bottom section)
2. Floating "Enquire Now" button → Opens modal
3. Dedicated Contact/Enquiry page (`/contact`)
4. Homepage hero CTA button → Opens modal

**Flow:**
1. User submits form
2. Save to `leads` table
3. Increment `package.lead_count`
4. Send email to admin (Mailgun)
5. Show success toast + redirect confirmation

### 5.8 Static Pages

#### About Us (`/about-us`)
- Hero section with company story
- Content pulled from `static_pages` table (`page_key = 'about_us'`)
- Admin can edit text content only
- Layout/structure is hardcoded

#### Contact Us (`/contact`)
- Contact information (email, phone, WhatsApp)
- Lead form (same as enquiry form)
- Optional: Google Maps embed (office location)
- Social media links

---

## 6. ADMIN PANEL FEATURES

### Base URL: `/admin`

### 6.1 Authentication

**Login Page:** `/admin/login`
- Email + password form
- "Remember me" checkbox (optional)
- Error handling with toast notifications

**Session Management:**
- 6-hour session (HTTP-only cookies)
- Auto-logout on expiry
- Redirect to login if unauthorized

### 6.2 Dashboard (`/admin/dashboard`)

**Widgets:**

1. **Stats Cards Row 1:**
   - Total Packages (published count)
   - Total Leads (all-time)
   - Total Reviews (approved count)
   - Total Categories

2. **Charts Row 2:**
   - Leads Per Package (bar chart)
   - Leads Over Time (line chart - last 30 days)
   - Package Views (top 5 packages)

3. **Recent Activity:**
   - Latest 10 leads (name, package, date)
   - Latest 5 reviews (name, rating, package)

4. **Quick Actions:**
   - Add New Package button
   - View All Leads button
   - Manage Categories button

### 6.3 Packages Management (`/admin/packages`)

#### List View
- Table/Grid toggle
- Filters:
  - Status (draft/published/archived)
  - Category
  - Is Featured / Is Trending / Is New
  - Search by title
- Columns:
  - Thumbnail
  - Title
  - Status badges
  - Categories (chips)
  - Price
  - Views
  - Leads
  - Rating
  - Actions (Edit, Delete, Clone)
- Bulk actions:
  - Change status
  - Delete selected
  - Export CSV

#### Create/Edit Package (`/admin/packages/new` | `/admin/packages/[id]/edit`)

**Form Tabs:**

**Tab 1: Basic Info**
- Title (auto-generate slug)
- Short description (150 chars)
- Full description (rich text editor - TipTap/Quill)
- Status (draft/published/archived)
- Flags: Featured, Trending, New (checkboxes)

**Tab 2: Pricing & Duration**
- Duration: Days + Nights
- Adult Price
- Child Price
- Infant Price
- Show Price toggle (override global setting)
- Difficulty level (dropdown)
- Group size (min/max)
- Age restriction (text)

**Tab 3: Categories & Location**
- Categories (multi-select with search)
- Subcategories (dynamic based on categories, multi-select)
- Main Destination Name
- Latitude (decimal input)
- Longitude (decimal input)
- Map preview (show pin on Leaflet map)

**Tab 4: Gallery**
- Upload images (drag & drop or file picker)
- Max 20 images
- Set cover image (radio button)
- Reorder images (drag & drop)
- Image captions
- Video URLs (YouTube/Vimeo embed links)

**Tab 5: Itinerary**
- Add Day button
- For each day:
  - Day number (auto)
  - Title
  - Description (rich text)
  - Morning activity
  - Afternoon activity
  - Evening activity
  - Meals included (B/L/D checkboxes)
  - Upload images (1-3 per day)
- Delete day button
- Reorder days (drag & drop)

**Tab 6: Inclusions**
- Add Inclusion/Exclusion button
- For each item:
  - Text
  - Icon picker (Lucide icons)
  - Is Included (toggle: ✓ or ✗)
  - Delete button
- Reorder (drag & drop)

**Tab 7: Stay Details**
- Add Hotel button
- For each hotel:
  - Hotel name
  - Star rating (1-5 dropdown)
  - Room type
  - Amenities (tags input)
  - Location
  - Delete button

**Tab 8: Additional Info**
- Best Time to Visit:
  - Month range
  - Description
  - Weather description
- Places to Visit:
  - Add Place button
  - Name + description (per place)
- Travel Tips:
  - Add Tip button
  - Tip text (per tip)

**Tab 9: SEO**
- Meta Title (auto-populate from title)
- Meta Description
- Preview: Google search result snippet

**Actions:**
- Save as Draft
- Publish
- Schedule Publish (future date)
- Preview (open in new tab)
- Delete

### 6.4 Categories Management (`/admin/categories`)

#### Categories List
- Table view with columns:
  - Icon/Cover image
  - Name
  - Slug
  - Subcategories count
  - Packages count
  - Display order
  - Active status
  - Actions (Edit, Delete)
- Drag & drop to reorder
- Add New Category button

#### Create/Edit Category
- Name (auto-generate slug)
- Description
- Cover image upload
- Icon picker (Lucide icons)
- Display order
- Is Active toggle
- Save / Cancel

#### Subcategories List (`/admin/subcategories`)
- Similar to categories
- Add to Categories (multi-select which categories this belongs to)

### 6.5 Leads Management (`/admin/leads`)

#### List View
- Table with columns:
  - Date
  - Name
  - Email
  - Phone
  - Package
  - Travel Date
  - Travelers
  - Actions (View, Delete)
- Filters:
  - Date range picker
  - Package (dropdown)
  - Search by name/email/phone
- Export CSV button

#### View Lead Detail (Modal or Page)
- Show all lead information
- Package details (linked)
- Customer message
- Contact buttons (email, phone, WhatsApp)
- Delete button

#### Analytics Tab
- Total leads count
- Leads per package (bar chart)
- Leads over time (line chart with date range)
- Leads by source (pie chart: homepage, package page, modal, contact page)

### 6.6 Reviews Management (`/admin/reviews`)

#### List View
- Table with columns:
  - Date
  - Package
  - Reviewer Name
  - Rating (stars)
  - Status (Visible/Hidden)
  - Email Verified (badge)
  - Actions (View, Approve, Hide, Delete)
- Filters:
  - Rating (1-5 stars)
  - Package (dropdown)
  - Visibility (visible/hidden)
  - Email verified (yes/no)

#### View Review (Modal)
- Full review details
- Package link
- Approve/Hide toggle
- Delete button

### 6.7 Homepage Management (`/admin/homepage`)

#### Section Manager
- List all homepage sections with:
  - Section name
  - Enabled/Disabled toggle
  - Display order
  - Actions
- Drag & drop to reorder sections
- Save Order button

**Editable Sections:**

1. **Trust Badges**
   - Add Badge button
   - For each badge:
     - Title
     - Value
     - Icon picker
     - Background color picker
     - Text color picker
     - Display order (drag & drop)
     - Delete button
   - Save button

2. **Testimonials**
   - Auto-pulled from reviews (no manual management)
   - Just show count: "Currently displaying X positive reviews"

### 6.8 Static Pages Management (`/admin/pages`)

#### List View
- About Us
- Contact Us

#### Edit Page
- Page title
- Content (textarea with character count)
- Last updated info
- Save button

**Note:** Layout/design is hardcoded, admin only edits text content.

### 6.9 Site Settings (`/admin/settings`)

**Tabs:**

**Tab 1: General**
- Company Name
- Company Email
- Company Phone
- WhatsApp Number
- Save button

**Tab 2: Display**
- Global Show Prices (toggle)
  - Description: "When OFF, all package prices are hidden unless individually overridden."
- Save button

**Tab 3: Admin Account**
- Change Password form
- Current password
- New password
- Confirm password
- Update button

---

## 7. API ENDPOINTS

### 7.1 Public API (Customer-facing)

**Packages:**
- `GET /api/packages` - List all published packages (with filters, sort, pagination)
- `GET /api/packages/[slug]` - Get package detail + increment view count
- `GET /api/packages/trending` - Get trending packages
- `GET /api/packages/featured` - Get featured packages

**Categories:**
- `GET /api/categories` - List all active categories
- `GET /api/categories/[slug]` - Get category detail + subcategories + packages
- `GET /api/subcategories/[slug]` - Get subcategory detail + packages

**Search:**
- `GET /api/search?q=[query]` - Global search (packages, categories, subcategories)

**Reviews:**
- `GET /api/packages/[slug]/reviews` - Get visible reviews for package
- `POST /api/reviews` - Submit new review (requires email verification)
- `GET /api/reviews/verify?token=[token]` - Verify email and activate review

**Leads:**
- `POST /api/leads` - Submit lead form
  - Triggers:
    - Save to database
    - Increment package.lead_count
    - Send email to admin (Mailgun)

**Homepage:**
- `GET /api/homepage/sections` - Get enabled sections in order
- `GET /api/homepage/trust-badges` - Get active trust badges
- `GET /api/homepage/testimonials` - Get visible positive reviews (random 10)

**Static Pages:**
- `GET /api/pages/about-us` - Get About Us content
- `GET /api/pages/contact-us` - Get Contact Us content

**Site Settings:**
- `GET /api/settings/public` - Get public settings (show_prices, contact info)

### 7.2 Admin API (Protected)

**Auth:**
- `POST /api/admin/login` - Login
- `POST /api/admin/logout` - Logout
- `GET /api/admin/me` - Get current admin user

**Packages:**
- `GET /api/admin/packages` - List all packages (any status)
- `POST /api/admin/packages` - Create package
- `PUT /api/admin/packages/[id]` - Update package
- `DELETE /api/admin/packages/[id]` - Delete package
- `POST /api/admin/packages/[id]/clone` - Clone package
- `PATCH /api/admin/packages/[id]/status` - Change status
- `PATCH /api/admin/packages/bulk` - Bulk operations

**Categories:**
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category
- `PATCH /api/admin/categories/reorder` - Update display order

**Subcategories:**
- `GET /api/admin/subcategories` - List subcategories
- `POST /api/admin/subcategories` - Create subcategory
- `PUT /api/admin/subcategories/[id]` - Update subcategory
- `DELETE /api/admin/subcategories/[id]` - Delete subcategory

**Leads:**
- `GET /api/admin/leads` - List all leads (with filters)
- `GET /api/admin/leads/[id]` - Get lead detail
- `DELETE /api/admin/leads/[id]` - Delete lead
- `GET /api/admin/leads/analytics` - Get lead analytics
- `GET /api/admin/leads/export` - Export leads CSV

**Reviews:**
- `GET /api/admin/reviews` - List all reviews (with filters)
- `PATCH /api/admin/reviews/[id]/approve` - Approve review
- `PATCH /api/admin/reviews/[id]/hide` - Hide review
- `DELETE /api/admin/reviews/[id]` - Delete review

**Homepage:**
- `GET /api/admin/homepage/sections` - Get all sections
- `PATCH /api/admin/homepage/sections/reorder` - Reorder sections
- `PATCH /api/admin/homepage/sections/[id]` - Toggle section enabled
- `GET /api/admin/homepage/trust-badges` - List badges
- `POST /api/admin/homepage/trust-badges` - Create badge
- `PUT /api/admin/homepage/trust-badges/[id]` - Update badge
- `DELETE /api/admin/homepage/trust-badges/[id]` - Delete badge
- `PATCH /api/admin/homepage/trust-badges/reorder` - Reorder badges

**Static Pages:**
- `GET /api/admin/pages` - List pages
- `PUT /api/admin/pages/[key]` - Update page content

**Settings:**
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings` - Update settings
- `PUT /api/admin/settings/password` - Change admin password

**Dashboard:**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/leads-chart` - Get leads chart data
- `GET /api/admin/dashboard/recent-activity` - Get recent leads + reviews

**File Upload:**
- `POST /api/admin/upload` - Upload image to Supabase Storage
  - Params: `bucket`, `file`
  - Returns: `{ url }`
- `DELETE /api/admin/upload` - Delete image from Supabase Storage
  - Params: `bucket`, `path`

---

## 8. EMAIL SYSTEM

### 8.1 Mailgun Setup

**Configuration:**
- Domain: `travelcarvers.in` (or subdomain like `mail.travelcarvers.in`)
- API Key: Store in `.env.local` as `MAILGUN_API_KEY`
- From Email: `noreply@travelcarvers.in`
- Admin Email: Store in `site_settings` table

**Email Library:**
```bash
npm install nodemailer mailgun.js
```

### 8.2 Email Templates

#### 1. Lead Notification to Admin

**Subject:** `New Lead from {Name} - {Package Title}`

**Body (HTML):**
```html
<h2>New Lead Received</h2>
<p><strong>Date:</strong> {Date}</p>
<p><strong>Name:</strong> {Name}</p>
<p><strong>Email:</strong> {Email}</p>
<p><strong>Phone:</strong> {Phone}</p>
<p><strong>Package:</strong> {Package Title}</p>
<p><strong>Travel Date:</strong> {Travel Date}</p>
<p><strong>Number of Travelers:</strong> {Count}</p>
<p><strong>Message:</strong><br>{Message}</p>
<a href="https://travelcarvers.in/admin/leads/{lead_id}">View in Admin Panel</a>
```

#### 2. Review Verification Email

**Subject:** `Verify Your Review for {Package Title}`

**Body:**
```html
<h2>Thank you for your review!</h2>
<p>Hi {Name},</p>
<p>Please verify your email to publish your review for <strong>{Package Title}</strong>.</p>
<a href="https://travelcarvers.in/api/reviews/verify?token={token}">Verify Email</a>
<p>If you didn't submit this review, please ignore this email.</p>
```

### 8.3 Email Triggers

| Event | Email | Recipient | Timing |
|-------|-------|-----------|--------|
| Lead submitted | Lead notification | Admin | Immediate |
| Review submitted | Verification | Reviewer | Immediate |

---

## 9. FILE UPLOAD SYSTEM

### 9.1 Supabase Storage Buckets

**Buckets to Create:**
- `packages` - Package gallery images
- `categories` - Category cover images
- `itinerary` - Itinerary day images
- `trust-badges` - Trust badge icons (if custom)

**Bucket Configuration:**
- Public: true
- File size limit: 5MB per image
- Allowed types: `image/jpeg`, `image/png`, `image/webp`

### 9.2 Upload Flow (Admin Panel)

1. Admin selects image(s)
2. Frontend uploads to Supabase Storage via `POST /api/admin/upload`
3. Backend:
   - Validate file type and size
   - Generate unique filename: `{uuid}.{ext}`
   - Upload to Supabase bucket
   - Return public URL
4. Frontend stores URL in form state
5. On form submit, save URLs to database

### 9.3 Image Optimization

**Next.js Image Component:**
- Use `<Image>` from `next/image` for all images
- Automatic optimization, lazy loading, responsive sizes
- Blur placeholder for gallery images

**Responsive Breakpoints:**
```typescript
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```

---

## 10. SEO IMPLEMENTATION

### 10.1 Dynamic Metadata (Next.js 13+ App Router)

**Package Detail Page:**
```typescript
export async function generateMetadata({ params }) {
  const package = await getPackage(params.slug)
  return {
    title: package.meta_title || `${package.title} - Travel Carvers`,
    description: package.meta_description || package.short_description,
    openGraph: {
      title: package.title,
      description: package.short_description,
      images: [package.cover_image],
      type: 'website',
    },
  }
}
```

### 10.2 Sitemap Generation

**File:** `app/sitemap.ts`

**Include:**
- Static pages: `/`, `/packages`, `/about-us`, `/contact`
- All published packages: `/package/[slug]`
- All active categories: `/category/[slug]`
- All active subcategories: `/category/[category]/[subcategory]`

**Update Frequency:**
- Homepage: daily
- Packages: weekly
- Categories: monthly

### 10.3 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://travelcarvers.in/sitemap.xml
```

---

## 11. UI/UX REQUIREMENTS

### 11.1 Design System (Already Established)

**Colors:**
- Primary Dark: `#5F6F52` (Sage Dark)
- Primary Medium: `#A9B388` (Sage Medium)
- Background: `#FEFAE0` (Cream)
- Accent: `#B99470` (Tan)

**Typography:**
- Font Family: System font stack (default Next.js)
- Headings: Bold, large sizes
- Body: Regular weight, readable line-height

**Components:**
- Shadcn UI + Radix UI (already installed)
- Custom components follow existing style

### 11.2 Responsive Design

**Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

**Mobile-First Approach:**
- Design for mobile, enhance for desktop
- Touch-friendly buttons (min 44x44px)
- Collapsible filters/menus on mobile
- Hamburger navigation

### 11.3 Loading States

- Skeleton loaders for package cards
- Spinner for form submissions
- Progress bar for image uploads
- Lazy loading for images (Next.js Image)

### 11.4 Accessibility

- Semantic HTML
- ARIA labels for icons
- Keyboard navigation
- Focus visible styles
- Alt text for all images

---

## 12. IMPLEMENTATION PHASES

### Phase 1: Database & Auth (Week 1)
- [ ] Create all database tables with migrations
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create Supabase Storage buckets
- [ ] Configure admin authentication
- [ ] Seed initial data (categories, homepage sections)

### Phase 2: Admin Panel - Core CRUD (Week 2-3)
- [ ] Admin layout + navigation
- [ ] Dashboard with stats
- [ ] Categories management
- [ ] Subcategories management
- [ ] Packages management (all tabs)
- [ ] File upload integration
- [ ] Site settings page

### Phase 3: Admin Panel - Advanced Features (Week 4)
- [ ] Leads management + analytics
- [ ] Reviews management
- [ ] Homepage section manager
- [ ] Trust badges manager
- [ ] Static pages editor
- [ ] Bulk operations

### Phase 4: Customer Pages - Core (Week 5-6)
- [ ] Navigation menu + search
- [ ] Homepage sections (integrate with admin data)
- [ ] Package listing page
- [ ] Package detail page (all sections)
- [ ] Category pages
- [ ] About Us / Contact Us pages

### Phase 5: Forms & Interactions (Week 7)
- [ ] Lead form (all placements)
- [ ] Review submission + verification
- [ ] Email notifications (Mailgun)
- [ ] Search functionality (autocomplete)
- [ ] Map integration (homepage pins)

### Phase 6: Polish & Optimization (Week 8)
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] SEO (metadata, sitemap)
- [ ] Error handling + validation
- [ ] Loading states + animations
- [ ] Cross-browser testing

### Phase 7: Testing & Deployment (Week 9)
- [ ] End-to-end testing
- [ ] Admin testing (all CRUD)
- [ ] Customer flow testing
- [ ] Fix bugs
- [ ] Deploy to Vercel + Supabase Cloud
- [ ] Configure Mailgun production
- [ ] DNS setup

### Phase 8: Launch & Monitoring (Week 10)
- [ ] Production launch
- [ ] Monitor errors (Sentry optional)
- [ ] Collect feedback
- [ ] Iterate improvements

---

## 13. TECHNICAL CONSIDERATIONS

### 13.1 Performance

**Optimization Strategies:**
- Server-side rendering (SSR) for SEO pages
- Static generation for categories
- Incremental static regeneration (ISR) for packages
- Image optimization via Next.js Image
- Database indexing on frequently queried columns
- React Query caching (1-minute stale time)

**Bundle Size:**
- Code splitting per route
- Lazy load heavy components (maps, rich text editor)
- Tree-shaking unused Shadcn components

### 13.2 Security

**Frontend:**
- Sanitize user inputs (XSS prevention)
- reCAPTCHA on forms (spam protection)
- HTTPS only (enforced by Vercel)

**Backend:**
- Supabase RLS policies (row-level security)
- Admin routes protected by session middleware
- Service role key only in server-side code
- Environment variables for secrets
- Rate limiting on API routes (optional)

**Database:**
- Prepared statements (SQL injection prevention)
- Email verification for reviews
- Input validation with Zod schemas

### 13.3 Scalability

**Database:**
- Indexes on foreign keys, slugs, dates
- Pagination for large datasets
- Archive old leads/reviews (optional)

**Storage:**
- Supabase CDN for images
- Consider Cloudinary if > 100GB storage needed

**Caching:**
- React Query for client-side caching
- Vercel Edge caching for static pages
- Supabase PostgREST caching (optional)

### 13.4 Monitoring

**Recommended Tools:**
- Vercel Analytics (page views, performance)
- Supabase Dashboard (database queries, storage)
- Mailgun Dashboard (email delivery rates)
- Console logs for errors (or Sentry for production)

---

## 14. ENVIRONMENT VARIABLES

**`.env.local` (Development):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME="Travel Carvers"

# Mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=mail.travelcarvers.in

# Admin
ADMIN_EMAIL=admin@travelcarvers.in

# Optional
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

**`.env.production` (Production):**
```bash
# Update all URLs to production domains
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_APP_URL=https://travelcarvers.in
# ... rest same as above with production keys
```

---

## 15. FOLDER STRUCTURE

```
travel-globe-website/
├── app/
│   ├── (customer)/                      # Customer route group
│   │   ├── layout.tsx                   # Navbar + Footer
│   │   ├── page.tsx                     # Homepage
│   │   ├── packages/
│   │   │   ├── page.tsx                 # All packages listing
│   │   │   ├── trending/page.tsx        # Trending packages
│   │   │   └── [slug]/page.tsx          # Package detail
│   │   ├── category/
│   │   │   ├── [slug]/page.tsx          # Category page
│   │   │   └── [category]/[subcategory]/page.tsx
│   │   ├── about-us/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── (admin)/                         # Admin route group
│   │   ├── layout.tsx                   # Admin nav + auth check
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── packages/
│   │   │   │   ├── page.tsx             # List
│   │   │   │   ├── new/page.tsx         # Create
│   │   │   │   └── [id]/edit/page.tsx   # Edit
│   │   │   ├── categories/page.tsx
│   │   │   ├── subcategories/page.tsx
│   │   │   ├── leads/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   ├── homepage/page.tsx
│   │   │   ├── pages/page.tsx           # Static pages
│   │   │   └── settings/page.tsx
│   │
│   ├── api/                             # API routes
│   │   ├── packages/
│   │   │   ├── route.ts                 # GET /api/packages
│   │   │   └── [slug]/route.ts          # GET /api/packages/[slug]
│   │   ├── leads/route.ts               # POST /api/leads
│   │   ├── reviews/
│   │   │   ├── route.ts                 # POST /api/reviews
│   │   │   └── verify/route.ts          # GET /api/reviews/verify
│   │   ├── search/route.ts
│   │   └── admin/
│   │       ├── packages/route.ts
│   │       ├── categories/route.ts
│   │       ├── leads/route.ts
│   │       ├── reviews/route.ts
│   │       ├── homepage/route.ts
│   │       ├── settings/route.ts
│   │       └── upload/route.ts
│   │
│   ├── layout.tsx                       # Root layout
│   ├── globals.css
│   └── sitemap.ts
│
├── components/
│   ├── customer/
│   │   ├── HeroSection.tsx              # Existing
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PackageCard.tsx
│   │   ├── PackageGrid.tsx
│   │   ├── PackageFilters.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── LeadForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── SearchModal.tsx
│   │
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── DragDropList.tsx
│   │   └── PackageForm/
│   │       ├── BasicInfoTab.tsx
│   │       ├── PricingTab.tsx
│   │       ├── CategoriesTab.tsx
│   │       ├── GalleryTab.tsx
│   │       ├── ItineraryTab.tsx
│   │       ├── InclusionsTab.tsx
│   │       ├── StayTab.tsx
│   │       ├── AdditionalTab.tsx
│   │       └── SEOTab.tsx
│   │
│   ├── shared/
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── ui/                              # Shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── RealWorldMap.tsx                 # Existing
│   └── Globe.tsx                        # Existing
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   │
│   ├── api/
│   │   ├── packages.ts                  # API client functions
│   │   ├── categories.ts
│   │   ├── leads.ts
│   │   ├── reviews.ts
│   │   └── admin.ts
│   │
│   ├── email/
│   │   ├── mailgun.ts                   # Mailgun client
│   │   └── templates.ts                 # Email templates
│   │
│   ├── validations/
│   │   ├── package.schema.ts            # Zod schemas
│   │   ├── category.schema.ts
│   │   ├── lead.schema.ts
│   │   └── review.schema.ts
│   │
│   ├── hooks/
│   │   ├── usePackages.ts               # React Query hooks
│   │   ├── useCategories.ts
│   │   ├── useLeads.ts
│   │   └── useAuth.ts
│   │
│   ├── redux/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── packageSlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── StoreProvider.tsx
│   │
│   └── utils.ts                         # Helper functions
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260711000001_create_categories.sql
│   │   ├── 20260711000002_create_packages.sql
│   │   ├── 20260711000003_create_reviews.sql
│   │   ├── 20260711000004_create_leads.sql
│   │   ├── 20260711000005_create_trust_badges.sql
│   │   ├── 20260711000006_create_static_pages.sql
│   │   ├── 20260711000007_create_site_settings.sql
│   │   └── 20260711000008_create_rls_policies.sql
│   │
│   ├── seed.sql                         # Initial data
│   └── config.toml
│
├── public/
│   ├── logo.png
│   ├── earth.jpg
│   └── images/
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 16. ACCEPTANCE CRITERIA

### Customer Features
- ✅ Homepage displays all sections (hero, trending, categories, trust badges, testimonials)
- ✅ World map shows package pins, click opens package list
- ✅ Package listing page with filters (category, price, duration, search)
- ✅ Package detail page shows all sections (gallery, itinerary, reviews, etc.)
- ✅ Lead form submits successfully, admin receives email
- ✅ Review form submits, email verification works, positive reviews display
- ✅ Search autocomplete works for packages/categories/subcategories
- ✅ Mobile responsive on all pages
- ✅ About Us and Contact Us pages display content

### Admin Features
- ✅ Admin can login/logout
- ✅ Dashboard shows accurate stats and charts
- ✅ Admin can create/edit/delete packages with all fields
- ✅ Admin can manage categories/subcategories
- ✅ Admin can view/filter/export leads
- ✅ Admin can view/approve/hide reviews
- ✅ Admin can reorder homepage sections
- ✅ Admin can manage trust badges (CRUD + reorder)
- ✅ Admin can edit static page content
- ✅ Admin can toggle global price visibility
- ✅ Admin can change password

### Technical
- ✅ All database tables created with proper relationships
- ✅ RLS policies secure data access
- ✅ Images upload to Supabase Storage
- ✅ Emails send via Mailgun
- ✅ SEO metadata on all pages
- ✅ Sitemap.xml auto-generated
- ✅ Performance: <3s page load on 3G
- ✅ Accessibility: WCAG AA compliant
- ✅ Deployed to Vercel + Supabase Cloud

---

## 17. NOTES & RECOMMENDATIONS

1. **Start Simple:** Implement core features first (packages, categories, leads). Add advanced features (analytics, bulk ops) later.

2. **Use Shadcn UI:** Leverage existing Shadcn components for forms, dialogs, tables. Don't reinvent the wheel.

3. **Optimize Images Early:** Use Next.js Image component from day 1 to avoid performance issues.

4. **Test Email Deliverability:** Set up Mailgun sandbox mode for testing before production.

5. **Mobile Testing:** Test on real devices, not just browser DevTools.

6. **Database Indexes:** Add indexes immediately to avoid slow queries as data grows.

7. **Error Handling:** Implement proper try-catch blocks and user-friendly error messages.

8. **Form Validation:** Use Zod schemas for both client and server validation.

9. **Accessibility:** Add ARIA labels, keyboard navigation, focus styles from the start.

10. **Documentation:** Document admin workflows for end users (how to add packages, etc.).

---

## 18. SUCCESS METRICS

### Week 1-2 (MVP)
- Admin can add 10+ packages with full details
- Customers can browse and view packages
- Lead form works, admin receives emails

### Month 1
- 50+ packages added
- 100+ leads collected
- Admin uses system daily without issues

### Month 3
- 1,000+ page views
- 500+ leads generated
- SEO: Ranking for brand keywords
- Mobile traffic: 60%+ of total

---

## 19. FUTURE ENHANCEMENTS (Post-Launch)

- Multi-language support (i18n)
- Payment gateway integration (Razorpay/Stripe)
- Customer accounts and booking history
- Email marketing integration (Mailchimp)
- Advanced analytics (Google Analytics 4)
- Chat widget (WhatsApp Business API)
- Blog/content section
- Referral program
- Mobile app (React Native)

---

**END OF SPECIFICATION**

This document is comprehensive and ready to be fed to an AI API or development team for implementation. All requirements, database schema, API endpoints, and technical details are clearly defined.

**Next Steps:**
1. Review and approve this specification
2. Set up development environment
3. Create Supabase project + Mailgun account
4. Begin Phase 1 implementation
5. Iterate based on feedback

---

**Document Version:** 2.0  
**Last Updated:** July 11, 2026  
**Prepared By:** Claude (AI Assistant)  
**Prepared For:** Travel Carvers Development Team
