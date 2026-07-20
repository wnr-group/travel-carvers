import { supabase } from '@/lib/supabase/client';

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
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
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
        itinerary_day_images (
          image_url,
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
      travel_tips (
        tip_text,
        display_order
      ),
      best_time_to_visit (
        *
      ),
      places_to_visit (
        *
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get featured packages (Public)
 */
export async function getFeaturedPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      )
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
}

/**
 * Get trending packages (Public)
 */
export async function getTrendingPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      )
    `)
    .eq('status', 'published')
    .eq('is_trending', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
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
      package_categories!inner (
        category_id,
        categories (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .eq('package_categories.category_id', categoryId)
    .neq('id', packageId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
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
      package_categories!inner (
        category_id
      )
    `)
    .eq('status', 'published')
    .eq('package_categories.category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
