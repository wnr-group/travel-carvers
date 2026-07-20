# Complete Production-Ready Travel Carvers Tickets

**Application Type**: Lead Generation Travel Agency Website (NO PAYMENTS)  
**Business Model**: Showcase packages → Collect leads → Admin manages inquiries  
**Total Sprints**: 5 sprints (10 weeks with 2 developers)  
**Total Estimated Time**: ~240 hours

---

## What This App Actually Does

✅ **Showcase travel packages** with beautiful galleries, itineraries, inclusions  
✅ **Collect customer leads** via "Inquiry" forms (not bookings)  
✅ **Send lead emails to admin** via Mailgun  
✅ **Admin manages content** (packages, categories, leads, reviews)  
✅ **Customer reviews** with auto-approval for 4-5 stars  
✅ **No payments, no bookings, no transactions**

---

## Sprint 3: Core Missing Features (45 hours)

### TVLCVR-78: Complete Package CRUD in Admin Panel
**Type**: Story | **Priority**: Critical | **Time**: 12 hours

**Description**: Implement full Create, Read, Update, Delete functionality for packages in admin panel.

**Current State**: Admin dashboard exists but package management is incomplete.

**Acceptance Criteria**:
- ✅ Admin can create new packages with all fields
- ✅ Multi-step form: Basic Info → Itinerary → Inclusions → Gallery → Stay Details → Travel Tips
- ✅ Image uploader for package gallery (multiple images)
- ✅ Mark cover image, set display order
- ✅ Edit existing packages
- ✅ Delete packages (with confirmation)
- ✅ Duplicate package feature
- ✅ Publish/Draft status toggle
- ✅ Form validation (Zod schema)
- ✅ Success/error toast notifications

**Files**:
- `app/(admin)/admin/packages/new/page.tsx`
- `app/(admin)/admin/packages/[id]/edit/page.tsx`
- `components/admin/PackageForm.tsx`
- `components/admin/ItineraryBuilder.tsx`
- `components/admin/InclusionsManager.tsx`
- `lib/api/packages.ts` (admin CRUD functions)

---

### TVLCVR-79: Complete Category & Subcategory Management
**Type**: Story | **Priority**: High | **Time**: 8 hours

**Description**: Full CRUD for categories and subcategories with drag-and-drop reordering.

**Acceptance Criteria**:
- ✅ Create/edit/delete categories
- ✅ Upload category cover images
- ✅ Select Lucide icon for each category
- ✅ Drag-and-drop to reorder categories (display_order)
- ✅ Create subcategories under categories
- ✅ Manage subcategory hierarchy
- ✅ Active/inactive toggle
- ✅ Slug auto-generation from name

**Files**:
- `app/(admin)/admin/categories/page.tsx`
- `components/admin/CategoryManager.tsx`
- `components/admin/CategoryForm.tsx`
- `lib/api/categories.ts`

---

### TVLCVR-80: Destination Management System
**Type**: Story | **Priority**: High | **Time**: 6 hours

**Description**: Manage destinations (countries, cities) with package associations.

**Acceptance Criteria**:
- ✅ Create/edit/delete destinations
- ✅ Country and city fields
- ✅ Upload destination hero images
- ✅ Add destination descriptions
- ✅ View all packages for each destination
- ✅ Popular/featured destination toggle
- ✅ Search and filter destinations

**Files**:
- `app/(admin)/admin/destinations/page.tsx`
- `components/admin/DestinationManager.tsx`
- `lib/api/destinations.ts`

---

### TVLCVR-81: Lead Management Dashboard Enhancement
**Type**: Story | **Priority**: Critical | **Time**: 8 hours

**Description**: Complete lead management with status workflow, notes, and email integration.

**Acceptance Criteria**:
- ✅ Lead status workflow: New → Contacted → Qualified → Converted → Lost
- ✅ Add notes to leads (timestamped, admin-authored)
- ✅ Assign leads to admin team members (if multi-admin)
- ✅ Filter leads by: status, date range, package, source
- ✅ Search leads by: name, email, phone, package
- ✅ Sort leads by: date, status, package
- ✅ Quick actions: Call button, Email button, WhatsApp button
- ✅ Lead detail modal with full info + notes history
- ✅ Export filtered leads as CSV
- ✅ Bulk actions: Mark as contacted, Delete selected

