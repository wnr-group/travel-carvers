import { supabaseAdmin } from '@/lib/supabase/server';
import type {
  CategoryFormOutput,
  CategoryUpdateOutput,
  SubcategoryFormData,
} from '@/lib/validations/category.schema';

/**
 * Get all active categories (Public)
 */
export async function getActiveCategories() {
  const { data, error } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
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
 * Get all subcategories (Public)
 */
export async function getActiveSubcategories() {
  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Admin: Get all categories (requires server-side)
 */
export async function getAllCategoriesAdmin() {

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Admin: Create category (requires server-side)
 */
export async function createCategory(categoryData: CategoryFormOutput) {

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Update category (requires server-side)
 */
export async function updateCategory(id: string, categoryData: CategoryUpdateOutput) {

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete category (requires server-side)
 *
 * Returns the deleted row, or null when no category had that id, so callers can
 * distinguish a successful delete from a no-op and respond with 404.
 */
export async function deleteCategory(id: string) {

  const { data, error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Admin: Get all subcategories (requires server-side)
 */
export async function getAllSubcategoriesAdmin() {

  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .select('*')
    .order('display_order', { ascending: true});

  if (error) throw error;
  return data;
}

/**
 * Admin: Create subcategory (requires server-side)
 */
export async function createSubcategory(subcategoryData: SubcategoryFormData) {

  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .insert(subcategoryData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Update subcategory (requires server-side)
 */
export async function updateSubcategory(id: string, subcategoryData: SubcategoryFormData) {

  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .update(subcategoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete subcategory (requires server-side)
 */
export async function deleteSubcategory(id: string) {

  const { error } = await supabaseAdmin
    .from('subcategories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
