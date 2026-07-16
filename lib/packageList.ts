/**
 * Shared list-card mapping for packages.
 */

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface TravelPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: string[];
  price: number; // 0 = "on request"
  durationDays: number;
  difficulty: Difficulty | null;
  rating: number; // 0 = no reviews yet
  popularity: number;
  image: string;
  location: string;
  createdAt: number; // epoch ms, for "newest" ordering
}

export const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Challenging',
};

/** Loosely-typed shape of a published-package row (the Supabase client is untyped). */
export interface RawListPackage {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  show_price?: boolean | null;
  duration_days?: number | null;
  difficulty_level?: string | null;
  destination_name?: string | null;
  view_count?: number | null;
  created_at?: string | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
  package_categories?: { categories: { name: string; slug: string } | null }[] | null;
}

export function mapPackage(row: RawListPackage): TravelPackage {
  const gallery = row.package_gallery ?? [];
  const cover = gallery.find((g) => g.is_cover) ?? gallery[0];
  const categories = (row.package_categories ?? [])
    .map((pc) => pc.categories?.name)
    .filter((name): name is string => Boolean(name));
  // Admins can hide a package's price from customers; price 0 renders as "On request".
  const priceHidden = row.show_price === false;
  const price =
    priceHidden || row.price_adult == null || row.price_adult === '' ? 0 : Number(row.price_adult);

  return {
    id: row.id,
    name: row.title,
    slug: row.slug,
    description: row.short_description ?? '',
    categories,
    price: Number.isNaN(price) ? 0 : price,
    durationDays: row.duration_days ?? 0,
    difficulty: row.difficulty_level ? DIFFICULTY_MAP[row.difficulty_level] ?? null : null,
    rating: 0,
    popularity: row.view_count ?? 0,
    image: cover?.image_url ?? `https://picsum.photos/seed/${row.slug}/480/320`,
    location: row.destination_name ?? '',
    createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  };
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}
