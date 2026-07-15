import { supabaseAdmin } from '@/lib/supabase/server';
import type { Subcategory } from '@/lib/types/category';
import type {
  CategoryFormOutput,
  CategoryUpdateOutput,
  SubcategoryFormData,
} from '@/lib/validations/category.schema';


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
 * Returns the deleted row, or null when no category had that id
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


interface SubcategoryRow {
  id: string;
  name: string;
  slug: string;
  display_order: number | null;
  is_active: boolean | null;
  category_subcategory: { category_id: string }[] | null;
}

/**
 * Admin: Get every subcategory together with the categories it belongs to.
 */
export async function getSubcategoriesAdmin(): Promise<Subcategory[]> {
  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .select(`
      id,
      name,
      slug,
      display_order,
      is_active,
      category_subcategory (
        category_id
      )
    `)
    .order('display_order', { ascending: true })
    .overrideTypes<SubcategoryRow[], { merge: false }>();

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    display_order: row.display_order ?? 0,
    is_active: row.is_active ?? true,
    category_ids: (row.category_subcategory ?? []).map((join) => join.category_id),
  }));
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
