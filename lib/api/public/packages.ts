import { supabase } from '@/lib/supabase/client';
import { PUBLIC_PACKAGE_STATUSES } from '@/lib/types/package';
import { getPackageFlag, type PackageFlagKey } from '@/lib/packageFlags';
import { applyGlobalPricing } from './siteSettings';

/**
 * Public, client-safe package reads.
 */

export async function getPublishedPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover,
        display_order
      ),
      package_categories (
        categories (
          name,
          slug
        )
      ),
      reviews (
        rating,
        is_approved
      )
    `)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return applyGlobalPricing(data);
}

/**
 * Get single package by slug with all relations (Public)
 */
export async function getPackageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover,
        display_order
      ),
      package_videos (
        video_url,
        display_order
      ),
      package_categories (
        category_id
      ),
      itinerary_days (
        *,
        itinerary_entries (
          name,
          time_label,
          description,
          image_url,
          icon_name,
          display_order
        )
      ),
      package_inclusions (
        item_text,
        icon_name,
        is_included,
        display_order
      ),
      stay_details (
        *
      ),
      package_highlights (
        highlight_text,
        display_order
      ),
      travel_tips (
        tip_text,
        display_order
      ),
      best_time_to_visit (
        *
      ),
      places_to_visit (
        *
      ),
      cancellation_policies (
        window_label,
        refund_text,
        display_order
      ),
      required_documents (
        document_text,
        display_order
      )
    `)
    .eq('slug', slug)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .single();

  if (error) throw error;
  return applyGlobalPricing(data);
}

export async function getPackagesByFlag(flag: PackageFlagKey, limit?: number) {
  let query = supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      reviews (
        rating,
        is_approved
      )
    `)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .eq(getPackageFlag(flag).column, true)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return applyGlobalPricing(data);
}

/**
 * Get packages similar
 */
export async function getSimilarPackages(
  packageId: string,
  categoryId: string,
  limit = 4,
) {
  if (!packageId || !categoryId) return [];

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      reviews (
        rating,
        is_approved
      ),
      package_categories!inner (
        category_id,
        categories (
          name,
          slug
        )
      )
    `)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .eq('package_categories.category_id', categoryId)
    .neq('id', packageId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return applyGlobalPricing(data);
}


export async function getPackagesByCategorySlug(slug: string, limit?: number) {
  let query = supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      reviews (
        rating,
        is_approved
      ),
      package_categories!inner (
        categories!inner (
          slug
        )
      )
    `)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .eq('package_categories.categories.slug', slug)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return applyGlobalPricing(data);
}

interface GroupPackageRow {
  id: string;
  created_at?: string | null;
  [key: string]: unknown;
}

export async function getGroupPackages(
  categorySlug: string,
  limit?: number
): Promise<GroupPackageRow[]> {
  const [byCategory, byFlag] = await Promise.all([
    getPackagesByCategorySlug(categorySlug, limit).catch(() => []),
    getPackagesByFlag('group', limit).catch(() => []),
  ]);

  const merged = new Map<string, GroupPackageRow>();
  for (const row of [...(byCategory ?? []), ...(byFlag ?? [])] as GroupPackageRow[]) {
    if (!merged.has(row.id)) merged.set(row.id, row);
  }

  const rows = Array.from(merged.values()).sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );

  return limit ? rows.slice(0, limit) : rows;
}

/**
 * Get packages by category (Public)
 */
export async function getPackagesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      reviews (
        rating,
        is_approved
      ),
      package_categories!inner (
        category_id
      )
    `)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .eq('package_categories.category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return applyGlobalPricing(data);
}
