-- Group packages advertise their group size on the listing card, so a customer sees it
-- before opening the package

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS is_group_package BOOLEAN NOT NULL DEFAULT false;
