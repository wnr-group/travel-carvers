-- Close public write access to the category-images bucket.

DROP POLICY IF EXISTS "Authenticated users can upload category images" ON storage.objects;
