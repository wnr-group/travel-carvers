-- admins choose which categories appear in the customer header/navigation menu.

ALTER TABLE categories
  ADD COLUMN show_in_nav BOOLEAN NOT NULL DEFAULT false;
