
ALTER TABLE itinerary_days
  ADD COLUMN IF NOT EXISTS timing VARCHAR(200);

ALTER TABLE itinerary_day_images
  ADD COLUMN IF NOT EXISTS shift VARCHAR(20);

ALTER TABLE itinerary_day_images
  DROP CONSTRAINT IF EXISTS itinerary_day_images_shift_check;

ALTER TABLE itinerary_day_images
  ADD CONSTRAINT itinerary_day_images_shift_check
  CHECK (shift IS NULL OR shift IN ('morning', 'afternoon', 'evening'));

CREATE INDEX IF NOT EXISTS idx_itinerary_day_images_day_shift
  ON itinerary_day_images(itinerary_day_id, shift, display_order);
