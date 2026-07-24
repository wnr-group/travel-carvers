import { supabase } from '@/lib/supabase/client';

/**
 * Global pricing switch from Admin → Settings → Global Visibility.
 *
 * The two switches combine as an AND: a price is shown only when the global
 * switch is on AND the package's own `show_price` is on. So turning the global
 * switch off hides every price, and turning it back on does not reveal packages
 * that were individually set to hide their price.
 */

const TTL_MS = 60_000;

let cache: { value: boolean; at: number } | null = null;

export async function arePricesGloballyVisible(): Promise<boolean> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  const { data, error } = await supabase
    .from('site_settings')
    .select('show_prices_globally')
    .limit(1)
    .maybeSingle();

  // Fail open. A settings read that errors must not blank out every price on
  // the site; absent/NULL likewise means "show", matching the column default.
  const value = error ? true : data?.show_prices_globally !== false;

  cache = { value, at: Date.now() };
  return value;
}

/** Test/seed helper — drops the memoised value so the next read hits the DB. */
export function clearPricingVisibilityCache() {
  cache = null;
}

/** Admin-managed contact details, surfaced across the customer site. */
export interface PublicSiteSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
}

/**
 * Public read of the single site-settings row — the source of truth for the
 * contact details a client edits in Admin → Settings. Returns null on error or
 * when no row exists, so callers fall back gracefully rather than crash.
 */
export async function getSiteSettings(): Promise<PublicSiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select(
      'company_name, contact_email, contact_phone, address, facebook_url, instagram_url, twitter_url, linkedin_url'
    )
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as PublicSiteSettings;
}

type PricedRow = { show_price?: boolean | null };

/**
 * Folds the global switch into each row's own `show_price`.
 *
 * Every price surface (cards, detail page, search, JSON-LD) already renders
 * "On request" when `show_price` is false, so collapsing both switches into
 * that one field here means no downstream component needs to know the global
 * setting exists.
 */
export async function applyGlobalPricing<T extends PricedRow>(rows: T[]): Promise<T[]>;
export async function applyGlobalPricing<T extends PricedRow>(row: T | null): Promise<T | null>;
export async function applyGlobalPricing<T extends PricedRow>(
  input: T[] | T | null
): Promise<T[] | T | null> {
  if (input === null) return null;
  if (await arePricesGloballyVisible()) return input;

  return Array.isArray(input)
    ? input.map((row) => ({ ...row, show_price: false }))
    : { ...input, show_price: false };
}
