import { supabase } from '@/lib/supabase/client';
import { PUBLIC_PACKAGE_STATUSES } from '@/lib/types/package';

export interface PackageSearchResult {
  id: string;
  title: string;
  slug: string;
  destination_name: string | null;
  duration_days: number | null;
  price_adult: number | string | null;
  show_price: boolean | null;
}

export interface CategorySearchResult {
  id: string;
  name: string;
  slug: string;
}

export interface DestinationSearchResult {
  name: string;
}

export interface GlobalSearchResults {
  packages: PackageSearchResult[];
  categories: CategorySearchResult[];
  destinations: DestinationSearchResult[];
}

const PACKAGE_LIMIT = 6;
const CATEGORY_LIMIT = 5;
const DESTINATION_LIMIT = 5;

function sanitizeTerm(query: string): string {
  return query
    .replace(/[,()]/g, ' ')
    .replace(/[%_\\]/g, '\\$&')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function searchSite(query: string): Promise<GlobalSearchResults> {
  const term = sanitizeTerm(query);
  if (!term) return { packages: [], categories: [], destinations: [] };

  const pattern = `%${term}%`;

  const [packagesRes, categoriesRes, destinationsRes] = await Promise.all([
    supabase
      .from('packages')
      .select('id, title, slug, destination_name, duration_days, price_adult, show_price')
      .in('status', PUBLIC_PACKAGE_STATUSES)
      .or(`title.ilike.${pattern},short_description.ilike.${pattern}`)
      .order('created_at', { ascending: false })
      .limit(PACKAGE_LIMIT),

    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .ilike('name', pattern)
      .order('display_order', { ascending: true })
      .limit(CATEGORY_LIMIT),

    // Over-fetch a little so deduplication still yields enough distinct names;
    // ordered so identical searches always surface the same destinations.
    supabase
      .from('packages')
      .select('destination_name')
      .in('status', PUBLIC_PACKAGE_STATUSES)
      .not('destination_name', 'is', null)
      .ilike('destination_name', pattern)
      .order('destination_name', { ascending: true })
      .limit(DESTINATION_LIMIT * 4),
  ]);

  const failed = packagesRes.error ?? categoriesRes.error ?? destinationsRes.error;
  if (failed) throw failed;

  const seen = new Set<string>();
  const destinations: DestinationSearchResult[] = [];
  for (const row of destinationsRes.data ?? []) {
    const name = (row.destination_name ?? '').trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    destinations.push({ name });
    if (destinations.length >= DESTINATION_LIMIT) break;
  }

  return {
    packages: packagesRes.data ?? [],
    categories: categoriesRes.data ?? [],
    destinations,
  };
}
