
interface RawGalleryImage {
  image_url: string;
  is_cover?: boolean | null;
  display_order?: number | null;
}

interface RawItineraryDay {
  day_number: number;
  title?: string | null;
  morning_activity?: string | null;
  afternoon_activity?: string | null;
  evening_activity?: string | null;
}

interface RawInclusion {
  item_text: string;
  is_included?: boolean | null;
  display_order?: number | null;
}

interface RawTravelTip {
  tip_text: string;
  display_order?: number | null;
}

interface RawBestTime {
  month_start?: string | null;
  month_end?: string | null;
  description?: string | null;
  weather_condition?: string | null;
}

/** The subset of the joined package row the detail page consumes. */
export interface RawPackageDetail {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  price_adult?: number | string | null;
  price_child?: number | string | null;
  price_infant?: number | string | null;
  show_price?: boolean | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  group_size_min?: number | null;
  group_size_max?: number | null;
  age_restriction?: string | null;
  destination_name?: string | null;
  package_gallery?: RawGalleryImage[] | null;
  itinerary_days?: RawItineraryDay[] | null;
  package_inclusions?: RawInclusion[] | null;
  travel_tips?: RawTravelTip[] | null;
  best_time_to_visit?: RawBestTime[] | null;
}

export interface RawReview {
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  review_photos?: { image_url: string }[] | null;
}

interface RawSimilarPackage {
  slug: string;
  title: string;
  duration_days?: number | null;
  price_adult?: number | string | null;
  package_gallery?: RawGalleryImage[] | null;
}

/* ------------------------------- View-model -------------------------------- */

export interface ItineraryDayVM {
  n: number;
  title: string;
  desc: string;
}
export interface GalleryImageVM {
  src: string;
  alt: string;
}
export interface PricingTierVM {
  label: string;
  sub: string;
  price: number;
}
export interface ReviewVM {
  name: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
}
export interface RatingBucketVM {
  stars: number;
  pct: number;
}
export interface SimilarPackageVM {
  slug: string;
  title: string;
  duration: string;
  price: number | null;
  img: string;
}

export interface PackageDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  location: string;
  duration: string;
  groupSize: string;
  startingPrice: number | null;
  showPrice: boolean;
  cover: string;
  rating: number | null;
  reviewCount: number;
  highlights: string[];
  bestTime: string | null;
  itinerary: ItineraryDayVM[];
  inclusions: string[];
  exclusions: string[];
  gallery: GalleryImageVM[];
  pricingTiers: PricingTierVM[];
  reviews: ReviewVM[];
  ratingBreakdown: RatingBucketVM[];
  similar: SimilarPackageVM[];
}

/* -------------------------------- Helpers ---------------------------------- */

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function byOrder<T extends { display_order?: number | null }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

/** Cover image: explicit cover → first gallery image → deterministic placeholder. */
function coverOf(
  gallery: RawGalleryImage[] | null | undefined,
  slug: string,
  size = '1800/1000',
): string {
  const images = gallery ?? [];
  const cover = images.find((image) => image.is_cover) ?? images[0];
  return cover?.image_url ?? `https://picsum.photos/seed/${slug}/${size}`;
}

function durationLabel(days?: number | null, nights?: number | null): string {
  if (!days) return 'Flexible itinerary';
  return nights ? `${days} Days / ${nights} Nights` : `${days} Days`;
}

export function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/** Maps a raw review row (from the DB) to the view-model the UI renders. */
export function toReviewVM(review: RawReview): ReviewVM {
  return {
    name: review.reviewer_name,
    rating: review.rating,
    date: formatReviewDate(review.created_at),
    text: review.review_text,
    images: (review.review_photos ?? []).map((p) => p.image_url).filter(Boolean),
  };
}

/* --------------------------------- Mapper ---------------------------------- */

