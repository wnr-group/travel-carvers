import { supabaseAdmin } from '@/lib/supabase/server';
import type { Subcategory } from '@/lib/types/category';
import type {
  CategoryFormOutput,
  CategoryUpdateOutput,
  SubcategoryFormOutput,
  SubcategoryUpdateOutput,
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

interface SubcategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  icon_name: string | null;
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
      description,
      cover_image_url,
      icon_name,
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
    description: row.description,
    cover_image_url: row.cover_image_url,
    icon_name: row.icon_name,
    display_order: row.display_order ?? 0,
    is_active: row.is_active ?? true,
    category_ids: (row.category_subcategory ?? []).map((join) => join.category_id),
  }));
}

/**
 * Replace a subcategory's parent-category links with exactly `categoryIds`.
 */
async function replaceSubcategoryLinks(subcategoryId: string, categoryIds: string[]) {
  const { error: deleteError } = await supabaseAdmin
    .from('category_subcategory')
    .delete()
    .eq('subcategory_id', subcategoryId);

  if (deleteError) throw deleteError;

  if (categoryIds.length === 0) return;

  const { error: insertError } = await supabaseAdmin
    .from('category_subcategory')
    .insert(categoryIds.map((category_id) => ({ category_id, subcategory_id: subcategoryId })));

  if (insertError) throw insertError;
}

/**
 * Admin: Create subcategory together with its parent-category links.
 */
export async function createSubcategory(input: SubcategoryFormOutput): Promise<Subcategory> {
  const { category_ids, ...subcategoryData } = input;

  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .insert(subcategoryData)
    .select()
    .single();

  if (error) throw error;

  try {
    await replaceSubcategoryLinks(data.id, category_ids);
  } catch (linkError) {
    await supabaseAdmin.from('subcategories').delete().eq('id', data.id);
    throw linkError;
  }

  return { ...data, category_ids };
}

/**
 * Admin: Update subcategory and replace its parent-category links.
 *
 * Returns null when no subcategory has that id.
 */
export async function updateSubcategory(
  id: string,
  input: SubcategoryUpdateOutput
): Promise<Subcategory | null> {
  const { category_ids, ...subcategoryData } = input;

  const { data: existingLinks, error: linksError } = await supabaseAdmin
    .from('category_subcategory')
    .select('category_id')
    .eq('subcategory_id', id);

  if (linksError) throw linksError;

  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .update(subcategoryData)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  try {
    await replaceSubcategoryLinks(id, category_ids);
  } catch (linkError) {
    await supabaseAdmin
      .from('category_subcategory')
      .upsert(
        (existingLinks ?? []).map((link) => ({
          category_id: link.category_id,
          subcategory_id: id,
        })),
        { onConflict: 'category_id,subcategory_id', ignoreDuplicates: true }
      );
    throw linkError;
  }

  return { ...data, category_ids };
}

/**
 * Admin: Delete subcategory (requires server-side)
 */
export async function deleteSubcategory(id: string) {
  const { data, error } = await supabaseAdmin
    .from('subcategories')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  return data;
}
