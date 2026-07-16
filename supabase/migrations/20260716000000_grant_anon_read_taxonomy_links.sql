CREATE POLICY "Public can read category subcategory links"
ON category_subcategory FOR SELECT TO anon
USING (true);

CREATE POLICY "Public can read categories of published packages"
ON package_categories FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM packages p
  WHERE p.id = package_categories.package_id AND p.status = 'published'
));

CREATE POLICY "Public can read subcategories of published packages"
ON package_subcategories FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM packages p
  WHERE p.id = package_subcategories.package_id AND p.status = 'published'
));
