# Travel Carvers Website - Setup Guide

## Tech Stack

This project mirrors the tech stack from `breakpoint-arena`:

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth (Admin only - Email/Password)
- **State Management**: Redux Toolkit
- **Server State**: React Query (@tanstack/react-query)
- **UI Library**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Globe**: Three.js + React Three Fiber

## Project Structure

```
app/
├── (admin)/          # Admin panel routes (protected)
│   └── admin/
│       ├── login/
│       └── dashboard/
├── (customer)/       # Public-facing routes
│   └── page.tsx     # Homepage with 3D globe
├── layout.tsx       # Root layout with providers
└── page.tsx         # Root redirect

components/
├── admin/           # Admin-specific components
├── customer/        # Customer-facing components
├── shared/          # Shared components
└── ui/              # Shadcn UI components

lib/
├── redux/           # Redux store and slices
├── providers/       # React Query provider
├── supabase/        # Supabase client, server, storage helpers
└── utils.ts         # Utility functions (cn helper)

supabase/
├── migrations/      # Database migrations (empty for now)
├── config.toml      # Supabase configuration
└── README.md        # Supabase-specific docs
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Supabase Local Development

Requires Docker to be running.

```bash
npm run supabase:start
```

This command will:
- Pull necessary Docker images (first time only)
- Start PostgreSQL, Auth, Storage, and Realtime servers
- Display credentials in the terminal

### 3. Configure Environment Variables

Create `.env.local` file in the root:

```bash
cp .env.example .env.local
```

After `npm run supabase:start`, run:

```bash
npm run supabase:status
```

Copy the values to `.env.local`:
- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

Also update contact details:
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_PHONE_NUMBER`
- `NEXT_PUBLIC_EMAIL`

### 4. Start Development Server

```bash
npm run dev
```

Visit:
- Customer site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Admin dashboard: http://localhost:3000/admin/dashboard

### 5. Stop Supabase (when done)

```bash
npm run supabase:stop
```

## Features Implemented

### ✅ Completed

- [x] Next.js 16 setup with App Router
- [x] Route groups: `(admin)` and `(customer)`
- [x] Redux Toolkit integration
- [x] React Query integration
- [x] Supabase client/server setup
- [x] Supabase Storage helpers
- [x] Supabase local development config
- [x] Shadcn UI setup
- [x] Admin login page (placeholder)
- [x] Admin dashboard (placeholder)
- [x] Customer homepage with 3D globe
- [x] Toaster for notifications

### 🔄 To Be Implemented

- [ ] Database schema (users, packages, destinations, attractions, leads)
- [ ] Supabase Auth integration (admin email/password login)
- [ ] Admin middleware/authentication guard
- [ ] Storage buckets creation migration
- [ ] Image upload functionality
- [ ] Contact form with database integration
- [ ] WhatsApp/Call/Email CTAs
- [ ] Package management (CRUD)
- [ ] Destination management (CRUD)
- [ ] Lead management (view/filter)
- [ ] Admin navigation/sidebar
- [ ] Customer navigation/footer components

## Database Schema (Planned)

Will be added via migrations in `supabase/migrations/`:

### Tables

1. **users** - Admin users only
2. **packages** - Travel packages
3. **destinations** - Countries/destinations
4. **attractions** - Tourist attractions within destinations
5. **leads** - Contact form submissions
6. **combo_packs** - Combination packages

### Storage Buckets

1. **destinations** - Destination images
2. **packages** - Package images
3. **attractions** - Attraction images

## Development Workflow

1. Make changes to code
2. Create database migrations when needed:
   ```bash
   npx supabase migration new <migration_name>
   ```
3. Edit the generated SQL file in `supabase/migrations/`
4. Apply migrations:
   ```bash
   npm run supabase:reset  # Local only, destructive
   ```

## Useful Commands

```bash
# Development
npm run dev                    # Start Next.js dev server

# Supabase Local
npm run supabase:start        # Start local Supabase
npm run supabase:stop         # Stop local Supabase
npm run supabase:status       # View credentials
npm run supabase:reset        # Reset DB (destructive)

# Build
npm run build                 # Build for production
npm start                     # Start production server
```

## Next Steps

1. **Define Database Schema**: Create migrations for tables
2. **Implement Auth**: Add Supabase auth for admin login
3. **Create Admin Features**: Package/destination/lead management
4. **Build Customer Features**: Browse packages, contact forms
5. **Deploy**: Set up production Supabase project and deploy to Vercel

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Query](https://tanstack.com/query/latest)
