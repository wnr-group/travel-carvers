import { supabase } from '@/lib/supabase/client';

/**
 * Public, client-safe package reads.
 */

export interface GetPublishedPackagesFilters {
  priceMin?: number;
  priceMax?: number;
  duration?: string;
  categories?: string[];
  search?: string;
}

export async function getPublishedPackages(filters?: GetPublishedPackagesFilters) {
  let query = supabase
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
    .eq('status', 'published');

  if (filters) {
    if (filters.priceMin !== undefined) {
      query = query.gte('price_adult', filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      query = query.lte('price_adult', filters.priceMax);
    }
    if (filters.duration && filters.duration !== 'any') {
      if (filters.duration === '1-3') {
        query = query.gte('duration_days', 1).lte('duration_days', 3);
      } else if (filters.duration === '4-7') {
        query = query.gte('duration_days', 4).lte('duration_days', 7);
      } else if (filters.duration === '8+') {
        query = query.gte('duration_days', 8);
      }
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,destination_name.ilike.%${filters.search}%`);
    }
  }

  query = query.order('created_at', { ascending: false });

  let { data, error } = await query;
  if (error) throw error;

  if (filters?.categories && filters.categories.length > 0) {
    data = data?.filter((row: any) => {
      const rowCategories = (row.package_categories ?? [])
        .map((pc: any) => pc.categories?.name)
        .filter(Boolean);
      return rowCategories.some((c: string) => filters.categories?.includes(c));
    }) ?? null;
  }

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
