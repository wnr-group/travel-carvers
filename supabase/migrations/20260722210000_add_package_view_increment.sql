CREATE OR REPLACE FUNCTION increment_package_view_count(p_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE packages
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = p_slug
    AND status IN ('published', 'sold_out');
$$;

REVOKE ALL ON FUNCTION increment_package_view_count(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_package_view_count(TEXT) TO anon, authenticated, service_role;

COMMENT ON FUNCTION increment_package_view_count(TEXT) IS
  'Increments packages.view_count for one published package. Called once per session per package.';
