# Admin User Setup Guide

This guide explains how to create the first admin user for the Travel Carvers admin panel.

## Prerequisites

- Supabase project running (local or cloud)
- Database migrations applied
- Admin panel deployed

## Steps to Create First Admin User

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Studio**
   - Local: http://localhost:54323
   - Cloud: Go to your project at supabase.com

2. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add User" button

3. **Create User**
   - Enter email: `admin@travelcarvers.in` (or your admin email)
   - Enter a strong password
   - Check "Auto Confirm User"
   - Click "Create User"
   - **Copy the User ID** (UUID) - you'll need this

4. **Add to Admin Users Table**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Paste this SQL (replace the email with yours):

   ```sql
   INSERT INTO admin_users (user_id, email)
   SELECT id, email 
   FROM auth.users 
   WHERE email = 'admin@travelcarvers.in';
   ```

   - Click "Run" or press Cmd/Ctrl + Enter

5. **Verify**
   - Click "Table Editor" in left sidebar
   - Select "admin_users" table
   - You should see your user listed

### Option 2: Using SQL Only

Run this complete SQL script in the SQL Editor:

```sql
-- Step 1: Create auth user (only works if you have service_role access)
-- This creates a user with a hashed password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@travelcarvers.in',
  crypt('your-secure-password-here', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Step 2: Add to admin_users table
INSERT INTO admin_users (user_id, email)
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@travelcarvers.in';
```

**Note**: Replace `'your-secure-password-here'` with a strong password.

### Option 3: Using Supabase CLI

```bash
# Create user via CLI
supabase auth users create admin@travelcarvers.in --password "YourSecurePassword123!"

# Then add to admin_users table
supabase db execute "INSERT INTO admin_users (user_id, email) SELECT id, email FROM auth.users WHERE email = 'admin@travelcarvers.in';"
```

## Testing Login

1. Go to http://localhost:3000/admin/login (or your deployed URL)
2. Enter the email and password you created
3. Click "Sign In"
4. You should be redirected to `/admin/dashboard`

## Troubleshooting

### "Invalid login credentials" Error

**Cause**: User exists in `auth.users` but NOT in `admin_users` table.

**Fix**:
```sql
-- Check if user exists
SELECT id, email FROM auth.users WHERE email = 'admin@travelcarvers.in';

-- If yes, add to admin_users
INSERT INTO admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@travelcarvers.in'
ON CONFLICT (user_id) DO NOTHING;
```

### "User not found" Error

**Cause**: User doesn't exist in `auth.users`.

**Fix**: Create the user using Option 1 or 2 above.

### Can't Access Supabase Dashboard

**Local Supabase**:
- Make sure Supabase is running: `supabase status`
- Studio URL: http://localhost:54323
- Default credentials should be in your console output

**Cloud Supabase**:
- Go to https://supabase.com
- Sign in
- Select your project

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

2. **Limit Admin Users**
   - Only create admin accounts for trusted team members
   - Remove admin access when team members leave

3. **Use Environment-Specific Emails**
   - Local: `admin@localhost`
   - Staging: `admin-staging@travelcarvers.in`
   - Production: `admin@travelcarvers.in`

4. **Enable 2FA (Future)**
   - Supabase supports TOTP 2FA
   - Recommended for production

## Adding More Admin Users

Once you have one admin, you can add more:

```sql
-- Method 1: If user already exists in auth.users
INSERT INTO admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'newadmin@travelcarvers.in'
ON CONFLICT (user_id) DO NOTHING;

-- Method 2: Check who's an admin
SELECT 
  a.user_id,
  a.email,
  a.created_at
FROM admin_users a
JOIN auth.users u ON u.id = a.user_id
ORDER BY a.created_at DESC;
```

## Removing Admin Access

```sql
-- Remove from admin_users (user stays in auth.users but loses admin access)
DELETE FROM admin_users WHERE email = 'oldadmin@travelcarvers.in';

-- Or delete completely from auth (removes from both tables due to CASCADE)
DELETE FROM auth.users WHERE email = 'oldadmin@travelcarvers.in';
```

## Migration Note

The migration `20260714120000_add_admin_users.sql` attempts to automatically add `admin@travelcarvers.in` to the admin_users table if that user already exists in auth.users.

**However**, this won't work on first deployment because:
1. Migrations run first
2. Auth users are created separately
3. The SELECT returns 0 rows

**Solution**: Manually create the admin user AFTER running migrations, using the steps above.

## Need Help?

- Check Supabase docs: https://supabase.com/docs/guides/auth
- Check admin panel code: `lib/supabase/auth.ts`
- Check proxy auth: `proxy.ts`
