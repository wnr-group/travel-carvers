/**
 * Shared list-card mapping for packages.
 */

import { packageFlagsOf, type PackageFlagKey, type PackageFlagRow } from '@/lib/packageFlags';

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
  isFeatured: boolean; // admin-flagged; floats to the top of "best match"
  isSoldOut: boolean;
  groupSize: string | null;
  flags: PackageFlagKey[]; 
}

export const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Challenging',
};

/** Loosely-typed shape of a published-package row (the Supabase client is untyped). */
export interface RawListPackage extends PackageFlagRow {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  show_price?: boolean | null;
  duration_days?: number | null;
  difficulty_level?: string | null;
  destination_name?: string | null;
  is_featured?: boolean | null;
  is_group_package?: boolean | null;
  group_size_min?: number | null;
  group_size_max?: number | null;
  status?: string | null;
  view_count?: number | null;
  created_at?: string | null;
  reviews?: { rating: number | null; is_approved: boolean | null }[] | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
  package_categories?: { categories: { name: string; slug: string } | null }[] | null;
}

export function groupSizeLabel(row: RawListPackage): string | null {
  if (!row.is_group_package) return null;

  const min = row.group_size_min ?? null;
  const max = row.group_size_max ?? null;

  if (min && max) return `${min}–${max} travellers`;
  if (max) return `Up to ${max} travellers`;
  if (min) return `${min}+ travellers`;
  return 'Small group';
}

export function mapPackage(row: RawListPackage): TravelPackage {
  const gallery = row.package_gallery ?? [];
  const cover = gallery.find((g) => g.is_cover) ?? gallery[0];
  const categories = (row.package_categories ?? [])
    .map((pc) => pc.categories?.name)
    .filter((name): name is string => Boolean(name));
  const priceHidden = row.show_price === false;
  const price =
    priceHidden || row.price_adult == null || row.price_adult === '' ? 0 : Number(row.price_adult);

  // Average rating over *approved* reviews only (mirrors toPackageDetail); 0 = no reviews yet.
  const approvedRatings = (row.reviews ?? [])
    .filter((r) => r.is_approved === true && r.rating != null)
    .map((r) => r.rating as number);
  const rating =
    approvedRatings.length > 0
      ? Math.round((approvedRatings.reduce((sum, r) => sum + r, 0) / approvedRatings.length) * 10) / 10
      : 0;

  return {
    id: row.id,
    name: row.title,
    slug: row.slug,
    description: row.short_description ?? '',
    categories,
    price: Number.isNaN(price) ? 0 : price,
    durationDays: row.duration_days ?? 0,
    difficulty: row.difficulty_level ? DIFFICULTY_MAP[row.difficulty_level] ?? null : null,
    rating,
    popularity: row.view_count ?? 0,
    image: cover?.image_url ?? '/package-placeholder.jpg',
    location: row.destination_name ?? '',
    createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    isFeatured: row.is_featured ?? false,
    isSoldOut: row.status === 'sold_out',
    groupSize: groupSizeLabel(row),
    flags: packageFlagsOf(row),
  };
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}