export function toPackageDetail(
  raw: RawPackageDetail,
  rawReviews: RawReview[] = [],
  rawSimilar: RawSimilarPackage[] = [],
): PackageDetail {
  // Group size / age
  const groupSize =
    raw.group_size_min && raw.group_size_max
      ? `${raw.group_size_min}–${raw.group_size_max} travellers`
      : raw.age_restriction || 'Flexible group size';

  // Itinerary — no altitude in the schema, so we render title + composed activities only.
  const itinerary: ItineraryDayVM[] = [...(raw.itinerary_days ?? [])]
    .sort((a, b) => a.day_number - b.day_number)
    .map((day) => ({
      n: day.day_number,
      title: day.title ?? `Day ${day.day_number}`,
      desc: [day.morning_activity, day.afternoon_activity, day.evening_activity]
        .filter((activity): activity is string => Boolean(activity && activity.trim()))
        .join(' '),
    }));

  // Inclusions / exclusions live in one table, told apart by `is_included`.
  const inclusionRows = byOrder(raw.package_inclusions ?? []);
  const inclusions = inclusionRows.filter((row) => row.is_included).map((row) => row.item_text);
  const exclusions = inclusionRows.filter((row) => !row.is_included).map((row) => row.item_text);

  // Highlights ← travel tips.
  const highlights = byOrder(raw.travel_tips ?? []).map((tip) => tip.tip_text);

  // Best time to go ← composed sentence from the season rows.
  const bestTimeParts = (raw.best_time_to_visit ?? [])
    .map((season) => {
      const range = [season.month_start, season.month_end].filter(Boolean).join(' – ');
      return [range, season.description].filter(Boolean).join(': ');
    })
    .filter(Boolean);
  const bestTime = bestTimeParts.length ? bestTimeParts.join(' · ') : null;

  // Gallery.
  const gallery: GalleryImageVM[] = byOrder(raw.package_gallery ?? []).map((image) => ({
    src: image.image_url,
    alt: raw.title,
  }));

  // Pricing tiers from the three price columns, when prices are shown.
  const showPrice = raw.show_price ?? true;
  const priceAdult = toNumber(raw.price_adult);
  const pricingTiers: PricingTierVM[] = [];
  if (showPrice) {
    const priceChild = toNumber(raw.price_child);
    const priceInfant = toNumber(raw.price_infant);
    if (priceAdult != null) pricingTiers.push({ label: 'Adult', sub: '12 yrs and above', price: priceAdult });
    if (priceChild != null) pricingTiers.push({ label: 'Child', sub: '5–11 yrs, sharing with adult', price: priceChild });
    if (priceInfant != null) pricingTiers.push({ label: 'Infant', sub: 'Under 5 yrs', price: priceInfant });
  }

  // Reviews + aggregate rating.
  const reviews: ReviewVM[] = rawReviews.map(toReviewVM);
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount) * 10) / 10
      : null;

  const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1] += 1;
  });
  const ratingBreakdown: RatingBucketVM[] = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: reviewCount ? Math.round((counts[stars - 1] / reviewCount) * 100) : 0,
  }));

  // Similar packages (other published packages).
  const similar: SimilarPackageVM[] = rawSimilar.slice(0, 3).map((pkg) => ({
    slug: pkg.slug,
    title: pkg.title,
    duration: durationLabel(pkg.duration_days, null),
    price: toNumber(pkg.price_adult),
    img: coverOf(pkg.package_gallery, pkg.slug, '700/500'),
  }));

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    tagline: raw.short_description ?? '',
    description: raw.full_description || raw.short_description || '',
    location: raw.destination_name ?? '',
    duration: durationLabel(raw.duration_days, raw.duration_nights),
    groupSize,
    startingPrice: priceAdult,
    showPrice,
    cover: coverOf(raw.package_gallery, raw.slug),
    rating,
    reviewCount,
    highlights,
    bestTime,
    itinerary,
    inclusions,
    exclusions,
    gallery,
    pricingTiers,
    reviews,
    ratingBreakdown,
    similar,
  };
}
