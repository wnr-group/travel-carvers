ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS is_seasonal BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_packages_seasonal
  ON packages (is_seasonal) WHERE is_seasonal = true;

CREATE INDEX IF NOT EXISTS idx_packages_best_seller
  ON packages (is_best_seller) WHERE is_best_seller = true;
