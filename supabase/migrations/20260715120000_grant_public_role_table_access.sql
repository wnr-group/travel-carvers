GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;

-- The only direct public write is lead submission. Reviews are inserted only
-- via the createReview server action (service role) so they always go through
-- moderation; anon must not be able to INSERT reviews directly.
GRANT INSERT ON TABLE leads TO anon, authenticated;

REVOKE ALL ON TABLE admin_users FROM anon, authenticated;
