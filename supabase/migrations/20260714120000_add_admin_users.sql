-- Authorisation for the admin panel.
--
-- IMPORTANT: This migration creates the admin_users table but does NOT create
-- the first admin user automatically (because auth.users is empty on first run).
--
-- After running this migration, manually create your first admin user:
-- See: docs/ADMIN_SETUP.md for detailed instructions
--
-- Quick steps:
-- 1. Create user in Supabase Dashboard → Authentication → Users
-- 2. Run: INSERT INTO admin_users (user_id, email)
--         SELECT id, email FROM auth.users WHERE email = 'your-admin@email.com';

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE admin_users FROM anon, authenticated;
GRANT ALL ON TABLE admin_users TO service_role;

CREATE POLICY "Service role can manage admin users"
ON admin_users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Attempt to add admin@travelcarvers.in if it exists
-- (This will succeed on subsequent migrations if user was created manually)
INSERT INTO admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@travelcarvers.in'
ON CONFLICT (user_id) DO NOTHING;