**Files**:
- `app/(admin)/admin/leads/page.tsx` (enhance existing)
- `components/admin/LeadTable.tsx`
- `components/admin/LeadDetailModal.tsx`
- `components/admin/LeadNotesSection.tsx`
- `lib/api/leads.ts` (add note functions)

---

### TVLCVR-82: Review Management & Moderation
**Type**: Story | **Priority**: High | **Time**: 6 hours

**Description**: Admin panel to moderate, approve, reject, and feature customer reviews.

**Acceptance Criteria**:
- ✅ View all reviews (approved, pending, rejected)
- ✅ Filter by: status, rating, package
- ✅ Approve/reject reviews manually
- ✅ Feature/unfeature reviews (show on homepage)
- ✅ Edit review text (fix typos, moderate content)
- ✅ Delete reviews
- ✅ Reply to reviews (admin response)
- ✅ View review analytics: avg rating, total reviews, rating distribution

**Files**:
- `app/(admin)/admin/reviews/page.tsx`
- `components/admin/ReviewModerationTable.tsx`
- `components/admin/ReviewDetailModal.tsx`
- `lib/api/reviews.ts` (admin functions)

---

### TVLCVR-83: Analytics Dashboard with Charts
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Visual analytics dashboard with key metrics and charts.

**Metrics**:
- Total leads (today, this week, this month, all time)
- Leads by status (pie chart)
- Leads by package (bar chart)
- Leads trend over time (line chart)
- Top 5 popular packages (by leads)
- Conversion rate (leads → converted)
- Average response time to leads
- Reviews: total, avg rating, breakdown by stars

**Libraries**: Use `recharts` for charts

**Files**:
- `app/(admin)/admin/analytics/page.tsx`
- `components/admin/AnalyticsDashboard.tsx`
- `components/admin/charts/LeadsTrendChart.tsx`
- `components/admin/charts/LeadsByStatusChart.tsx`
- `lib/api/analytics.ts`

---

### TVLCVR-84: Admin Settings & Configuration
**Type**: Task | **Priority**: Medium | **Time**: 5 hours

**Description**: Admin settings panel for site-wide configuration.

**Settings**:
- ✅ Site title, tagline, description
- ✅ Contact info: email, phone, WhatsApp, address
- ✅ Social media links: Facebook, Instagram, Twitter, YouTube
- ✅ Business hours
- ✅ Show/hide pricing globally
- ✅ Default email templates
- ✅ Homepage section visibility toggles
- ✅ Max images per package
- ✅ Lead notification email addresses (comma-separated)

**Storage**: Store in `site_settings` table

**Files**:
- `app/(admin)/admin/settings/page.tsx`
- `components/admin/SiteSettingsForm.tsx`
- `supabase/migrations/*_site_settings.sql`
- `lib/api/settings.ts`

---

## Sprint 4: Customer Experience & SEO (50 hours)

### TVLCVR-85: Complete Package Detail Page
**Type**: Story | **Priority**: Critical | **Time**: 10 hours

**Description**: Polish package detail page with all sections, gallery, inquiry form.

**Sections**:
- ✅ Hero with image gallery (lightbox on click)
- ✅ Package overview (duration, destination, category badges)
- ✅ Pricing display (if enabled)
- ✅ Day-by-day itinerary with images
- ✅ Inclusions & exclusions lists
- ✅ Stay details (hotels with images)
- ✅ Travel tips accordion
- ✅ Best time to visit
- ✅ Places to visit nearby
- ✅ Customer reviews section
- ✅ "Inquire Now" sticky footer button
- ✅ Social share buttons
- ✅ Breadcrumbs

**Files**:
- `app/(customer)/packages/[slug]/page.tsx` (enhance existing)
- `components/customer/PackageGallery.tsx`
- `components/customer/ItineraryTimeline.tsx`
- `components/customer/InquiryForm.tsx`

---

### TVLCVR-86: Package Listing with Filters & Search
**Type**: Story | **Priority**: Critical | **Time**: 10 hours

**Description**: Package listing page with advanced filters, search, and sorting.

**Acceptance Criteria**:
- ✅ Route: `/packages`
- ✅ Grid view of package cards
- ✅ Filters sidebar:
  - Price range slider
  - Duration (1-3 days, 4-7 days, 8+ days)
  - Categories (checkboxes)
  - Destination (dropdown)
  - Featured packages only toggle
