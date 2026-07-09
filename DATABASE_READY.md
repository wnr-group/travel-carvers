# ✅ Database Setup Complete

## Status

- ✅ Supabase local instance: **Running**
- ✅ Database: **Ready**
- ✅ Admin user: **Created and seeded**
- ✅ Environment variables: **Configured**

## Admin Credentials

```
Email: admin@travelcarvers.in
Password: Admin@123
Session: 6 hours
```

## URLs

- **Application**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Supabase Studio**: http://127.0.0.1:54323

## Environment Configuration

The following has been configured in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## Verify Setup

### 1. Check Admin User in Supabase Studio

Visit: http://127.0.0.1:54323

1. Click **"Authentication"** in the left sidebar
2. Click **"Users"**
3. You should see: `admin@travelcarvers.in`

### 2. Test Login

```bash
# Start the dev server
npm run dev
```

Visit: http://localhost:3000/admin/login

- Email and password are pre-filled
- Click **"Sign In"**
- You should be redirected to the dashboard

### 3. Verify Dashboard

After login, you should see:
- Welcome banner with greeting
- Profile section with your email (`admin@travelcarvers.in`)
- Logout button
- Stats cards (all showing 0 for now)
- Quick action buttons

## Database Schema

Currently, the database only has the default Supabase auth tables:

- `auth.users` - User accounts (admin user exists here)
- `auth.sessions` - Active sessions
- Other default auth tables

### Next Steps for Schema

When ready to add your own tables, create migrations:

```bash
# Create a new migration
npx supabase migration new create_tables

# Edit the generated SQL file in supabase/migrations/
# Add your table definitions (packages, destinations, leads, etc.)

# Apply the migration
npx supabase db reset
```

## Supabase Commands

```bash
# Check status and get credentials
npm run supabase:status

# Stop Supabase
npm run supabase:stop

# Start Supabase (if stopped)
npm run supabase:start

# Reset database (destructive - will recreate admin user)
npm run supabase:reset
npm run seed:admin

# Create admin user (if deleted)
npm run seed:admin
```

## Port Conflicts

If you get a "port already allocated" error:

```bash
# Stop other Supabase projects first
cd /Users/dith/projects/breakpoint-arena
npx supabase stop

# Then start this project's Supabase
cd /Users/dith/projects/travel-globe-website
npm run supabase:start
```

## Session Details

- **Duration**: 6 hours (21,600 seconds)
- **Storage**: HTTP-only cookies
- **Tokens**:
  - `supabase-auth-token` - Access token
  - `supabase-refresh-token` - Refresh token

## What's Working

✅ Admin can login with email/password  
✅ Session persists for 6 hours  
✅ Protected routes require authentication  
✅ Profile displays on dashboard  
✅ Logout clears session  
✅ Middleware protects admin routes  

## Troubleshooting

### Login fails

**Check:**
1. Supabase is running: `npm run supabase:status`
2. Admin user exists: Visit http://127.0.0.1:54323 > Authentication > Users
3. `.env.local` has correct credentials
4. Dev server is running: `npm run dev`

### "Cannot read properties of undefined"

**Fix:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### Admin user doesn't exist

**Fix:**
```bash
npm run seed:admin
```

### Need to reset everything

**Fix:**
```bash
npm run supabase:reset
npm run seed:admin
npm run dev
```

## Production Deployment

When deploying to production:

1. **Create Supabase Cloud Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for provisioning (~2 minutes)

2. **Get Production Credentials**
   - Project Settings > API
   - Copy URL and keys

3. **Update Environment Variables**
   - In your deployment platform (Vercel, etc.)
   - Set production values for:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Create Admin User in Production**
   - Option A: Via Supabase Dashboard > Authentication > Users
   - Option B: Run seed script with production env vars

5. **Deploy Application**

---

**Status**: ✅ Database ready, admin user seeded, fully functional
**Date**: 2026-07-08
