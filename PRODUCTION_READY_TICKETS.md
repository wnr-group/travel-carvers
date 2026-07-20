# Complete Production-Ready Application Tickets

**Goal**: 100% production-ready travel booking platform  
**Total Sprints**: 6 sprints (12 weeks with 2 developers)  
**Total Estimated Time**: ~320 hours

---

## Sprint 3: Payment Integration & Booking Flow (60 hours)

### TVLCVR-77: Integrate Razorpay Payment Gateway
**Type**: Story | **Priority**: Critical | **Time**: 12 hours

**Description**: Integrate Razorpay for accepting payments in INR with support for cards, UPI, wallets, and net banking.

**Business Value**: Cannot launch without payment processing. Razorpay is the leading payment gateway in India with 99.9% uptime.

**Acceptance Criteria**:
- Razorpay SDK integrated
- Payment page shows package details + price breakdown
- Supports: Credit/Debit cards, UPI, Net Banking, Wallets
- Payment success → creates booking record
- Payment failure → shows error + retry option
- Webhook endpoint for payment verification
- Test mode & production mode toggle
- Payment receipt sent via email

**Technical Details**:
- Install `razorpay` npm package
- Create payment API: `app/api/payments/create-order/route.ts`
- Webhook: `app/api/payments/webhook/route.ts`
- Component: `components/customer/PaymentGateway.tsx`
- Store Razorpay order_id, payment_id in bookings table
- Migration: Add payment columns to bookings table

---

### TVLCVR-78: Create Booking Confirmation Flow
**Type**: Story | **Priority**: Critical | **Time**: 10 hours

**Description**: Complete booking flow from package selection → traveler details → payment → confirmation.

**Business Value**: Core revenue feature. Users must be able to complete bookings end-to-end.

**Acceptance Criteria**:
- Multi-step booking form:
  1. Package summary + travel dates
  2. Traveler details (name, age, passport for international)
  3. Contact details (email, phone)
  4. Payment
  5. Confirmation page
- Form validation on each step
- Progress indicator (1/5, 2/5, etc.)
- Back button to edit previous steps
- Save booking data to database
- Generate unique booking reference (e.g., TC-2026-00001)
- Confirmation email with booking details
- Redirect to /bookings/[booking-id] after success

**Files**: 
- `app/(customer)/packages/[slug]/book/page.tsx`
- `components/customer/BookingForm.tsx`
- `lib/api/bookings.ts`
- `supabase/migrations/*_bookings.sql`

---

### TVLCVR-79: Create Bookings Database Schema
**Type**: Task | **Priority**: Critical | **Time**: 3 hours | **Depends**: TVLCVR-78

**Description**: Create comprehensive bookings table with all necessary fields for storing customer bookings.