- ✅ Search bar (searches title, description, destination)
- ✅ Sort dropdown: Featured, Newest, Price: Low to High, Price: High to Low, Most Popular
- ✅ Applied filters show as removable chips
- ✅ "Clear all" filters button
- ✅ Results count: "Showing 12 of 45 packages"
- ✅ Pagination or infinite scroll
- ✅ Empty state if no results

**Files**:
- `app/(customer)/packages/page.tsx`
- `components/customer/PackageFilters.tsx`
- `components/customer/PackageGrid.tsx`
- `components/customer/PackageCard.tsx`

---

### TVLCVR-87: Category & Destination Landing Pages
**Type**: Story | **Priority**: High | **Time**: 8 hours

**Description**: SEO-optimized landing pages for categories and destinations.

**Routes**:
- `/categories/[slug]` - Show packages in category
- `/destinations/[destination]` - Show packages for destination

**Acceptance Criteria**:
- ✅ Hero section with category/destination image
- ✅ Description text
- ✅ Package grid filtered by category/destination
- ✅ Breadcrumbs
- ✅ SEO metadata (title, description, OG image)
- ✅ Added to sitemap
- ✅ JSON-LD structured data

**Files**:
- `app/(customer)/categories/[slug]/page.tsx`
- `app/(customer)/destinations/[destination]/page.tsx`

---

### TVLCVR-88: Global Search Implementation
**Type**: Story | **Priority**: High | **Time**: 6 hours

**Description**: Global search accessible from navbar, searches packages/categories/destinations.

**Acceptance Criteria**:
- ✅ Search icon in navbar
- ✅ Click opens search modal
- ✅ Search input with debounce (300ms)
- ✅ Search across: package titles, descriptions, destinations, categories
- ✅ Results grouped by type (Packages, Categories, Destinations)
- ✅ Click result → navigate to page
- ✅ Empty state: "No results found"
- ✅ Recent searches (saved in localStorage)
- ✅ ESC to close modal
- ✅ Keyboard navigation (↑/↓ arrows)

**Files**:
- `components/customer/SearchModal.tsx`
- `lib/api/search.ts`
- `lib/hooks/useDebounce.ts`

---

### TVLCVR-89: Blog/Content Section
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Blog for travel tips, guides, and SEO content.

**Acceptance Criteria**:
- ✅ Route: `/blog`
- ✅ Blog listing page with cards
- ✅ Individual blog post pages `/blog/[slug]`
- ✅ Admin CRUD for blog posts
- ✅ Rich text editor (Tiptap)
- ✅ Featured image per post
- ✅ Categories/tags for posts
- ✅ Related posts section
- ✅ SEO metadata
- ✅ Share buttons

**Schema**:
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author VARCHAR(255) DEFAULT 'Travel Carvers Team',
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Files**:
- `app/(customer)/blog/page.tsx`
- `app/(customer)/blog/[slug]/page.tsx`
- `app/(admin)/admin/blog/page.tsx`
- `components/admin/BlogEditor.tsx`

---

### TVLCVR-90: FAQ Section
**Type**: Task | **Priority**: Medium | **Time**: 3 hours

**Description**: FAQ page with accordion UI and admin management.

**Acceptance Criteria**:
- ✅ Route: `/faq`
- ✅ Accordion UI (expand/collapse)
- ✅ Categories: General, Packages, Bookings, Payments (even though no payments, users may ask)
- ✅ Admin can add/edit/delete FAQs
- ✅ Reorder FAQs
- ✅ FAQ schema markup for SEO

**Files**:
- `app/(customer)/faq/page.tsx`
- `components/customer/FaqAccordion.tsx`
- `app/(admin)/admin/faq/page.tsx`
- `supabase/migrations/*_faqs.sql`

---

### TVLCVR-91: Complete Homepage Sections
**Type**: Story | **Priority**: High | **Time**: 5 hours

**Description**: Add missing homepage sections for better UX.

**Sections to Add**:
- ✅ Trust badges (10+ Years, 500+ Packages, 24/7 Support, etc.)
- ✅ Featured destinations (4-6 cards with images)
- ✅ Why Choose Us section (3-4 points with icons)
- ✅ Newsletter subscription (already in footer, ensure it works)
- ✅ CTA section ("Plan Your Dream Vacation")

