-- Timezone, currency and languages for destinations.
--
-- The world-map modal shows these three facts. Until now they existed only in
-- lib/data/destinations.ts, so a destination created in the admin panel opened a modal with the
-- fact row missing entirely. Storing them here lets an admin-created destination render the same
-- modal as the hardcoded ones, and is a step toward deleting that file.
--
-- Nullable on purpose: they are descriptive, and requiring them would block creating a
-- destination just to get a pin on the map.

ALTER TABLE destinations
  ADD COLUMN timezone VARCHAR(100),
  ADD COLUMN currency VARCHAR(100),
  ADD COLUMN languages VARCHAR(200);

COMMENT ON COLUMN destinations.timezone IS 'Display string, e.g. "GST · UTC+4" — not an IANA zone id.';
COMMENT ON COLUMN destinations.currency IS 'Display string, e.g. "UAE Dirham (AED)".';
COMMENT ON COLUMN destinations.languages IS 'Pre-joined for display, e.g. "Arabic · English".';

-- Backfill the six destinations that mirror lib/data/destinations.ts, so the modal keeps showing
-- exactly what it showed before this change.
UPDATE destinations SET timezone = 'GST · UTC+4',  currency = 'UAE Dirham (AED)',        languages = 'Arabic · English'            WHERE slug = 'dubai';
UPDATE destinations SET timezone = 'WITA · UTC+8', currency = 'Indonesian Rupiah (IDR)', languages = 'Indonesian · Balinese'       WHERE slug = 'bali';
UPDATE destinations SET timezone = 'SGT · UTC+8',  currency = 'Singapore Dollar (SGD)',  languages = 'English · Malay · Mandarin'  WHERE slug = 'singapore';
UPDATE destinations SET timezone = 'ICT · UTC+7',  currency = 'Thai Baht (THB)',         languages = 'Thai'                        WHERE slug = 'bangkok';
UPDATE destinations SET timezone = 'CET · UTC+1',  currency = 'Euro (EUR)',              languages = 'French'                      WHERE slug = 'paris';
UPDATE destinations SET timezone = 'JST · UTC+9',  currency = 'Japanese Yen (JPY)',      languages = 'Japanese'                    WHERE slug = 'tokyo';
