# Admin Authentication Setup Guide

## ✅ What Was Implemented

- **Supabase Auth Integration**: Email/password authentication
- **Session Management**: 6-hour session timeout
- **Middleware Protection**: Automatic redirect for protected routes
- **Admin Dashboard**: Profile display with email and logout button
- **Login Page**: Pre-filled credentials for easy testing

## 🔐 Admin Credentials

```
Email: admin@travelcarvers.in
Password: Admin@123
```

## 🚀 Quick Setup (3 Steps)

### Step 1: Start Supabase

```bash
npm run supabase:start
```

Wait for it to complete, then get your credentials:

```bash
npm run supabase:status
```

### Step 2: Configure Environment

Copy the credentials from step 1 to your `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase status>
```

### Step 3: Create Admin User

Run the seed script:

```bash
npm run seed:admin
```

This will create the admin user with email `admin@travelcarvers.in` and password `Admin@123`.

**Alternatively**, create manually via Supabase Studio:
1. Go to http://localhost:54323
2. Navigate to **Authentication** > **Users**
3. Click **"Add User"**
4. Enter:
   - Email: `admin@travelcarvers.in`
   - Password: `Admin@123`
   - Auto Confirm User: ✅ Yes

## 🧪 Test the Login

### Step 1: Start the dev server

```bash
npm run dev
```

### Step 2: Visit the login page

Go to: http://localhost:3000/admin/login

### Step 3: Login

The form is pre-filled with:
- Email: `admin@travelcarvers.in`
- Password: `Admin@123`

Click **"Sign In"**

### Step 4: Verify

You should be redirected to: http://localhost:3000/admin/dashboard

You'll see:
- Welcome banner
- Profile section showing your email
- Logout button
- Stats (all 0 for now)
- Quick action buttons

### Step 5: Test Logout

Click the **"Logout"** button in the top right.

You should be redirected back to the login page.

## 🔒 How It Works

### Session Management

- **Duration**: 6 hours (21,600 seconds)
- **Storage**: HTTP-only cookies (secure in production)
- **Tokens**: 
  - `supabase-auth-token` - Access token
  - `supabase-refresh-token` - Refresh token

### Middleware Protection

The middleware (`middleware.ts`) protects all `/admin/*` routes except `/admin/login`.

If you try to access `/admin/dashboard` without being logged in, you'll be redirected to `/admin/login`.

If you're already logged in and visit `/admin/login`, you'll be redirected to `/admin/dashboard`.

### Authentication Flow

```
1. User submits login form
   ↓
2. Server action calls Supabase Auth
   ↓
3. Supabase validates credentials
   ↓
4. Session tokens stored in HTTP-only cookies
   ↓
5. User redirected to /admin/dashboard
   ↓
6. Middleware checks for valid token
   ↓
7. Dashboard loads user data from session
```

## 📁 Key Files

### Authentication Logic
- `lib/supabase/auth.ts` - Sign in, sign out, get session functions
- `middleware.ts` - Route protection middleware

### Pages
- `app/(admin)/admin/login/page.tsx` - Login form
- `app/(admin)/admin/login/actions.ts` - Login server action
- `app/(admin)/admin/dashboard/page.tsx` - Admin dashboard
- `app/(admin)/admin/dashboard/LogoutButton.tsx` - Logout button component

### Scripts
- `scripts/seed-admin.ts` - Create admin user script

## 🐛 Troubleshooting

### "Login failed" error

**Check:**
1. Supabase is running: `npm run supabase:status`
2. Admin user exists: Check http://localhost:54323 > Authentication > Users
3. Environment variables are set in `.env.local`
4. Credentials are correct: `admin@travelcarvers.in` / `Admin@123`

### Redirected to login after signing in

**Check:**
1. Your browser allows cookies
2. `.env.local` has the correct `SUPABASE_SERVICE_ROLE_KEY`
3. The service role key is the full JWT (long string, ~250 characters)

### "SUPABASE_SERVICE_ROLE_KEY is not set" error

**Fix:**
1. Run: `npm run supabase:status`
2. Copy the **service_role key** (not the short anon key)
3. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=<long_jwt_token>`
4. Restart dev server: `npm run dev`

### Can't access Supabase Studio

**Check:**
1. Supabase is running: `npm run supabase:status`
2. Docker is running
3. Port 54323 is not in use
4. Visit: http://localhost:54323 (not https)

### Admin user already exists error

This is fine! The user was already created. Just login with the credentials.

To reset:
```bash
npm run supabase:reset
npm run seed:admin
```

## 🔧 Configuration

### Change Session Timeout

Edit `lib/supabase/auth.ts`:

```typescript
maxAge: 60 * 60 * 6, // 6 hours (change this)
```

### Change Admin Credentials

Edit `scripts/seed-admin.ts`:

```typescript
const email = 'your-email@example.com'
const password = 'YourPassword123'
```

Then run: `npm run seed:admin`

### Change Login Page Defaults

Edit `app/(admin)/admin/login/page.tsx`:

```typescript
defaultValue="your-email@example.com"  // Email field
defaultValue="YourPassword"             // Password field
```

## 🚀 Production Deployment

Before deploying to production:

1. **Create Production Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Get production credentials

2. **Update Environment Variables**
   - Set production `NEXT_PUBLIC_SUPABASE_URL`
   - Set production `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Set production `SUPABASE_SERVICE_ROLE_KEY`

3. **Create Admin User in Production**
   - Go to your Supabase dashboard
   - Authentication > Users > Add User
   - Or run: `npm run seed:admin` (with production env vars)

4. **Deploy**
   - Deploy to Vercel/other platform
   - Set environment variables in deployment settings

5. **Test**
   - Visit your production domain `/admin/login`
   - Login with admin credentials
   - Verify session persistence

## 📊 What's Next

Now that authentication is working, you can:

1. **Add database schema** - Define tables for packages, destinations, leads
2. **Build admin CRUD** - Create forms to manage content
3. **Add role-based access** - Different admin levels (super admin, editor, viewer)
4. **Implement audit logs** - Track admin actions
5. **Add password reset** - Forgot password flow

---

**Status**: ✅ Admin authentication fully functional with 6-hour sessions