**Files**:
- `app/(customer)/page.tsx` (enhance existing homepage)
- `components/customer/TrustBadges.tsx`
- `components/customer/FeaturedDestinations.tsx`
- `components/customer/WhyChooseUs.tsx`

---

## Sprint 5: Production Polish & Performance (55 hours)

### TVLCVR-92: Image Optimization & CDN
**Type**: Task | **Priority**: High | **Time**: 6 hours

**Description**: Optimize all images for fast loading and good UX.

**Acceptance Criteria**:
- ✅ All images use Next.js `<Image>` component
- ✅ Lazy loading enabled
- ✅ WebP/AVIF format support
- ✅ Responsive images (srcset)
- ✅ Blur placeholder for better perceived performance
- ✅ Supabase Storage CDN enabled
- ✅ Image compression on upload (sharp library)
- ✅ Max upload size: 5MB
- ✅ Recommended dimensions guide in admin panel

**Files**:
- Update all components using `<img>` to `<Image>`
- `lib/supabase/imageOptimizer.ts`
- `components/admin/ImageUploader.tsx` (add compression)

---

### TVLCVR-93: SEO Enhancement - Metadata & Structured Data
**Type**: Task | **Priority**: Critical | **Time**: 6 hours

**Description**: Complete SEO implementation with metadata and JSON-LD.

**Acceptance Criteria**:
- ✅ Every page has unique title, description, OG image
- ✅ JSON-LD structured data on all key pages:
  - Organization (company info)
  - LocalBusiness (travel agency)
  - Product (packages)
  - AggregateRating (reviews)
  - BreadcrumbList (navigation)
- ✅ Dynamic sitemap includes: packages, categories, destinations, blog posts
- ✅ robots.txt configured (allow all except /admin)
- ✅ Canonical URLs on all pages
- ✅ Validate with Google Rich Results Test

**Files**:
- `lib/seo/schemas.ts` (enhance existing)
- `app/sitemap.ts` (enhance existing)
- `public/robots.txt`

---

### TVLCVR-94: Performance Optimization
**Type**: Task | **Priority**: High | **Time**: 8 hours

**Description**: Optimize app performance for Lighthouse 90+ scores.

**Optimizations**:
- ✅ Code splitting (dynamic imports)
- ✅ Tree shaking unused code
- ✅ Lazy load components below fold
- ✅ Preload critical assets
- ✅ Minimize JavaScript bundle
- ✅ Remove unused CSS
- ✅ Optimize fonts (use next/font)
- ✅ Enable Gzip/Brotli compression
- ✅ Database query optimization (add indexes)
- ✅ React Query caching strategies

**Lighthouse Targets**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Files**: Various optimizations across codebase

---

### TVLCVR-95: Database Indexing & Query Optimization
**Type**: Task | **Priority**: High | **Time**: 4 hours

**Description**: Add database indexes for faster queries.

**Indexes**:
```sql
-- Packages
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_destination ON packages(destination_name);
CREATE INDEX idx_packages_featured ON packages(is_featured) WHERE is_featured = true;

-- Reviews
CREATE INDEX idx_reviews_package ON reviews(package_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved, rating);

-- Leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Categories
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Full-text search
CREATE INDEX idx_packages_search ON packages USING GIN(to_tsvector('english', title || ' ' || COALESCE(short_description, '')));
```

**Files**: `supabase/migrations/*_add_performance_indexes.sql`

---

### TVLCVR-96: Error Tracking & Monitoring (Sentry)
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: Integrate Sentry for error tracking and performance monitoring.

**Acceptance Criteria**:
- ✅ Sentry SDK installed
- ✅ Captures client-side errors
- ✅ Captures server-side errors
- ✅ Source maps uploaded
- ✅ Performance monitoring enabled
- ✅ User context attached to errors
- ✅ Alert admins on critical errors
- ✅ Error boundary component

**Files**:
- Install `@sentry/nextjs`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `components/ErrorBoundary.tsx`

---

### TVLCVR-97: Comprehensive Logging
**Type**: Task | **Priority**: Medium | **Time**: 5 hours

**Description**: Structured logging for debugging production issues.

**Log Events**:
- API requests (method, path, duration, status)
- Lead submissions
- Email send events (success/failure)
- Admin actions (package created, lead status changed)
- Authentication events (login, logout)
- Database query errors

**Library**: Use `pino` for structured JSON logs

**Files**:
- `lib/logger/index.ts`
- `lib/middleware/requestLogger.ts`

