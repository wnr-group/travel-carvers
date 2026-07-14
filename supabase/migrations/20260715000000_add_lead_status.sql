-- Add status field to leads table for tracking lead lifecycle
-- Status: new (default) -> contacted -> qualified -> converted

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new'
  CHECK (status IN ('new', 'contacted', 'qualified', 'converted'));

-- Add index for filtering leads by status
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Add comment for clarity
COMMENT ON COLUMN leads.status IS 'Tracks lead lifecycle: new -> contacted -> qualified -> converted';
