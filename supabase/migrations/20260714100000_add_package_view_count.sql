-- Track how many times a package has been viewed.
-- add view_count column

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