---

### TVLCVR-98: Security Hardening
**Type**: Task | **Priority**: Critical | **Time**: 5 hours

**Description**: Security best practices and headers.

**Security Measures**:
- ✅ Security headers (CSP, X-Frame-Options, HSTS, etc.)
- ✅ Rate limiting on API routes (prevent DDoS)
- ✅ Input validation on all forms (Zod)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (escape user input)
- ✅ CSRF protection
- ✅ Secure cookies (HTTP-only, Secure, SameSite)
- ✅ Environment variables secured
- ✅ Admin panel IP whitelist (optional)

**Files**:
- `next.config.js` (security headers)
- `lib/middleware/rateLimiter.ts`
- `middleware.ts` (rate limiting)

---

### TVLCVR-99: Automated Testing
**Type**: Task | **Priority**: High | **Time**: 10 hours

**Description**: Comprehensive test suite.

**Test Types**:
- ✅ Unit tests: Utilities, helpers (Jest)
- ✅ Integration tests: API routes (Supertest)
- ✅ E2E tests: Critical flows (Playwright)
  - Submit a lead
  - Search packages
  - Admin login and create package
- ✅ Component tests (React Testing Library)

**Coverage Target**: 60%+

**Files**:
- Install Jest, Playwright, React Testing Library
- `__tests__/` directory
- `playwright.config.ts`
- `.github/workflows/test.yml` (CI)

---

### TVLCVR-100: Production Deployment Checklist
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: Complete deployment preparation and documentation.

**Checklist**:
- ✅ Environment variables documented
- ✅ Supabase production project setup
- ✅ Database migrations run in production
- ✅ Admin user created in production
- ✅ Mailgun domain verified and sending
- ✅ Custom domain configured
- ✅ SSL certificate active
- ✅ Vercel deployment configured
- ✅ Analytics (GA4) installed
- ✅ Site performance tested (Lighthouse)
- ✅ Cross-browser testing (Chrome, Safari, Firefox)
- ✅ Mobile responsiveness verified
- ✅ Backup strategy in place

**Files**:
- `docs/DEPLOYMENT_GUIDE.md`
- `.env.production.example`
- `DEPLOYMENT_CHECKLIST.md`

---

## Sprint 6: Marketing & Analytics (40 hours)

### TVLCVR-101: Google Analytics 4 & Tag Manager
**Type**: Task | **Priority**: High | **Time**: 4 hours

**Description**: Integrate GA4 and GTM for tracking.

**Events**:
- Page views
- Package views
- Lead submissions
- Search queries
- Filter usage
- Button clicks (Call, WhatsApp, Email)
- Newsletter signups

**Files**:
- `lib/analytics/gtag.ts`
- `app/layout.tsx` (add GTM script)

---

### TVLCVR-102: Facebook Pixel & Meta Ads
**Type**: Task | **Priority**: Medium | **Time**: 3 hours

**Description**: Install Facebook Pixel for retargeting.

**Events**:
- ViewContent (package view)
- Lead (inquiry submitted)
- Search
- ViewCategory

**Files**:
- `lib/analytics/fbPixel.ts`

---

### TVLCVR-103: WhatsApp Business Integration
**Type**: Task | **Priority**: High | **Time**: 3 hours

**Description**: WhatsApp floating button and click-to-chat.

**Acceptance Criteria**:
- ✅ Floating WhatsApp button (bottom right)
- ✅ Pre-filled message: "Hi, I'm interested in [Package Name]"
- ✅ Click-to-chat on package pages
- ✅ WhatsApp icon in contact section
- ✅ Mobile-optimized

**Files**:
- `components/customer/WhatsAppButton.tsx`

---

### TVLCVR-104: Email Marketing Integration (Mailchimp)
**Type**: Task | **Priority**: Medium | **Time**: 4 hours

**Description**: Sync newsletter subscribers and leads to Mailchimp.

**Acceptance Criteria**:
- ✅ Newsletter subscribers → Mailchimp list
- ✅ Leads → Separate Mailchimp list
- ✅ Tag leads by package interest
- ✅ Automated welcome email
- ✅ API integration for real-time sync

**Files**:
- Install `@mailchimp/mailchimp_marketing`
- `lib/marketing/mailchimp.ts`

---

### TVLCVR-105: Live Chat Widget (Tawk.to)
**Type**: Task | **Priority**: Medium | **Time**: 2 hours

