-- Admin notification 

ALTER TABLE leads
  ADD COLUMN source VARCHAR(20) NOT NULL DEFAULT 'website';

ALTER TABLE leads
  ADD CONSTRAINT leads_source_check CHECK (source IN ('website', 'contact', 'admin'));

COMMENT ON COLUMN leads.source IS
  'website = package enquiry form, contact = contact page, admin = entered by staff.';

UPDATE leads SET source = 'contact' WHERE message LIKE 'Subject: %';

CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  link TEXT,
  entity_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT admin_notifications_type_check
    CHECK (type IN ('lead', 'contact', 'review', 'system'))
);

CREATE INDEX idx_admin_notifications_created ON admin_notifications (created_at DESC);
CREATE INDEX idx_admin_notifications_unread ON admin_notifications (is_read) WHERE is_read = false;

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service_role on admin_notifications"
  ON admin_notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

REVOKE ALL ON TABLE admin_notifications FROM anon, authenticated;

-- ---------------------------------------------------------------- triggers --

CREATE OR REPLACE FUNCTION notify_admin_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.source = 'admin' THEN
    RETURN NEW;
  END IF;

  INSERT INTO admin_notifications (type, title, body, link, entity_id)
  VALUES (
    CASE WHEN NEW.source = 'contact' THEN 'contact' ELSE 'lead' END,
    CASE WHEN NEW.source = 'contact'
      THEN 'New contact enquiry from ' || NEW.name
      ELSE 'New lead from ' || NEW.name
    END,
    LEFT(COALESCE(NEW.message, NEW.email), 160),
    '/admin/leads',
    NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admin_new_lead
AFTER INSERT ON leads
FOR EACH ROW EXECUTE FUNCTION notify_admin_new_lead();

CREATE OR REPLACE FUNCTION notify_admin_new_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  package_title TEXT;
BEGIN
  SELECT title INTO package_title FROM packages WHERE id = NEW.package_id;

  INSERT INTO admin_notifications (type, title, body, link, entity_id)
  VALUES (
    'review',
    NEW.reviewer_name || ' reviewed ' || COALESCE(package_title, 'a package'),
    COALESCE(NEW.rating::text || '★ — ', '') || LEFT(COALESCE(NEW.review_text, ''), 160),
    '/admin/reviews',
    NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admin_new_review
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION notify_admin_new_review();
