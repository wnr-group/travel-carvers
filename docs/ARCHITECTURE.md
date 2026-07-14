# Architecture Overview

## What We Just Set Up

This is a **boilerplate setup** mirroring `breakpoint-arena` tech stack for a **tour operator business website**.

## Purpose

- **Public Website**: Interactive 3D globe to explore destinations and view travel packages
- **Admin Panel**: Manage packages, destinations, attractions, and view customer leads
- **No Customer Login**: Only admins can log in; public visitors browse freely

## Key Decisions Made

### 1. Authentication
- **Method**: Supabase Auth with Email + Password
- **Scope**: Admin only (no customer accounts)
- **Implementation**: Not yet coded, just placeholder pages

### 2. Tech Stack (from breakpoint-arena)
- Next.js 16 App Router
- Supabase (local dev ready)
- Redux Toolkit + React Query
- Shadcn UI + Radix UI
- Tailwind CSS

### 3. Image Storage
- **Service**: Supabase Storage buckets
- **Buckets**: `destinations`, `packages`, `attractions`
- **Implementation**: Helper functions created, buckets not yet created

### 4. Features
- **Contact Forms**: Save to database + email/WhatsApp/call CTAs
- **Content Management**: Packages, destinations, attractions, combo packs, leads
- **Implementation**: All planned, none implemented yet

## What's Ready

### ✅ Infrastructure
- [x] Project structure with route groups
- [x] Supabase local development configured
- [x] Environment variables template
- [x] Redux store boilerplate
- [x] React Query provider
- [x] Supabase client/server/storage helpers
- [x] UI component structure

### ✅ Pages Created
- [x] Customer homepage (existing globe + packages UI)
- [x] Admin login page (placeholder)
- [x] Admin dashboard (placeholder)

### ⚠️ Not Implemented Yet
- Database schema/tables
- Supabase Auth integration
- Admin authentication middleware
- Image upload functionality
- Contact forms
- CRUD operations for any entity

## Data Model (Planned)

### Core Entities
1. **Users** - Admin accounts only
2. **Packages** - Travel packages (title, description, price, images, itinerary)
3. **Destinations** - Countries/cities (name, description, images, coordinates)
4. **Attractions** - Tourist spots within destinations
5. **Leads** - Contact form submissions (name, email, phone, message, package interest)
6. **Combo Packs** - Bundled packages

## File Structure Reference

```
Key Files to Know:

Supabase:
- lib/supabase/client.ts       # Browser client (auth, queries)
- lib/supabase/server.ts       # Server client (admin operations)
- lib/supabase/storage.ts      # Image upload helpers
- supabase/config.toml         # Supabase configuration

State Management:
- lib/redux/store.ts           # Redux store
- lib/providers/QueryProvider.tsx  # React Query

Routes:
- app/(customer)/page.tsx      # Public homepage
- app/(admin)/admin/login/     # Admin login
- app/(admin)/admin/dashboard/ # Admin dashboard

Config:
- .env.example                 # Environment variables template
- supabase/README.md           # Supabase setup guide
- SETUP.md                     # Full setup instructions
```

## Next Implementation Steps

When you're ready to build features:

1. **Database Schema**
   - Create migration files in `supabase/migrations/`
   - Define tables for users, packages, destinations, attractions, leads
   - Create Storage buckets

2. **Admin Authentication**
   - Implement Supabase Auth signup/login
   - Add middleware to protect `/admin` routes
   - Create session management

3. **Admin CRUD**
   - Package management pages
   - Destination management
   - Lead viewing/filtering
   - Image upload components

4. **Customer Features**
   - Contact/inquiry forms
   - Package detail pages
   - Destination detail pages
   - WhatsApp/Call/Email CTAs

## How Supabase Local Development Works

1. Run `npm run supabase:start` (requires Docker)
2. Supabase CLI starts:
   - PostgreSQL on port 54321
   - Studio dashboard on http://localhost:54323
3. Get credentials from `npm run supabase:status`
4. Add to `.env.local`
5. Your app connects to local Supabase instance
6. When done: `npm run supabase:stop`

## Differences from Breakpoint Arena

### Removed:
- MSG91 (SMS/OTP)
- Razorpay (Payments)
- Phone authentication
- Customer login system
- Booking/slot management
- Food menu
- Device management
- Subscription plans
- Happy hours
- Promo codes

### Added:
- 3D interactive globe
- Destination/attraction management
- Travel package management
- Lead generation forms
- International + domestic travel categories

### Kept:
- Route group structure
- Redux + React Query
- Supabase setup
- Admin panel concept
- UI component library (Shadcn)

## Environment Variables Explained

```bash
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL          # From supabase status
NEXT_PUBLIC_SUPABASE_ANON_KEY     # From supabase status (public safe)
SUPABASE_SERVICE_ROLE_KEY         # From supabase status (server only, full access)

# Application
NEXT_PUBLIC_APP_URL               # Your domain
NEXT_PUBLIC_COMPANY_NAME          # Business name

# Contact CTAs
NEXT_PUBLIC_WHATSAPP_NUMBER       # For click-to-WhatsApp
NEXT_PUBLIC_PHONE_NUMBER          # For click-to-call
NEXT_PUBLIC_EMAIL                 # For mailto links

# Security (generate random strings)
SESSION_SECRET                    # For session encryption
SESSION_EXPIRY_DAYS               # How long sessions last
```

## Production Deployment Checklist

When ready to go live:

- [ ] Create Supabase cloud project at supabase.com
- [ ] Update environment variables with production credentials
- [ ] Run migrations on production: `npx supabase db push`
- [ ] Create storage buckets manually in Supabase dashboard
- [ ] Deploy to Vercel/other host
- [ ] Set up custom domain
- [ ] Create first admin user
- [ ] Test auth flow
- [ ] Add content (packages, destinations)

## Quick Reference Commands

```bash
# Local Development
npm run dev                      # Start Next.js
npm run supabase:start          # Start Supabase
npm run supabase:status         # View Supabase credentials
npm run supabase:stop           # Stop Supabase

# When you have migrations
npm run supabase:reset          # Apply all migrations (local only)

# Production
npm run build                    # Build for deployment
npx supabase db push            # Push migrations to cloud
```
