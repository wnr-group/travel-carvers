import { supabase } from '@/lib/supabase/client';
import type { DestinationMapPin, DestinationSummary } from '@/lib/types/destination';
import type { RawListPackage } from '@/lib/packageList';

const SUMMARY_FIELDS = `
  id,
  name,
  country,
  city,
  slug,
  hero_image_url,
  description,
  latitude,
  longitude,
  timezone,
  currency,
  languages,
  meta_title,
  meta_description,
  og_image,
  updated_at
`;

function toNumber(value: number | string | null): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

/**
 * Every active destination, for listing pages and the sitemap.
 */
export async function getActiveDestinations(): Promise<DestinationSummary[]> {
  const { data, error } = await supabase
    .from('destinations')
    .select(SUMMARY_FIELDS)
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    latitude: toNumber(row.latitude),
    longitude: toNumber(row.longitude),
  })) as DestinationSummary[];
}

/**
 * One destination by slug
 */
export async function getDestinationSummary(slug: string): Promise<DestinationSummary | null> {
  const { data, error } = await supabase
    .from('destinations')
    .select(SUMMARY_FIELDS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    latitude: toNumber(data.latitude),
    longitude: toNumber(data.longitude),
  } as DestinationSummary;
}

/**
 * Published packages linked to a destination.
 */
export async function getPublishedPackagesByDestination(
  destinationId: string
): Promise<RawListPackage[]> {
  interface LinkedPackageRow {
    packages: RawListPackage | null;
  }

  const { data, error } = await supabase
    .from('package_destinations')
    .select(`
      packages (
        id,
        title,
        slug,
        short_description,
        price_adult,
        show_price,
        duration_days,
        difficulty_level,
        destination_name,
        status,
        is_group_package,
        group_size_min,
        group_size_max,
        created_at,
        package_gallery (
          image_url,
          is_cover
        ),
        reviews (
          rating,
          is_approved
        ),
        package_categories (
          categories (
            name,
            slug
          )
        )
      )
    `)
    .eq('destination_id', destinationId)
    .overrideTypes<LinkedPackageRow[], { merge: false }>();

  if (error) throw error;

  // Ordering a to-one embed (`packages`) can't reorder the top-level
  // package_destinations rows, so sort newest-first in JS after mapping.
  return (data ?? [])
    .map((row) => row.packages)
    .filter((pkg): pkg is RawListPackage => pkg !== null)
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
    );
}

export async function getDestinationMapPins(): Promise<DestinationMapPin[]> {
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      id,
      name,
      slug,
      country,
      latitude,
      longitude,
      hero_image_url,
      timezone,
      currency,
      languages,
      description,
      package_destinations (
        package_id
      )
    `)
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const links = (row.package_destinations ?? []) as { package_id: string }[];

    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      country: row.country as string,
      latitude: toNumber(row.latitude as number | string | null),
      longitude: toNumber(row.longitude as number | string | null),
      hero_image_url: (row.hero_image_url as string | null) ?? null,
      package_count: links.length,
      timezone: (row.timezone as string | null) ?? null,
      currency: (row.currency as string | null) ?? null,
      languages: (row.languages as string | null) ?? null,
      description: (row.description as string | null) ?? null,
    };
  });
}