**Schema**:
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  package_id UUID REFERENCES packages(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  number_of_adults INT DEFAULT 1,
  number_of_children INT DEFAULT 0,
  number_of_infants INT DEFAULT 0,
  travel_start_date DATE NOT NULL,
  travel_end_date DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20),
  passport_number VARCHAR(50),
  traveler_type VARCHAR(20) DEFAULT 'adult'
);
```

**Files**: `supabase/migrations/*_bookings_schema.sql`

---

### TVLCVR-80: Build Customer Booking Dashboard
**Type**: Story | **Priority**: High | **Time**: 8 hours

**Description**: Create customer-facing booking dashboard where users can view their booking history and details.

**Acceptance Criteria**:
- Route: `/my-bookings`
- Shows all bookings for logged-in user (filter by email)
- Booking cards show: reference, package, dates, status, amount
- Click card → booking detail page
- Detail page shows: full itinerary, traveler details, payment receipt
- Download booking confirmation as PDF
- Cancel booking button (if cancellation allowed)
- Filter by status: All, Upcoming, Completed, Cancelled

**Files**:
- `app/(customer)/my-bookings/page.tsx`
- `app/(customer)/my-bookings/[id]/page.tsx`
- `components/customer/BookingCard.tsx`
- `lib/api/public/bookings.ts`

---

### TVLCVR-81: Admin Booking Management Panel
**Type**: Story | **Priority**: High | **Time**: 10 hours

**Description**: Admin panel to view, manage, and update all bookings with filters and search.

**Acceptance Criteria**:
- Route: `/admin/bookings`
- Table view with columns: Ref, Customer, Package, Dates, Status, Amount, Actions
- Search by: booking reference, customer name, email, phone
- Filters: Status (All, Pending, Confirmed, Completed, Cancelled), Date range, Payment status
- Click row → booking detail modal
- Actions: Confirm booking, Cancel booking, Send email, Download PDF
- Pagination (25 per page)
- Export bookings as CSV
- Real-time stats: Today's bookings, This month's revenue, Pending confirmations

**Files**:
- `app/(admin)/admin/bookings/page.tsx`
- `components/admin/BookingTable.tsx`
- `components/admin/BookingDetailModal.tsx`
- `lib/api/bookings.ts` (admin functions)

---

### TVLCVR-82: Email Notifications for Bookings
**Type**: Task | **Priority**: Critical | **Time**: 6 hours

**Description**: Send automated emails at key booking lifecycle events via Mailgun.

**Emails to Create**:
1. **Booking Confirmation** (to customer): Booking reference, package details, payment receipt, next steps
2. **Booking Received** (to admin): New booking alert with customer details
3. **Payment Success** (to customer): Payment confirmation with invoice
4. **Payment Failed** (to customer): Retry payment link
5. **Booking Cancelled** (to customer): Cancellation confirmation + refund status

**Files**:
- `lib/email/templates/bookingConfirmation.ts`
- `lib/email/templates/paymentSuccess.ts`
- `lib/email/templates/paymentFailed.ts`
- `lib/email/templates/bookingCancelled.ts`
- `lib/email/sendBookingEmail.ts`

---

### TVLCVR-83: Booking Invoice PDF Generation
**Type**: Task | **Priority**: Medium | **Time**: 6 hours

**Description**: Generate PDF invoices for bookings using a library like `jsPDF` or `react-pdf`.

**Acceptance Criteria**:
- PDF includes: Company logo, booking reference, customer details, package details, price breakdown, payment details, T&C
- Download button on booking detail page
- Attach PDF to booking confirmation email
- Professional invoice template matching brand
- GST details included

**Files**:
- `lib/pdf/generateInvoice.ts`
- `components/customer/DownloadInvoice.tsx`

---

### TVLCVR-84: Dynamic Pricing & Availability Calendar
**Type**: Story | **Priority**: High | **Time**: 8 hours

**Description**: Add date-based pricing and availability tracking to prevent overbooking.

**Acceptance Criteria**:
- Admin can set price multipliers for date ranges (e.g., peak season +30%)
- Admin can set max bookings per date
- Customer booking page shows calendar with available dates
- Unavailable dates are greyed out
- Price updates based on selected dates
- Show "Only 3 spots left!" messaging
- Block dates that are fully booked

**Schema**:
```sql
CREATE TABLE package_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id),
  date DATE NOT NULL,
  max_bookings INT DEFAULT 10,
  current_bookings INT DEFAULT 0,
  price_multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_available BOOLEAN DEFAULT TRUE
);
```

**Files**:
- `supabase/migrations/*_package_availability.sql`
- `components/customer/AvailabilityCalendar.tsx`
- `lib/api/availability.ts`
- Admin UI: `app/(admin)/admin/packages/[id]/availability/page.tsx`

---

## Sprint 4: Advanced Search, Filters & User Auth (55 hours)

### TVLCVR-85: Implement User Authentication with Supabase Auth
**Type**: Story | **Priority**: High | **Time**: 12 hours

**Description**: Complete user authentication system for customers to create accounts, login, and manage bookings.

**Acceptance Criteria**:
- Sign up page with email/password
- Login page with email/password
- Google OAuth integration
- Email verification flow
- Password reset flow
- Protected routes (my-bookings requires auth)
- User profile page (/profile)
- Edit profile: name, phone, email, password
- Logout functionality
- Session persistence

**Files**:
- `app/(customer)/auth/login/page.tsx`
- `app/(customer)/auth/signup/page.tsx`
- `app/(customer)/auth/forgot-password/page.tsx`
- `app/(customer)/profile/page.tsx`
- `lib/auth/supabase-auth.ts`
- `middleware.ts` (protect routes)

---

### TVLCVR-86: Advanced Package Search with Elasticsearch/Algolia
**Type**: Story | **Priority**: Medium | **Time**: 10 hours

**Description**: Upgrade basic search to advanced search with typo tolerance, synonyms, and instant results.

**Business Value**: Better search = higher conversions. Users find what they want faster.

**Acceptance Criteria**:
- Full-text search across package title, description, destination, category
- Typo tolerance ("Bali" finds "Bali" even if user types "Balli")
- Search suggestions as user types
- Highlighting of matched terms in results
- Search by tags/keywords
- Filter search results
- Search analytics: track popular searches

**Options**:
- Option A: Implement using Supabase full-text search (simple, free)
- Option B: Integrate Algolia (best UX, paid)
- Option C: Integrate Meilisearch (self-hosted, free)

**Files**:
- `lib/search/searchEngine.ts`
- `components/customer/AdvancedSearch.tsx`
- `app/api/search/route.ts`

---

### TVLCVR-87: Saved/Favorite Packages (Wishlist)
**Type**: Story | **Priority**: Medium | **Time**: 6 hours

**Description**: Allow logged-in users to save packages to their wishlist for later viewing.

**Acceptance Criteria**:
- Heart icon on package cards
- Click heart → save to wishlist (auth required)
- /my-wishlist page shows saved packages
- Remove from wishlist button
- Wishlist count badge in navbar
- Email reminder: "You have packages in your wishlist!"

**Schema**:
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  package_id UUID REFERENCES packages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, package_id)
);
```

**Files**:
- `supabase/migrations/*_wishlists.sql`
- `app/(customer)/my-wishlist/page.tsx`
- `components/customer/WishlistButton.tsx`
- `lib/api/wishlist.ts`

---

### TVLCVR-88: Package Comparison Tool
**Type**: Story | **Priority**: Low | **Time**: 8 hours

**Description**: Allow users to compare up to 3 packages side-by-side.

**Acceptance Criteria**:
- "Compare" checkbox on package cards
- Select up to 3 packages
- "Compare" button opens comparison modal
- Side-by-side comparison table showing:
  - Price, duration, inclusions, exclusions, ratings, highlights
- Clear comparison and add different packages
- Works on desktop (not mobile)

**Files**:
- `components/customer/ComparisonTool.tsx`
- `components/customer/CompareButton.tsx`
- Uses localStorage to track selected packages

---

### TVLCVR-89: Multi-Currency Support
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Support multiple currencies (INR, USD, EUR, GBP) with real-time conversion.

**Acceptance Criteria**:
- Currency selector in navbar
- Prices displayed in selected currency
- Real-time exchange rates (use API like fixer.io or exchangerate-api.com)
- Default currency: INR
- Currency preference saved in localStorage
- Admin sets base prices in INR
- Razorpay processes in INR (convert at checkout)

**Files**:
- `lib/currency/converter.ts`
- `components/customer/CurrencySelector.tsx`
- `lib/hooks/useCurrency.tsx`

---

### TVLCVR-90: Advanced Admin Analytics Dashboard
**Type**: Story | **Priority**: High | **Time**: 12 hours

**Description**: Comprehensive analytics dashboard for admin with charts, metrics, and insights.

**Metrics to Display**:
- Total revenue (today, week, month, year)
- Total bookings (today, week, month, year)
- Conversion rate (leads → bookings)
- Top performing packages
- Revenue by category
- Revenue by destination
- Booking trends (line chart)
- Lead source breakdown
- Average booking value
- Customer demographics (if available)

**Charts**:
- Revenue line chart (last 30 days)
- Bookings bar chart by package
- Pie chart: revenue by category
- Pie chart: lead sources

**Libraries**: Use `recharts` or `chart.js`

**Files**:
- `app/(admin)/admin/analytics/page.tsx`
- `components/admin/AnalyticsCharts.tsx`
- `lib/api/analytics.ts`

---

## Sprint 5: Production Optimization & Performance (50 hours)

### TVLCVR-91: Image Optimization Pipeline
**Type**: Task | **Priority**: High | **Time**: 6 hours

**Description**: Optimize all images for web delivery with Next.js Image component and Supabase Storage transforms.

**Acceptance Criteria**:
- All images use Next.js `<Image>` component
- Lazy loading enabled
- WebP/AVIF format support
- Responsive images (srcset)
- Blur placeholder for better UX
- Supabase Storage image transformations enabled
- CDN caching headers configured
- Image compression quality: 85%
- Max image size: 2000x2000px

**Files**: 
- Update all components using `<img>` to `<Image>`
- `next.config.js`: Add image domains
- `lib/supabase/imageOptimizer.ts`

---

### TVLCVR-92: Implement Redis Caching Layer
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Add Redis caching to reduce database load and improve response times.

**Cache Targets**:
- Published packages (cache: 10 minutes)
- Categories (cache: 1 hour)
- Featured packages (cache: 30 minutes)
- Package details (cache: 10 minutes)
- Reviews (cache: 5 minutes)

**Acceptance Criteria**:
- Redis instance setup (Upstash or self-hosted)
- Cache middleware for API routes
- Cache invalidation on admin updates
- Cache hit/miss metrics
- Fallback to database if Redis unavailable

**Files**:
- Install `ioredis` package
- `lib/cache/redis.ts`
- `lib/cache/cacheMiddleware.ts`
- Update API routes with caching

---

### TVLCVR-93: Database Indexing & Query Optimization
**Type**: Task | **Priority**: High | **Time**: 4 hours

**Description**: Add database indexes to improve query performance on large datasets.

**Indexes to Create**:
```sql
-- Packages
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_featured ON packages(is_featured) WHERE is_featured = true;
CREATE INDEX idx_packages_trending ON packages(is_trending) WHERE is_trending = true;
CREATE INDEX idx_packages_destination ON packages(destination_name);

-- Reviews
CREATE INDEX idx_reviews_package ON reviews(package_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Bookings
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer ON bookings(customer_email);
CREATE INDEX idx_bookings_dates ON bookings(travel_start_date, travel_end_date);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Full-text search
CREATE INDEX idx_packages_search ON packages USING GIN(to_tsvector('english', title || ' ' || COALESCE(short_description, '')));
```

**Files**: `supabase/migrations/*_add_indexes.sql`

---

### TVLCVR-94: API Rate Limiting
**Type**: Task | **Priority**: High | **Time**: 5 hours

**Description**: Implement rate limiting on API routes to prevent abuse and DDoS attacks.

**Acceptance Criteria**:
- Public API routes: 100 requests/minute per IP
- Auth required routes: 200 requests/minute per user
- Admin routes: 500 requests/minute
- Payment routes: 10 requests/minute per IP
- Rate limit headers in response
- 429 error page with retry info
- Whitelist admin IPs

**Implementation**: Use `@upstash/ratelimit` or `express-rate-limit`

**Files**:
- `lib/middleware/rateLimiter.ts`
- `middleware.ts` (apply rate limiting)

---

### TVLCVR-95: Error Tracking with Sentry
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: Integrate Sentry for real-time error monitoring and alerting.

**Acceptance Criteria**:
- Sentry SDK installed and configured
- Captures client-side errors
- Captures server-side errors
- Source maps uploaded for debugging
- Error alerts to admin email
- Performance monitoring enabled
- Custom error boundary component
- User context attached to errors

**Files**:
- Install `@sentry/nextjs`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `next.config.js` (Sentry webpack plugin)
- `components/ErrorBoundary.tsx`

---

### TVLCVR-96: Comprehensive Logging System
**Type**: Task | **Priority**: Medium | **Time**: 5 hours

**Description**: Implement structured logging for debugging and monitoring production issues.

**Log Categories**:
- API requests (method, path, duration, status)
- Database queries (query, duration)
- Payment events (order created, payment success/failure)
- Email events (sent, failed, bounced)
- Authentication events (login, signup, logout, failed attempts)
- Admin actions (package created, booking updated, etc.)

**Libraries**: Use `pino` or `winston`

**Files**:
- `lib/logger/index.ts`
- `lib/logger/apiLogger.ts`
- `lib/middleware/requestLogger.ts`
- Store logs in files or service like Logtail/Logflare

---

### TVLCVR-97: Automated Backups
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: Set up automated daily backups of database and Supabase Storage.

**Acceptance Criteria**:
- Daily database backups (PostgreSQL dump)
- Weekly full backups
- Backup retention: 30 days
- Backup stored in separate location (S3 or cloud storage)
- Automated backup verification
- Backup restoration documentation
- Alert if backup fails

**Files**:
- `scripts/backup-database.sh`
- `scripts/restore-database.sh`
- Setup cron job or GitHub Actions workflow

---

### TVLCVR-98: Security Headers & HTTPS
**Type**: Task | **Priority**: Critical | **Time**: 3 hours

**Description**: Configure security headers and enforce HTTPS for all traffic.

**Headers to Set**:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy
- Strict-Transport-Security (HSTS)

**Acceptance Criteria**:
- All requests redirect HTTP → HTTPS
- Security headers present on all responses
- Pass securityheaders.com scan
- Pass Mozilla Observatory scan (A+ rating)

**Files**:
- `next.config.js` (headers configuration)
- Vercel/deployment platform HTTPS settings

---

### TVLCVR-99: Lighthouse Performance Optimization
**Type**: Task | **Priority**: High | **Time**: 8 hours

**Description**: Optimize website to achieve Lighthouse scores of 90+ across all metrics.

**Targets**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Optimizations**:
- Code splitting
- Tree shaking unused code
- Lazy load components
- Preload critical assets
- Minimize JavaScript bundle size
- Remove unused CSS
- Optimize fonts (use next/font)
- Compress assets (Gzip/Brotli)

**Files**: Various optimizations across codebase

---

### TVLCVR-100: Accessibility (A11y) Improvements
**Type**: Task | **Priority**: High | **Time**: 6 hours

**Description**: Ensure website meets WCAG 2.1 Level AA standards for accessibility.

**Acceptance Criteria**:
- All images have alt text
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation works on all interactive elements
- Focus indicators visible
- Color contrast ratio ≥ 4.5:1 for text
- ARIA labels on icons and buttons
- Form inputs have associated labels
- Screen reader friendly
- Skip to content link

**Tools**: Use `axe-core` for automated testing

**Files**: Updates across all components

---

## Sprint 6: Production Deployment & Marketing (45 hours)

### TVLCVR-101: Production Deployment Setup
**Type**: Task | **Priority**: Critical | **Time**: 6 hours

**Description**: Configure production deployment on Vercel with custom domain and environment variables.

**Acceptance Criteria**:
- Deploy to Vercel production
- Custom domain configured (e.g., travelcarvers.com)
- SSL certificate active
- Environment variables configured
- Database migrations run on production
- Supabase production project linked
- Deployment webhook for auto-deploy on main branch merge
- Production environment smoke tests

**Files**: 
- `vercel.json` configuration
- `.env.production` template
- Production deployment checklist

---

### TVLCVR-102: Google Analytics & Tag Manager
**Type**: Task | **Priority**: High | **Time**: 4 hours

**Description**: Integrate Google Analytics 4 and Google Tag Manager for tracking user behavior.

**Events to Track**:
- Page views
- Package views
- Add to wishlist
- Search queries
- Filter usage
- Booking started
- Booking completed
- Payment success/failure
- Form submissions

**Acceptance Criteria**:
- GA4 property created
- GTM container configured
- Conversion goals set up
- E-commerce tracking enabled
- Custom events firing correctly
- Admin dashboard shows real-time analytics

**Files**:
- `lib/analytics/gtag.ts`
- `app/layout.tsx` (add GTM script)

---

### TVLCVR-103: SEO Schema Markup Enhancement
**Type**: Task | **Priority**: High | **Time**: 5 hours

**Description**: Add comprehensive JSON-LD schema markup for better search engine visibility.

**Schema Types**:
- Organization (company details)
- LocalBusiness (for travel agency)
- Product (for each package)
- Review/AggregateRating (package reviews)
- BreadcrumbList (navigation)
- FAQPage (if FAQ exists)
- VideoObject (for package videos)

**Acceptance Criteria**:
- Schema markup on all key pages
- Validate with Google Rich Results Test
- Validate with schema.org validator
- No schema errors

**Files**:
- `lib/seo/schemas.ts`
- Update `JsonLd` component usage

---

### TVLCVR-104: Create Blog/Content Section
**Type**: Story | **Priority**: Medium | **Time**: 10 hours

**Description**: Add blog section for travel guides, tips, and SEO content.

**Acceptance Criteria**:
- Route: `/blog`
- Blog listing page with search and categories
- Individual blog post pages `/blog/[slug]`
- Admin panel for creating/editing blog posts
- Rich text editor (TipTap or Slate)
- Featured image for each post
- Categories and tags
- Related posts section
- Comments section (optional)
- Social share buttons
- SEO metadata per post

**Schema**:
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Files**:
- `app/(customer)/blog/page.tsx`
- `app/(customer)/blog/[slug]/page.tsx`
- `app/(admin)/admin/blog/page.tsx`
- `components/admin/BlogEditor.tsx`

---

### TVLCVR-105: FAQ Section with Accordion
**Type**: Task | **Priority**: Medium | **Time**: 3 hours

**Description**: Create FAQ page with common questions and answers.

**Acceptance Criteria**:
- Route: `/faq`
- Accordion-style UI
- Categories: Bookings, Payments, Cancellations, General
- Search FAQs
- "Was this helpful?" feedback buttons
- FAQ schema markup for rich snippets
- Admin can add/edit FAQs

**Files**:
- `app/(customer)/faq/page.tsx`
- `components/customer/FaqAccordion.tsx`
- `supabase/migrations/*_faqs.sql`

---

### TVLCVR-106: Live Chat Support (Tawk.to / Crisp)
**Type**: Task | **Priority**: Medium | **Time**: 3 hours

**Description**: Integrate live chat widget for real-time customer support.

**Options**:
- Tawk.to (free)
- Crisp (free tier available)
- Intercom (paid)

**Acceptance Criteria**:
- Chat widget visible on all pages
- Desktop: bottom-right corner
- Mobile: collapsible button
- Only show during business hours (optional)
- Offline message form when unavailable
- Pass user context (page, package being viewed)

**Files**:
- `components/LiveChat.tsx`
- `app/layout.tsx` (add chat script)

---

### TVLCVR-107: Facebook Pixel & Meta Ads Integration
**Type**: Task | **Priority**: High | **Time**: 3 hours

**Description**: Integrate Facebook Pixel for retargeting and conversion tracking.

**Events to Track**:
- ViewContent (package view)
- AddToWishlist
- InitiateCheckout (booking started)
- Purchase (booking completed)
- Search

**Acceptance Criteria**:
- Facebook Pixel installed
- Conversion API configured (server-side)
- Standard events firing correctly
- Test events in Facebook Events Manager
- Create custom audiences for retargeting

**Files**:
- `lib/analytics/fbPixel.ts`
- `app/layout.tsx` (add pixel script)

---

### TVLCVR-108: Email Marketing Integration (Mailchimp)
**Type**: Task | **Priority**: Medium | **Time**: 4 hours

**Description**: Integrate Mailchimp for email marketing campaigns and automation.

**Acceptance Criteria**:
- Sync newsletter subscribers to Mailchimp list
- Sync booking customers to separate list
- Tag subscribers by interests (adventure, beach, etc.)
- Automated welcome email sequence
- Abandoned cart email (booking started but not completed)
- API integration for real-time sync

**Files**:
- Install `@mailchimp/mailchimp_marketing`
- `lib/marketing/mailchimp.ts`
- Webhook for abandoned bookings

---

### TVLCVR-109: Sitemap & Robots.txt Optimization
**Type**: Task | **Priority**: High | **Time**: 2 hours

**Description**: Generate comprehensive sitemap and optimize robots.txt for better crawling.

**Acceptance Criteria**:
- Dynamic sitemap includes: packages, categories, blog posts, static pages
- Sitemap split if >50,000 URLs (sitemap index)
- robots.txt allows all bots except malicious ones
- Disallow: /admin, /api
- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools

**Files**:
- `app/sitemap.ts` (enhance existing)
- `public/robots.txt`

---

### TVLCVR-110: Performance Monitoring Dashboard
**Type**: Task | **Priority**: Medium | **Time**: 5 hours

**Description**: Set up performance monitoring with Vercel Analytics or alternative.

**Metrics to Track**:
- Core Web Vitals (LCP, FID, CLS)
- Page load time by route
- API response times
- Error rates
- Uptime monitoring

**Tools**: Vercel Analytics, New Relic, or Datadog

**Files**:
- Install monitoring SDK
- Configure alerts for performance degradation
- Dashboard for viewing metrics

---

## Sprint 7: Polish & Edge Cases (55 hours)

### TVLCVR-111: Cancellation & Refund Management
**Type**: Story | **Priority**: High | **Time**: 10 hours

**Description**: Implement booking cancellation flow with refund processing.

**Acceptance Criteria**:
- Customer can request cancellation from booking detail page
- Cancellation policy displayed (e.g., free cancellation up to 7 days before)
- Admin approves/rejects cancellation requests
- Refund calculated based on cancellation policy
- Razorpay refund API integration
- Refund processed to original payment method
- Email notifications for cancellation and refund
- Track refund status in bookings table

**Files**:
- `app/(customer)/my-bookings/[id]/cancel/page.tsx`
- `app/(admin)/admin/bookings/cancellations/page.tsx`
- `lib/api/refunds.ts`
- Migration: Add cancellation fields to bookings

---

### TVLCVR-112: Promotional Coupons & Discounts
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Create coupon system for promotional discounts.

**Acceptance Criteria**:
- Admin creates coupons with: code, discount type (%, flat), amount, validity dates, usage limit
- Customer applies coupon at checkout
- Validate coupon: check expiry, usage limit, minimum booking amount
- Discount applied to total price
- Show discount in booking summary
- Track coupon usage analytics
- Prevent duplicate usage per user

**Schema**:
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_booking_amount DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

**Files**:
- `supabase/migrations/*_coupons.sql`
- `app/(admin)/admin/coupons/page.tsx`
- `components/customer/CouponInput.tsx`
- `lib/api/coupons.ts`

---

### TVLCVR-113: Gift Cards / Vouchers
**Type**: Story | **Priority**: Low | **Time**: 8 hours

**Description**: Allow users to purchase and redeem gift cards for packages.

**Acceptance Criteria**:
- Purchase gift card page: select amount, add message, recipient email
- Generate unique gift card code
- Email gift card to recipient with code
- Redeem gift card at checkout
- Track gift card balance
- Partial redemption support
- Admin view: all gift cards, balances, usage

**Files**:
- `app/(customer)/gift-cards/page.tsx`
- `app/(customer)/gift-cards/redeem/page.tsx`
- `supabase/migrations/*_gift_cards.sql`
- `lib/api/giftCards.ts`

---

### TVLCVR-114: Multi-Language Support (i18n)
**Type**: Story | **Priority**: Low | **Time**: 12 hours

**Description**: Add internationalization support for English and Hindi (or other language).

**Acceptance Criteria**:
- Language selector in navbar
- Static content translated (buttons, labels, navigation)
- Package titles/descriptions can be multilingual
- Date/currency formatting per locale
- URL structure: `/en/packages`, `/hi/packages`
- Store language preference in localStorage
- Use `next-intl` or `next-i18next`

**Files**:
- Install `next-intl`
- `messages/en.json`
- `messages/hi.json`
- Update all components with translation keys

---

### TVLCVR-115: Mobile App (Progressive Web App)
**Type**: Story | **Priority**: Medium | **Time**: 8 hours

**Description**: Convert website to Progressive Web App (PWA) for mobile app-like experience.

**Acceptance Criteria**:
- Installable on mobile devices
- Offline fallback page
- Service worker for caching
- App manifest with icons
- Push notifications support (for booking updates)
- "Add to Home Screen" prompt
- App icon and splash screen

**Files**:
- `public/manifest.json`
- `public/sw.js` (service worker)
- `public/icons/` (PWA icons 192x192, 512x512)
- `next.config.js` (PWA plugin)

---

### TVLCVR-116: Admin Role-Based Access Control (RBAC)
**Type**: Story | **Priority**: Medium | **Time**: 6 hours

**Description**: Implement role-based permissions for admin users.

**Roles**:
- **Super Admin**: Full access
- **Manager**: View all, manage bookings, view analytics
- **Content Editor**: Manage packages, categories, blog posts only
- **Support Agent**: View bookings, manage leads, view reviews

**Acceptance Criteria**:
- Admin users table with role field
- Middleware checks user role
- UI elements hidden based on role
- Unauthorized access shows 403 page
- Audit log of admin actions

**Files**:
- `supabase/migrations/*_admin_roles.sql`
- `lib/auth/checkAdminRole.ts`
- `middleware.ts` (role checks)

---

### TVLCVR-117: Automated Testing Suite
**Type**: Task | **Priority**: High | **Time**: 12 hours

**Description**: Set up comprehensive automated testing.

**Test Types**:
- Unit tests: API functions, utilities (Jest)
- Integration tests: API routes (Supertest)
- E2E tests: Critical user flows (Playwright)
  - Search and book a package
  - Submit a lead
  - Admin login and create package
- Component tests (React Testing Library)

**Coverage Target**: 70%+

**Files**:
- Install Jest, Playwright, React Testing Library
- `__tests__/` directory structure
- `playwright.config.ts`
- `jest.config.js`
- GitHub Actions CI workflow

---

### TVLCVR-118: Load Testing & Stress Testing
**Type**: Task | **Priority**: Medium | **Time**: 4 hours

**Description**: Perform load testing to ensure app handles production traffic.

**Scenarios**:
- 100 concurrent users browsing packages
- 50 concurrent booking submissions
- 500 requests/second to API
- Database query performance under load

**Tools**: Use k6, Artillery, or Apache JMeter

**Acceptance Criteria**:
- No errors under normal load (100 concurrent users)
- Response time <500ms for 95th percentile
- Identify and fix bottlenecks
- Document server requirements for production

**Files**:
- `tests/load/scenarios.js`
- Load testing report document

---

### TVLCVR-119: GDPR Compliance & Cookie Consent
**Type**: Task | **Priority**: Critical | **Time**: 4 hours

**Description**: Implement GDPR compliance features.

**Acceptance Criteria**:
- Cookie consent banner on first visit
- Cookie policy page explaining all cookies used
- User can accept/reject non-essential cookies
- Data export feature: users can download their data
- Data deletion feature: users can request account deletion
- Privacy-friendly analytics (respect Do Not Track)

**Files**:
- `components/CookieConsent.tsx`
- `app/(customer)/cookies/page.tsx`
- `app/(customer)/profile/data-export/page.tsx`
- `lib/gdpr/exportUserData.ts`

---

### TVLCVR-120: Maintenance Mode & Coming Soon Pages
**Type**: Task | **Priority**: Low | **Time**: 3 hours

**Description**: Create maintenance mode and coming soon page templates.

**Acceptance Criteria**:
- Maintenance mode flag in env variable
- When enabled, show maintenance page to all non-admin users
- Countdown timer (optional)
- Contact info for urgent inquiries
- Separate "Coming Soon" page for pre-launch

**Files**:
- `app/maintenance/page.tsx`
- `app/coming-soon/page.tsx`
- `middleware.ts` (maintenance mode check)

---

## Summary

**Total Tickets**: 44 additional tickets (TVLCVR-77 to TVLCVR-120)
**Total Estimated Time**: ~320 hours (8 weeks with 2 developers)

**Sprint Breakdown**:
- Sprint 3: Payment & Booking (60h)
- Sprint 4: Search, Filters & Auth (55h)
- Sprint 5: Production Optimization (50h)
- Sprint 6: Deployment & Marketing (45h)
- Sprint 7: Polish & Edge Cases (55h)
- Sprint 8: Testing & Launch (15h from Sprint 7)

**Production Launch Checklist**: After all tickets completed
