ALTER TABLE trust_badges
  ADD COLUMN badge_type VARCHAR(10) NOT NULL DEFAULT 'stat';

ALTER TABLE trust_badges
  ADD CONSTRAINT trust_badges_badge_type_check CHECK (badge_type IN ('stat', 'text'));

COMMENT ON COLUMN trust_badges.badge_type IS
  'stat = icon + leading number + label; text = button-sized pill, label only.';

UPDATE trust_badges
SET badge_type = CASE
  WHEN split_part(trust_badges.text, ' ', 1) ~ '[0-9+%]'
   AND position(' ' IN trust_badges.text) > 0
  THEN 'stat'
  ELSE 'text'
END;
