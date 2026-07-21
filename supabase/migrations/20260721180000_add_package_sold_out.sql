-- Sold-out packages 

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN NOT NULL DEFAULT false;