**Description**: Add live chat for instant customer support.

**Options**: Tawk.to (free), Crisp, or Intercom

**Acceptance Criteria**:
- ✅ Chat widget on all pages
- ✅ Offline message form
- ✅ Mobile-friendly
- ✅ Pass context (current page, package)

**Files**:
- `components/LiveChat.tsx`

---

### TVLCVR-106: Newsletter Backend with Double Opt-in
**Type**: Story | **Priority**: High | **Time**: 6 hours

**Description**: Complete newsletter functionality with confirmation email.

**Acceptance Criteria**:
- ✅ Save email to `newsletter_subscribers` table
- ✅ Send confirmation email via Mailgun
- ✅ Unique confirmation token (UUID)
- ✅ Verify endpoint: `/api/newsletter/verify?token=...`
- ✅ Prevent duplicate subscriptions
- ✅ Admin view: subscriber list
- ✅ Export subscribers as CSV
- ✅ Unsubscribe link in emails

**Files**:
- `app/api/newsletter/subscribe/route.ts`
- `app/api/newsletter/verify/route.ts`
- `supabase/migrations/*_newsletter.sql`
- `lib/email/templates/newsletterConfirmation.ts`

---

### TVLCVR-107: Social Media Share Buttons
**Type**: Task | **Priority**: Low | **Time**: 2 hours

**Description**: Share buttons on package pages.

**Platforms**: WhatsApp, Facebook, Twitter/X, Email, Copy Link

**Acceptance Criteria**:
- ✅ Pre-filled share text with package title + URL
- ✅ Mobile-optimized
- ✅ Analytics tracking on share clicks

**Files**:
- `components/customer/ShareButtons.tsx`

---

### TVLCVR-108: Testimonials Management
**Type**: Task | **Priority**: Medium | **Time**: 4 hours

**Description**: Admin can add/manage testimonials displayed on homepage.

**Acceptance Criteria**:
- ✅ Admin CRUD for testimonials
- ✅ Upload customer photo
- ✅ Customer name, role, review text, rating
- ✅ Feature/unfeature toggle
- ✅ Display order
- ✅ Homepage auto-scrolling carousel

**Schema**:
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_role VARCHAR(255),
  review_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Files**:
- `app/(admin)/admin/testimonials/page.tsx`
- `supabase/migrations/*_testimonials.sql`
- Enhance `components/customer/TestimonialsCarousel.tsx`

---

### TVLCVR-109: Contact Page Backend Integration
**Type**: Task | **Priority**: High | **Time**: 2 hours

**Description**: Ensure contact form is properly integrated (already done, verify).

**Verification**:
- ✅ Contact form saves to `leads` table
- ✅ Admin receives email notification
- ✅ Customer receives confirmation email
- ✅ Form validation works
- ✅ Success message displayed

**Status**: Already completed (TVLCVR-43), just verify it works end-to-end.

---

### TVLCVR-110: GDPR Compliance & Cookie Consent
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: GDPR compliance features.

**Acceptance Criteria**:
- ✅ Cookie consent banner
- ✅ Cookie policy page
- ✅ Privacy policy page (already exists, enhance)
- ✅ Data export: user can request their data
- ✅ Data deletion: user can request deletion
- ✅ Respect "Do Not Track" for analytics

**Files**:
- `components/CookieConsent.tsx`
- `app/(customer)/cookie-policy/page.tsx`
- `app/(customer)/privacy/page.tsx` (enhance existing)

---

## Sprint 7: Final Polish & Launch (40 hours)

### TVLCVR-111: Mobile App (PWA)
**Type**: Story | **Priority**: Medium | **Time**: 6 hours

**Description**: Convert to Progressive Web App.

**Acceptance Criteria**:
- ✅ Installable on mobile devices
- ✅ Offline fallback page
- ✅ Service worker for caching
- ✅ App manifest with icons
- ✅ "Add to Home Screen" prompt
- ✅ App icon and splash screen

**Files**:
- `public/manifest.json`
- `public/sw.js`
- `public/icons/` (PWA icons)

---

### TVLCVR-112: Multi-Language Support (Optional)
**Type**: Story | **Priority**: Low | **Time**: 10 hours

**Description**: Add Hindi language support (or other language).

**Acceptance Criteria**:
- ✅ Language selector in navbar
- ✅ Static content translated
- ✅ URL structure: `/en/packages`, `/hi/packages`
- ✅ Store language preference
- ✅ Admin can add translations for packages

