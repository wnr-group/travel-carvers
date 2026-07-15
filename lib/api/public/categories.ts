import { supabase } from '@/lib/supabase/client';

/**
 * Public, client-safe category reads.
 */

/**
 * Get all active categories (Public)
 */
export async function getActiveCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get category by slug with packages (Public)
 */
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      package_categories (
        packages (
          *,
          package_gallery (
            image_url,
            is_cover
          )
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all active subcategories (Public)
 */
export async function getActiveSubcategories() {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}
