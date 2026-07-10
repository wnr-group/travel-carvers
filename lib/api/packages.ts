import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Get all published packages (Public)
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

/**
 * Admin: Get all packages (requires server-side)
 */
export async function getAllPackagesAdmin() {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Admin: Create package (requires server-side)
 */
export async function createPackage(packageData: any) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .insert(packageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Update package (requires server-side)
 */
export async function updatePackage(id: string, packageData: any) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete package (requires server-side)
 */
export async function deletePackage(id: string) {
  const { error } = await supabaseAdmin
    .from('packages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
