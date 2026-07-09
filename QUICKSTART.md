# Quick Start Guide

## ✅ Setup Complete!

Your travel-globe-website is now configured with the same tech stack as breakpoint-arena.

## What's Working Right Now

- ✅ Next.js 16 with App Router
- ✅ Supabase local development configured
- ✅ Redux Toolkit + React Query integrated
- ✅ Admin and Customer route groups
- ✅ 3D Globe homepage
- ✅ Admin authentication with 6-hour sessions
- ✅ Build passes successfully

## Start Development in 5 Steps

### 1. Start Supabase (Docker required)

```bash
npm run supabase:start
```

Wait for it to start, then get credentials:

```bash
npm run supabase:status
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and add the credentials from step 1:

```bash
cp .env.example .env.local
# Then edit .env.local with your credentials
```

### 3. Create Admin User

```bash
npm run seed:admin
```

This creates: `admin@travelcarvers.in` / `Admin@123`

### 4. Start Next.js

```bash
npm run dev
```

Visit:
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login (use credentials above)
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (requires login)
- **Supabase Studio**: http://localhost:54323

### 5. Stop Supabase (when done)

```bash
npm run supabase:stop
```

## 🔐 Admin Authentication

**Credentials:**
- Email: `admin@travelcarvers.in`
- Password: `Admin@123`

**Features:**
- ✅ 6-hour session management
- ✅ Protected routes with middleware
- ✅ Profile display with logout
- ✅ Pre-filled login form

**Detailed guide:** [ADMIN_AUTH_SETUP.md](./ADMIN_AUTH_SETUP.md)

## Project Structure

```
Key Directories:
├── app/
│   ├── (admin)/          # Admin panel (login, dashboard)
│   ├── (customer)/       # Public website (homepage with globe)
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── admin/            # Admin components
│   ├── customer/         # Customer components
│   ├── shared/           # Shared components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── supabase/         # Supabase clients & storage helpers
│   ├── redux/            # Redux store
│   └── providers/        # React Query provider
└── supabase/
    ├── migrations/       # Database migrations (add here)
    └── config.toml       # Supabase config
```

## What to Build Next

### Phase 1: Database Schema
Create your first migration:
```bash
npx supabase migration new create_initial_schema
```

Edit the generated SQL file in `supabase/migrations/`.

Example tables you'll need:
- `users` - Admin accounts
- `packages` - Travel packages
- `destinations` - Countries/cities
- `attractions` - Tourist spots
- `leads` - Contact form submissions

### Phase 2: Authentication ✅ DONE
- ✅ Supabase Auth for admin login
- ✅ Middleware protecting `/admin` routes
- ✅ Login form with session management

### Phase 3: Admin Features
- Package CRUD (Create/Read/Update/Delete)
- Destination management
- Lead viewing
- Image upload with Supabase Storage

### Phase 4: Customer Features
- Contact/inquiry forms
- Package detail pages
- WhatsApp/Call/Email CTAs
- Search and filters

## Available Commands

```bash
# Development
npm run dev                 # Start Next.js dev server
npm run build               # Build for production

# Supabase
npm run supabase:start     # Start local Supabase
npm run supabase:stop      # Stop local Supabase
npm run supabase:status    # View connection details
npm run supabase:reset     # Reset local database (destructive)
npm run seed:admin         # Create admin user
```

## Important Files

- **`.env.local`** - Your local environment variables (not in git)
- **`lib/supabase/client.ts`** - Browser Supabase client (use in components)
- **`lib/supabase/server.ts`** - Server Supabase client (use in server actions/API)
- **`lib/supabase/storage.ts`** - Image upload helpers
- **`supabase/README.md`** - Detailed Supabase documentation
- **`SETUP.md`** - Full setup documentation
- **`ARCHITECTURE.md`** - Architecture decisions and overview

## Common Issues

### Supabase won't start
- Make sure Docker Desktop is running
- Check ports 54321 and 54323 aren't in use
- Run `npm run supabase:stop` then try again

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

### 3D Globe not showing
- The globe loads on client-side only (SSR disabled)
- Check browser console for errors
- Make sure internet connection is available (loads textures from CDN)

## Next Steps Documentation

Read these in order:
1. **QUICKSTART.md** (you are here) - Get up and running
2. **SETUP.md** - Detailed setup and features overview
3. **ARCHITECTURE.md** - Architecture decisions and technical details
4. **supabase/README.md** - Database and storage documentation

## Need Help?

- Check the error message carefully
- Look in `SETUP.md` and `ARCHITECTURE.md` for details
- Review breakpoint-arena code for reference patterns
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

---

**Status**: ✅ Boilerplate ready, no schema/features implemented yet
