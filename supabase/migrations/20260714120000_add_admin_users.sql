-- Authorisation for the admin panel.

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

INSERT INTO admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@travelcarvers.in'
ON CONFLICT (user_id) DO NOTHING;
