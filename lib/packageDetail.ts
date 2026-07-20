
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
  breakfast?: boolean | null;
  lunch?: boolean | null;
  dinner?: boolean | null;
  itinerary_day_images?: RawGalleryImage[] | null;
}

interface RawInclusion {
  item_text: string;
  icon_name?: string | null;
  is_included?: boolean | null;
  display_order?: number | null;
}

interface RawVideo {
  video_url: string;
  display_order?: number | null;
}

interface RawStay {
  hotel_name: string;
  location?: string | null;
  rating?: number | null;
  room_type?: string | null;
  amenities?: string[] | null;
  image_url?: string | null;
  check_in_date?: string | null;
  check_out_date?: string | null;
  display_order?: number | null;
}

interface RawPlace {
  place_name: string;
  description?: string | null;
  distance_from_hotel?: string | null;
  entry_fee?: string | null;
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
  package_categories?: { category_id: string }[] | null;
  package_gallery?: RawGalleryImage[] | null;
  package_videos?: RawVideo[] | null;
  itinerary_days?: RawItineraryDay[] | null;
  package_inclusions?: RawInclusion[] | null;
  stay_details?: RawStay[] | null;
  travel_tips?: RawTravelTip[] | null;
  best_time_to_visit?: RawBestTime[] | null;
  places_to_visit?: RawPlace[] | null;
}

export interface RawReview {
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

/* ------------------------------- View-model -------------------------------- */

/** A single time-of-day activity block within a day. */
export interface ItineraryActivityVM {
  /** "Morning" | "Afternoon" | "Evening". */
  label: string;
  text: string;
}
export interface ItineraryDayVM {
  n: number;
  title: string;
  activities: ItineraryActivityVM[];
  meals: string[];
  images: string[];
}
export interface GalleryImageVM {
  src: string;
  alt: string;
}
/** An inclusion or exclusion line; `icon` is the admin-chosen lucide icon name. */
export interface InclusionVM {
  text: string;
  icon: string | null;
}
export interface StayVM {
  name: string;
  location: string | null;
  rating: number | null;
  roomType: string | null;
  amenities: string[];
  image: string | null;
  checkIn: string | null;
  checkOut: string | null;
}
export interface PlaceVM {
  name: string;
  description: string | null;
  distance: string | null;
  entryFee: string | null;
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
}
export interface RatingBucketVM {
  stars: number;
  pct: number;
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
  inclusions: InclusionVM[];
  exclusions: InclusionVM[];
  gallery: GalleryImageVM[];
  videos: string[];
  stays: StayVM[];
  places: PlaceVM[];
  pricingTiers: PricingTierVM[];
  reviews: ReviewVM[];
  ratingBreakdown: RatingBucketVM[];
  /** Primary category, used to fetch similar packages client-side. Null when uncategorised. */
  categoryId: string | null;
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

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/** Meal booleans on an itinerary day, in the order the admin editor lists them. */
const MEAL_LABELS: { key: 'breakfast' | 'lunch' | 'dinner'; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
];

/** Activity columns on an itinerary day, kept segmented instead of concatenated. */
const ACTIVITY_FIELDS: { key: 'morning_activity' | 'afternoon_activity' | 'evening_activity'; label: string }[] = [
  { key: 'morning_activity', label: 'Morning' },
  { key: 'afternoon_activity', label: 'Afternoon' },
  { key: 'evening_activity', label: 'Evening' },
];

/* --------------------------------- Mapper ---------------------------------- */

export function toPackageDetail(
  raw: RawPackageDetail,
  rawReviews: RawReview[] = [],
): PackageDetail {
  // Group size / age
  const groupSize =
    raw.group_size_min && raw.group_size_max
      ? `${raw.group_size_min}–${raw.group_size_max} travellers`
      : raw.age_restriction || 'Flexible group size';

  // Itinerary — title + composed activities, plus the day's meals and images.
  const itinerary: ItineraryDayVM[] = [...(raw.itinerary_days ?? [])]
    .sort((a, b) => a.day_number - b.day_number)
    .map((day) => ({
      n: day.day_number,
      title: day.title ?? `Day ${day.day_number}`,
      activities: ACTIVITY_FIELDS
        .map(({ key, label }) => ({ label, text: (day[key] ?? '').trim() }))
        .filter((activity) => activity.text.length > 0),
      meals: MEAL_LABELS.filter(({ key }) => day[key]).map(({ label }) => label),
      images: byOrder(day.itinerary_day_images ?? []).map((image) => image.image_url),
    }));

  // Inclusions / exclusions
  const inclusionRows = byOrder(raw.package_inclusions ?? []);
  const toInclusion = (row: RawInclusion): InclusionVM => ({
    text: row.item_text,
    icon: row.icon_name ?? null,
  });
  const inclusions = inclusionRows.filter((row) => row.is_included).map(toInclusion);
  const exclusions = inclusionRows.filter((row) => !row.is_included).map(toInclusion);

  // Highlights ← travel tips.
  const highlights = byOrder(raw.travel_tips ?? []).map((tip) => tip.tip_text);

  // Best time to go ← composed sentence from the season rows (with weather).
  const bestTimeParts = (raw.best_time_to_visit ?? [])
    .map((season) => {
      const range = [season.month_start, season.month_end].filter(Boolean).join(' – ');
      const detail = [season.description, season.weather_condition].filter(Boolean).join(' — ');
      return [range, detail].filter(Boolean).join(': ');
    })
    .filter(Boolean);
  const bestTime = bestTimeParts.length ? bestTimeParts.join(' · ') : null;

  // Videos ← admin-managed YouTube links, in display order.
  const videos = byOrder(raw.package_videos ?? []).map((video) => video.video_url);

  // Stay details ← one card per hotel, in the order guests stay in them.
  const stays: StayVM[] = byOrder(raw.stay_details ?? []).map((hotel) => ({
    name: hotel.hotel_name,
    location: hotel.location ?? null,
    rating: hotel.rating ?? null,
    roomType: hotel.room_type ?? null,
    amenities: hotel.amenities ?? [],
    image: hotel.image_url ?? null,
    checkIn: hotel.check_in_date ?? null,
    checkOut: hotel.check_out_date ?? null,
  }));

  // Places to visit ← no display_order column, so kept in the returned order.
  const places: PlaceVM[] = (raw.places_to_visit ?? []).map((place) => ({
    name: place.place_name,
    description: place.description ?? null,
    distance: place.distance_from_hotel ?? null,
    entryFee: place.entry_fee ?? null,
  }));

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
  const reviews: ReviewVM[] = rawReviews.map((review) => ({
    name: review.reviewer_name,
    rating: review.rating,
    date: formatReviewDate(review.created_at),
    text: review.review_text,
  }));
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

  // Primary category id — the similar-packages section fetches siblings from it.
  const categoryId = raw.package_categories?.find((pc) => pc.category_id)?.category_id ?? null;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    tagline: raw.short_description ?? '',
    description: raw.full_description || raw.short_description || '',
    location: raw.destination_name ?? '',
    duration: durationLabel(raw.duration_days, raw.duration_nights),
    groupSize,
    // Hidden price ⇒ null, so every "From ₹…" surface falls back to "On request".
    startingPrice: showPrice ? priceAdult : null,
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
    videos,
    stays,
    places,
    pricingTiers,
    reviews,
    ratingBreakdown,
    categoryId,
  };
}