**Library**: Use `next-intl`

**Files**: Throughout app (large effort)

---

### TVLCVR-113: Load Testing
**Type**: Task | **Priority**: Medium | **Time**: 4 hours

**Description**: Load test to ensure app handles traffic.

**Scenarios**:
- 100 concurrent users browsing
- 50 concurrent lead submissions
- 500 requests/second to API

**Tool**: Use k6 or Artillery

**Acceptance Criteria**:
- ✅ No errors under normal load
- ✅ Response time <500ms for 95th percentile
- ✅ Identify bottlenecks
- ✅ Document server requirements

**Files**: `tests/load/scenarios.js`

---

### TVLCVR-114: Accessibility (A11y) Audit
**Type**: Task | **Priority**: High | **Time**: 6 hours

**Description**: WCAG 2.1 Level AA compliance.

**Acceptance Criteria**:
- ✅ All images have alt text
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Color contrast ≥ 4.5:1
- ✅ ARIA labels on icons
- ✅ Form inputs have labels
- ✅ Screen reader friendly

**Tool**: Use `axe-core`

**Files**: Updates across components

---

### TVLCVR-115: Admin User Management (Optional)
**Type**: Story | **Priority**: Low | **Time**: 6 hours

**Description**: Multiple admin users with role-based access.

**Roles**:
- Super Admin: Full access
- Content Editor: Manage packages, blog only
- Support: View leads only

**Acceptance Criteria**:
- ✅ Admin users table with roles
- ✅ Role-based permissions
- ✅ Invite new admins via email
- ✅ Admin can't delete themselves

**Files**:
- `supabase/migrations/*_admin_roles.sql`
- `lib/auth/checkAdminRole.ts`

---

### TVLCVR-116: Backup & Restore Documentation
**Type**: Task | **Priority**: Critical | **Time**: 3 hours

**Description**: Document backup and restoration procedures.

**Documentation**:
- ✅ Database backup process
- ✅ Automated daily backups (Supabase)
- ✅ Manual backup scripts
- ✅ Restore procedure
- ✅ Disaster recovery plan

**Files**:
- `docs/BACKUP_RESTORE.md`
- `scripts/backup-database.sh`
- `scripts/restore-database.sh`

---

### TVLCVR-117: Final QA & Bug Fixes
**Type**: Task | **Priority**: Critical | **Time**: 8 hours

**Description**: Comprehensive testing and bug fixing.

**Testing Checklist**:
- ✅ All pages load without errors
- ✅ All forms submit correctly
- ✅ All emails send correctly
- ✅ Admin panel fully functional
- ✅ Search works
- ✅ Filters work
- ✅ Images load properly
- ✅ Mobile responsiveness
- ✅ Cross-browser testing
- ✅ Performance (Lighthouse)
- ✅ SEO validation
- ✅ Security headers

---

### TVLCVR-118: Launch Day Preparation
**Type**: Task | **Priority**: Critical | **Time**: 5 hours

**Description**: Final pre-launch checklist and go-live.

**Pre-Launch**:
- ✅ Backup database
- ✅ Verify DNS and SSL
- ✅ Test production environment
- ✅ Train admin users
- ✅ Prepare launch announcement
- ✅ Monitor error logs
- ✅ Have rollback plan ready

**Go-Live**:
- ✅ Deploy to production
- ✅ Smoke test all critical features
- ✅ Monitor performance and errors
- ✅ Announce launch on social media
- ✅ Submit to Google Search Console

---

## Summary

**Total New Tickets**: 42 tickets (TVLCVR-78 to TVLCVR-118, excluding TVLCVR-77)  
**Total Estimated Time**: ~240 hours (6 weeks with 2 developers)

**Sprint Breakdown**:
- Sprint 3: Core Missing Features (45h)
- Sprint 4: Customer Experience & SEO (50h)
- Sprint 5: Production Polish & Performance (55h)
- Sprint 6: Marketing & Analytics (40h)
- Sprint 7: Final Polish & Launch (50h)

**Key Points**:
- ✅ NO payment integration (lead generation only)
- ✅ Focus on content management and lead collection
- ✅ Heavy emphasis on SEO and user experience
- ✅ Admin tools for efficient content curation
- ✅ Marketing integrations for lead nurturing
