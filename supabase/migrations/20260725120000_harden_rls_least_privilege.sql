-- Harden RLS least-privilege: drop dead `authenticated` policies and revoke
-- unused table privileges from anon / authenticated.
--
-- This app authenticates admins with its own session (SESSION_SECRET + the
-- admin_users table), NOT Supabase Auth — so no `authenticated` JWT is ever
-- issued and any policy targeting the `authenticated` role matches nobody.
-- All admin writes (packages, images, reviews) go through service_role on the
-- server. These leftover policies are therefore inert today, but would silently
-- grant write access to every signed-in user the moment Supabase Auth is enabled.
--
-- The category-images and destination-images buckets were already tightened this
-- way (20260713120000, 20260722100000); this finishes the job for the remaining
-- image buckets and for review_photos.

-- 1. Drop the dead "authenticated can upload" storage policies. Uploads run
--    through app/api/admin/upload/route.ts under requireAdmin() + service_role,
--    which keeps full access via its own "Service role can manage ..." policies.
DROP POLICY IF EXISTS "Authenticated users can upload package images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hotel images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload itinerary images" ON storage.objects;

-- 2. Drop the dead review_photos INSERT policy. Review photos are written
--    server-side with the service role (lib/api/reviews.ts); public read stays.
DROP POLICY IF EXISTS "Authenticated users can insert review photos" ON review_photos;

-- 3. Revoke privileges anon / authenticated never need on public tables. These
--    are Supabase defaults left over from table creation; TRUNCATE in particular
--    is not subject to RLS, so revoking it removes a theoretical data-wipe vector
--    (not reachable via PostgREST today, but defense-in-depth). SELECT and the
--    intentional leads INSERT are untouched, so nothing the app relies on changes.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.%I FROM anon, authenticated',
      r.tablename
    );
  END LOOP;
END $$;
