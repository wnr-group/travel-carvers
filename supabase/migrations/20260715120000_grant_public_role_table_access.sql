GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;

-- The only public writes are lead and review submissions 
GRANT INSERT ON TABLE leads, reviews TO anon, authenticated;

REVOKE ALL ON TABLE admin_users FROM anon, authenticated;
