import { supabaseAdmin } from '@/lib/supabase/server';
import type { Destination } from '@/lib/types/destination';
import type {
  DestinationFormOutput,
  DestinationUpdateOutput,
} from '@/lib/validations/destination.schema';

/**
 * Admin destination reads and writes
 */

interface DestinationRow {
  id: string;
  name: string;
  country: string;
  city: string | null;
  slug: string;
  hero_image_url: string | null;
  description: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  timezone: string | null;
  currency: string | null;
  languages: string | null;
  is_featured: boolean | null;
  is_popular: boolean | null;
  is_active: boolean | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
  package_destinations: { package_id: string }[] | null;
}

const DESTINATION_SELECT = `
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
  is_featured,
  is_popular,
  is_active,
  meta_title,
  meta_description,
  og_image,
  created_at,
  updated_at,
  package_destinations (
    package_id
  )
`;

function toDestination(row: DestinationRow): Destination {
  const packageIds = (row.package_destinations ?? []).map((link) => link.package_id);

  return {
    id: row.id,
    name: row.name,
    country: row.country,
    city: row.city,
    slug: row.slug,
    hero_image_url: row.hero_image_url,
    description: row.description,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    timezone: row.timezone,
    currency: row.currency,
    languages: row.languages,
    is_featured: row.is_featured ?? false,
    is_popular: row.is_popular ?? false,
    is_active: row.is_active ?? true,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    og_image: row.og_image,
    created_at: row.created_at,
    updated_at: row.updated_at,
    package_ids: packageIds,
    package_count: packageIds.length,
  };
}

/**
 * Admin: every destination, with its linked package ids.
 */
export async function getDestinations(): Promise<Destination[]> {
  const { data, error } = await supabaseAdmin
    .from('destinations')
    .select(DESTINATION_SELECT)
    .order('name', { ascending: true })
    .overrideTypes<DestinationRow[], { merge: false }>();

  if (error) throw error;
  return (data ?? []).map(toDestination);
}

/**
 * Admin: a single destination by slug
 */
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const { data, error } = await supabaseAdmin
    .from('destinations')
    .select(DESTINATION_SELECT)
    .eq('slug', slug)
    .maybeSingle()
    .overrideTypes<DestinationRow, { merge: false }>();

  if (error) throw error;
  return data ? toDestination(data) : null;
}

/**
 * Replace a destination's package links with exactly `packageIds`.
 */
async function replacePackageLinks(destinationId: string, packageIds: string[]) {
  const { error: deleteError } = await supabaseAdmin
    .from('package_destinations')
    .delete()
    .eq('destination_id', destinationId);

  if (deleteError) throw deleteError;

  if (packageIds.length === 0) return;

  const { error: insertError } = await supabaseAdmin
    .from('package_destinations')
    .insert(packageIds.map((package_id) => ({ destination_id: destinationId, package_id })));

  if (insertError) throw insertError;
}

/**
 * Admin: create a destination together with its package links.
 */
export async function createDestination(input: DestinationFormOutput): Promise<Destination> {
  const { package_ids, ...destinationData } = input;

  const { data, error } = await supabaseAdmin
    .from('destinations')
    .insert(destinationData)
    .select(DESTINATION_SELECT)
    .single()
    .overrideTypes<DestinationRow, { merge: false }>();

  if (error) throw error;

  try {
    await replacePackageLinks(data.id, package_ids);
  } catch (linkError) {
    await supabaseAdmin.from('destinations').delete().eq('id', data.id);
    throw linkError;
  }

  return { ...toDestination(data), package_ids, package_count: package_ids.length };
}

/**
 * Admin: update a destination and replace its package links.
 */
export async function updateDestination(
  id: string,
  input: DestinationUpdateOutput
): Promise<Destination | null> {
  const { package_ids, ...destinationData } = input;

  const { data: existingLinks, error: linksError } = await supabaseAdmin
    .from('package_destinations')
    .select('package_id')
    .eq('destination_id', id);

  if (linksError) throw linksError;

  const { data, error } = await supabaseAdmin
    .from('destinations')
    .update({ ...destinationData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(DESTINATION_SELECT)
    .maybeSingle()
    .overrideTypes<DestinationRow, { merge: false }>();

  if (error) throw error;
  if (!data) return null;

  try {
    await replacePackageLinks(id, package_ids);
  } catch (linkError) {
    await supabaseAdmin.from('package_destinations').upsert(
      (existingLinks ?? []).map((link) => ({
        destination_id: id,
        package_id: link.package_id,
      })),
      { onConflict: 'package_id,destination_id', ignoreDuplicates: true }
    );
    throw linkError;
  }

  return { ...toDestination(data), package_ids, package_count: package_ids.length };
}

/**
 * Admin: delete a destination
 */
export async function deleteDestination(id: string) {
  const { data, error } = await supabaseAdmin
    .from('destinations')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Admin: the package ids linked to a destination.
 */
export async function getDestinationPackages(destinationId: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('package_destinations')
    .select('package_id')
    .eq('destination_id', destinationId);

  if (error) throw error;
  return (data ?? []).map((row) => row.package_id as string);
}

/**
 * Admin: link one package to a destination.
 */
export async function linkPackageToDestination(destinationId: string, packageId: string) {
  const { error } = await supabaseAdmin
    .from('package_destinations')
    .upsert(
      { destination_id: destinationId, package_id: packageId },
      { onConflict: 'package_id,destination_id', ignoreDuplicates: true }
    );

  if (error) throw error;
}

export async function unlinkPackageFromDestination(destinationId: string, packageId: string) {
  const { error } = await supabaseAdmin
    .from('package_destinations')
    .delete()
    .eq('destination_id', destinationId)
    .eq('package_id', packageId);

  if (error) throw error;
}
