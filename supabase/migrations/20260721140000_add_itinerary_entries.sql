CREATE TABLE IF NOT EXISTS itinerary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  time_label VARCHAR(100),
  description TEXT,
  image_url TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_entries_day
  ON itinerary_entries(itinerary_day_id, display_order);

ALTER TABLE itinerary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for service_role on itinerary_entries"
  ON itinerary_entries;
CREATE POLICY "Enable all operations for service_role on itinerary_entries"
ON itinerary_entries FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Public can read itinerary entries of published packages"
  ON itinerary_entries;
CREATE POLICY "Public can read itinerary entries of published packages"
ON itinerary_entries FOR SELECT TO anon
USING (EXISTS (
  SELECT 1
  FROM itinerary_days d
  JOIN packages p ON p.id = d.package_id
  WHERE d.id = itinerary_entries.itinerary_day_id AND p.status = 'published'
));

GRANT SELECT ON TABLE itinerary_entries TO anon, authenticated;
GRANT ALL ON TABLE itinerary_entries TO service_role;

INSERT INTO itinerary_entries (
  itinerary_day_id, name, time_label, description, image_url, icon_name, display_order
)
SELECT
  d.id,
  shift.label,
  NULL,
  shift.body,
  (
    SELECT i.image_url
    FROM itinerary_day_images i
    WHERE i.itinerary_day_id = d.id AND i.shift = shift.key
    ORDER BY i.display_order
    LIMIT 1
  ),
  shift.icon,
  shift.position
FROM itinerary_days d
CROSS JOIN LATERAL (
  VALUES
    ('Morning',   'morning',   d.morning_activity,   'Sun',      0),
    ('Afternoon', 'afternoon', d.afternoon_activity, 'MapPin',   1),
    ('Evening',   'evening',   d.evening_activity,   'Mountain', 2)
) AS shift(label, key, body, icon, position)
WHERE COALESCE(BTRIM(shift.body), '') <> ''
  AND NOT EXISTS (
    SELECT 1 FROM itinerary_entries e WHERE e.itinerary_day_id = d.id
  );
