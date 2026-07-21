import { supabase } from '@/lib/supabase/client';
import { PUBLIC_PACKAGE_STATUSES } from '@/lib/types/package';

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

/** Fields the category / subcategory landing pages need — no heavy package embeds. */
export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  updated_at: string | null;
}

export interface SubcategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  icon_name: string | null;
}

/**
 * Get an active category by slug, without its packages (Public).
 * Returns null when the slug doesn't exist or the category is inactive.
 */
export async function getCategorySummary(slug: string): Promise<CategorySummary | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, cover_image_url, updated_at')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get an active subcategory by slug, but only if it is linked to the given
 * category (Public). Returns null otherwise — the caller treats that as a 404.
 */
export async function getSubcategorySummary(
  categoryId: string,
  slug: string
): Promise<SubcategorySummary | null> {
  const { data, error } = await supabase
    .from('subcategories')
    .select(
      'id, name, slug, description, cover_image_url, icon_name, category_subcategory!inner(category_id)'
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('category_subcategory.category_id', categoryId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { id, name, slug: subSlug, description, cover_image_url, icon_name } = data;
  return { id, name, slug: subSlug, description, cover_image_url, icon_name };
}

/**
 * Categories flagged for the header/navigation menu (Public), in display order.
 */
export async function getNavCategories(): Promise<{ name: string; slug: string }[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name, slug')
    .eq('is_active', true)
    .eq('show_in_nav', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * All active subcategories linked to a category (Public), in display order.
 */
export async function getSubcategoriesForCategory(
  categoryId: string
): Promise<SubcategorySummary[]> {
  const { data, error } = await supabase
    .from('subcategories')
    .select(
      'id, name, slug, description, cover_image_url, icon_name, category_subcategory!inner(category_id)'
    )
    .eq('is_active', true)
    .eq('category_subcategory.category_id', categoryId)
    .order('display_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(({ id, name, slug, description, cover_image_url, icon_name }) => ({
    id,
    name,
    slug,
    description,
    cover_image_url,
    icon_name,
  }));
}

/**
 * Published-package counts per subcategory (Public). Missing ids mean zero.
 */
export async function getSubcategoryPackageCounts(
  subcategoryIds: string[]
): Promise<Record<string, number>> {
  if (subcategoryIds.length === 0) return {};

  const { data, error } = await supabase
    .from('package_subcategories')
    .select('subcategory_id, packages!inner(id)')
    .in('packages.status', PUBLIC_PACKAGE_STATUSES)
    .in('subcategory_id', subcategoryIds);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.subcategory_id] = (counts[row.subcategory_id] ?? 0) + 1;
  }
  return counts;
}

/**
 * Published packages belonging to a category (Public), newest first.
 */
export async function getPublishedPackagesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover,
        display_order
      ),
      package_categories!inner (
        category_id
      )
    `)
    .eq('package_categories.category_id', categoryId)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Published packages tagged with a subcategory (Public), newest first.
 */
export async function getPublishedPackagesBySubcategory(subcategoryId: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover,
        display_order
      ),
      package_subcategories!inner (
        subcategory_id
      )
    `)
    .eq('package_subcategories.subcategory_id', subcategoryId)
    .in('status', PUBLIC_PACKAGE_STATUSES)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Every active category ↔ subcategory pair, for sitemap generation (Public).
 */
interface PairRow {
  categories: { slug: string; updated_at: string | null };
  subcategories: { slug: string; updated_at: string | null };
}

export async function getActiveCategorySubcategoryPairs(): Promise<
  { categorySlug: string; subcategorySlug: string; updatedAt: string | null }[]
> {
  const { data, error } = await supabase
    .from('category_subcategory')
    .select(`
      categories!inner ( slug, is_active, updated_at ),
      subcategories!inner ( slug, is_active, updated_at )
    `)
    .eq('categories.is_active', true)
    .eq('subcategories.is_active', true)
    .overrideTypes<PairRow[], { merge: false }>();

  if (error) throw error;

  return (data ?? []).map((row) => ({
    categorySlug: row.categories.slug,
    subcategorySlug: row.subcategories.slug,
    updatedAt: row.subcategories.updated_at ?? row.categories.updated_at,
  }));
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
