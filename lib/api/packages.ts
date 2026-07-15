import { supabaseAdmin } from '@/lib/supabase/server';
import type { AdminPackage, PackageCategoryRef, PackageStatus } from '@/lib/types/package';
import type {
  PackageFilters,
  PackageFormInput,
  PackageFormOutput,
  PackageRecordInput,
  PackageRelations,
  PackageUpdateOutput,
} from '@/lib/validations/package.schema';

interface AdminPackageRow {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  status: PackageStatus;
  price_adult: number | string | null;
  view_count: number | null;
  created_at: string;
  package_gallery: { image_url: string; is_cover: boolean | null }[] | null;
  package_categories: { categories: PackageCategoryRef | null }[] | null;
}

export async function getPackagesAdmin(filters: PackageFilters = {}): Promise<AdminPackage[]> {
  const { status, search, category } = filters;
  let packageIds: string[] | null = null;

  if (category) {
    const { data: joins, error: joinError } = await supabaseAdmin
      .from('package_categories')
      .select('package_id')
      .eq('category_id', category);

    if (joinError) throw joinError;

    packageIds = (joins ?? []).map((row) => row.package_id as string);
    if (packageIds.length === 0) return [];
  }

  let query = supabaseAdmin
    .from('packages')
    .select(`
      id,
      title,
      slug,
      short_description,
      status,
      price_adult,
      view_count,
      created_at,
      package_gallery (
        image_url,
        is_cover
      ),
      package_categories (
        categories (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('title', `%${escapeLikePattern(search)}%`);
  if (packageIds) query = query.in('id', packageIds);

  const { data, error } = await query.overrideTypes<AdminPackageRow[], { merge: false }>();

  if (error) throw error;

  return (data ?? []).map(toAdminPackage);
}

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function toAdminPackage(row: AdminPackageRow): AdminPackage {
  const gallery = row.package_gallery ?? [];
  const cover = gallery.find((image) => image.is_cover) ?? gallery[0];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description,
    status: row.status,
    price_adult: row.price_adult === null ? null : Number(row.price_adult),
    view_count: row.view_count ?? 0,
    created_at: row.created_at,
    cover_image_url: cover?.image_url ?? null,
    categories: (row.package_categories ?? [])
      .map((join) => join.categories)
      .filter((category): category is PackageCategoryRef => category !== null),
  };
}

/**
 * Admin: Create package (requires server-side)
 */
export async function createPackage(packageData: PackageRecordInput) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .insert(packageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Insert rows into a child table
 */
async function insertRows(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;

  const { error } = await supabaseAdmin.from(table).insert(rows);
  if (error) throw error;
}

/**
 * Insert everything that hangs off a package.
 */
async function insertPackageRelations(packageId: string, input: PackageRelations) {
  await Promise.all([
    insertRows(
      'package_categories',
      input.category_ids.map((category_id) => ({ package_id: packageId, category_id }))
    ),

    insertRows(
      'package_subcategories',
      (input.subcategory_ids ?? []).map((subcategory_id) => ({
        package_id: packageId,
        subcategory_id,
      }))
    ),

    insertRows(
      'package_gallery',
      (input.gallery_images ?? []).map((image) => ({
        package_id: packageId,
        image_url: image.url,
        is_cover: image.is_cover,
        display_order: image.display_order,
      }))
    ),

    // The form holds videos as a bare list of URLs, so their order *is* their array position.
    insertRows(
      'package_videos',
      (input.video_urls ?? []).map((video_url, index) => ({
        package_id: packageId,
        video_url,
        display_order: index,
      }))
    ),

    // Inclusions and exclusions are one table, told apart by `is_included`.
    insertRows('package_inclusions', [
      ...(input.inclusions ?? []).map((item) => ({
        package_id: packageId,
        item_text: item.text,
        icon_name: item.icon,
        is_included: true,
        display_order: item.display_order,
      })),
      ...(input.exclusions ?? []).map((item) => ({
        package_id: packageId,
        item_text: item.text,
        icon_name: item.icon,
        is_included: false,
        display_order: item.display_order,
      })),
    ]),

    insertRows(
      'stay_details',
      (input.stay_details ?? []).map((hotel) => ({
        package_id: packageId,
        hotel_name: hotel.hotel_name,
        location: hotel.location,
        rating: hotel.rating,
        room_type: hotel.room_type,
        amenities: hotel.amenities,
        image_url: hotel.image_url,
        check_in_date: hotel.check_in_date,
        check_out_date: hotel.check_out_date,
        display_order: hotel.display_order,
      }))
    ),

    insertRows(
      'travel_tips',
      (input.travel_tips ?? []).map((tip) => ({
        package_id: packageId,
        tip_text: tip.tip,
        display_order: tip.display_order,
      }))
    ),

    insertRows(
      'best_time_to_visit',
      (input.best_time_to_visit ?? []).map((period) => ({
        package_id: packageId,
        month_start: period.month_start,
        month_end: period.month_end,
        description: period.description,
        weather_condition: period.weather_condition,
      }))
    ),

    insertRows(
      'places_to_visit',
      (input.places_to_visit ?? []).map((place) => ({
        package_id: packageId,
        place_name: place.place_name,
        description: place.description,
        distance_from_hotel: place.distance_from_hotel,
        entry_fee: place.entry_fee,
      }))
    ),

    insertItineraryDays(packageId, input),
  ]);
}

/**
 * Itinerary days, then their images.
 */
async function insertItineraryDays(packageId: string, input: PackageRelations) {
  const days = input.itinerary_days ?? [];
  if (days.length === 0) return;

  const { data: inserted, error } = await supabaseAdmin
    .from('itinerary_days')
    .insert(
      days.map((day) => ({
        package_id: packageId,
        day_number: day.day_number,
        title: day.title,
        morning_activity: day.morning_activity,
        afternoon_activity: day.afternoon_activity,
        evening_activity: day.evening_activity,
        breakfast: day.breakfast,
        lunch: day.lunch,
        dinner: day.dinner,
      }))
    )
    .select('id, day_number');

  if (error) throw error;

  const idByDayNumber = new Map<number, string>(
    (inserted ?? []).map((row) => [row.day_number as number, row.id as string])
  );

  const images = days.flatMap((day) => {
    const dayId = idByDayNumber.get(day.day_number);
    if (!dayId) return [];

    return (day.images ?? []).map((image_url, index) => ({
      itinerary_day_id: dayId,
      image_url,
      display_order: index,
    }));
  });

  await insertRows('itinerary_day_images', images);
}

/**
 * The form fields that live in other tables. Everything else is a column on `packages`.
 */
const RELATION_KEYS = [
  'category_ids',
  'subcategory_ids',
  'gallery_images',
  'video_urls',
  'itinerary_days',
  'inclusions',
  'exclusions',
  'stay_details',
  'travel_tips',
  'best_time_to_visit',
  'places_to_visit',
] as const satisfies readonly (keyof PackageRelations)[];

type RelationKey = (typeof RELATION_KEYS)[number];

/**
 * Peel the relations off a form payload, leaving just the `packages` columns.
 */
function stripRelations<T extends PackageRelations>(input: T): Omit<T, RelationKey> {
  const row: Record<string, unknown> = { ...input };
  for (const key of RELATION_KEYS) delete row[key];
  return row as Omit<T, RelationKey>;
}

/**
 * Admin: Create a package and everything attached to it.
 */
export async function createPackageWithRelations(
  input: PackageFormOutput
): Promise<{ id: string }> {
  const packageRow = stripRelations(input);

  const { data, error } = await supabaseAdmin
    .from('packages')
    .insert(packageRow satisfies PackageRecordInput)
    .select('id')
    .single();

  if (error) throw error;

  const packageId = data.id as string;

  try {
    await insertPackageRelations(packageId, input);
  } catch (relationError) {
    await supabaseAdmin.from('packages').delete().eq('id', packageId);
    throw relationError;
  }

  return { id: packageId };
}

/**
 * Admin: Update package (requires server-side)
 */
export async function updatePackage(id: string, packageData: Partial<PackageRecordInput>) {
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


// Editing a package
const CHILD_TABLES = [
  'package_categories',
  'package_subcategories',
  'package_gallery',
  'package_videos',
  'package_inclusions',
  'stay_details',
  'travel_tips',
  'best_time_to_visit',
  'places_to_visit',
  'itinerary_days',
] as const;

type ChildRow = Record<string, unknown>;
type RelationSnapshot = Record<string, ChildRow[]>;

function byDisplayOrder<T extends { display_order?: number | null }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function getPackageForEdit(id: string): Promise<PackageFormInput | null> {
  const { data: pkg, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!pkg) return null;

  const [
    categories,
    subcategories,
    gallery,
    videos,
    inclusionRows,
    stays,
    tips,
    seasons,
    places,
    days,
  ] = await Promise.all(
    CHILD_TABLES.map(async (table) => {
      const { data, error: childError } = await supabaseAdmin
        .from(table)
        .select('*')
        .eq('package_id', id);

      if (childError) throw childError;
      return (data ?? []) as ChildRow[];
    })
  );

  const dayIds = days.map((day) => day.id as string);
  let dayImages: ChildRow[] = [];

  if (dayIds.length > 0) {
    const { data, error: imageError } = await supabaseAdmin
      .from('itinerary_day_images')
      .select('*')
      .in('itinerary_day_id', dayIds);

    if (imageError) throw imageError;
    dayImages = (data ?? []) as ChildRow[];
  }

  const inclusions = inclusionRows.filter((row) => row.is_included);
  const exclusions = inclusionRows.filter((row) => !row.is_included);

  const toChecklist = (rows: ChildRow[]) =>
    byDisplayOrder(rows as { display_order?: number | null }[]).map((row) => {
      const item = row as ChildRow;
      return {
        text: (item.item_text as string) ?? '',
        icon: (item.icon_name as string) ?? '',
        display_order: (item.display_order as number) ?? 0,
      };
    });

  return {
    title: pkg.title,
    slug: pkg.slug,
    short_description: pkg.short_description ?? '',
    full_description: pkg.full_description ?? '',
    status: pkg.status ?? 'draft',
    is_featured: pkg.is_featured ?? false,
    is_trending: pkg.is_trending ?? false,
    is_new: pkg.is_new ?? false,

    // Postgres `numeric` can arrive as a string; the form's number inputs need real numbers.
    price_adult: pkg.price_adult === null ? undefined : Number(pkg.price_adult),
    price_child: pkg.price_child === null ? undefined : Number(pkg.price_child),
    price_infant: pkg.price_infant === null ? undefined : Number(pkg.price_infant),
    show_price: pkg.show_price ?? true,

    duration_days: pkg.duration_days,
    duration_nights: pkg.duration_nights,

    difficulty_level: pkg.difficulty_level ?? undefined,
    group_size_min: pkg.group_size_min ?? undefined,
    group_size_max: pkg.group_size_max ?? undefined,
    age_restriction: pkg.age_restriction ?? '',

    destination_name: pkg.destination_name ?? '',
    main_destination_lat:
      pkg.main_destination_lat === null ? undefined : Number(pkg.main_destination_lat),
    main_destination_lng:
      pkg.main_destination_lng === null ? undefined : Number(pkg.main_destination_lng),

    meta_title: pkg.meta_title ?? '',
    meta_description: pkg.meta_description ?? '',
    meta_keywords: pkg.meta_keywords ?? '',
    // undefined, never '' — og_image is validated with .url(), which rejects an empty string.
    og_image: pkg.og_image ?? undefined,

    category_ids: categories.map((row) => row.category_id as string),
    subcategory_ids: subcategories.map((row) => row.subcategory_id as string),

    gallery_images: byDisplayOrder(gallery as { display_order?: number | null }[]).map((row) => {
      const image = row as ChildRow;
      return {
        url: image.image_url as string,
        is_cover: (image.is_cover as boolean) ?? false,
        display_order: (image.display_order as number) ?? 0,
      };
    }),

    video_urls: byDisplayOrder(videos as { display_order?: number | null }[]).map(
      (row) => (row as ChildRow).video_url as string
    ),

    itinerary_days: [...days]
      .sort((a, b) => (a.day_number as number) - (b.day_number as number))
      .map((day) => ({
        day_number: day.day_number as number,
        title: (day.title as string) ?? '',
        morning_activity: (day.morning_activity as string) ?? '',
        afternoon_activity: (day.afternoon_activity as string) ?? '',
        evening_activity: (day.evening_activity as string) ?? '',
        breakfast: (day.breakfast as boolean) ?? false,
        lunch: (day.lunch as boolean) ?? false,
        dinner: (day.dinner as boolean) ?? false,
        images: byDisplayOrder(
          dayImages.filter(
            (image) => image.itinerary_day_id === day.id
          ) as { display_order?: number | null }[]
        ).map((image) => (image as ChildRow).image_url as string),
      })),

    inclusions: toChecklist(inclusions),
    exclusions: toChecklist(exclusions),

    stay_details: byDisplayOrder(stays as { display_order?: number | null }[]).map((row) => {
      const hotel = row as ChildRow;
      return {
        hotel_name: (hotel.hotel_name as string) ?? '',
        location: (hotel.location as string) ?? '',
        rating: (hotel.rating as number) ?? DEFAULT_HOTEL_RATING,
        room_type: (hotel.room_type as string) ?? '',
        amenities: (hotel.amenities as string[]) ?? [],
        image_url: (hotel.image_url as string) ?? undefined,
        check_in_date: (hotel.check_in_date as string) ?? '',
        check_out_date: (hotel.check_out_date as string) ?? '',
        display_order: (hotel.display_order as number) ?? 0,
      };
    }),

    travel_tips: byDisplayOrder(tips as { display_order?: number | null }[]).map((row) => {
      const tip = row as ChildRow;
      return {
        tip: (tip.tip_text as string) ?? '',
        display_order: (tip.display_order as number) ?? 0,
      };
    }),

    best_time_to_visit: seasons.map((season) => ({
      month_start: (season.month_start as string) ?? '',
      month_end: (season.month_end as string) ?? '',
      description: (season.description as string) ?? '',
      weather_condition: (season.weather_condition as string) ?? '',
    })),

    places_to_visit: places.map((place) => ({
      place_name: (place.place_name as string) ?? '',
      description: (place.description as string) ?? '',
      distance_from_hotel: (place.distance_from_hotel as string) ?? '',
      entry_fee: (place.entry_fee as string) ?? '',
    })),
  };
}

const DEFAULT_HOTEL_RATING = 3;

async function snapshotRelations(packageId: string): Promise<RelationSnapshot> {
  const snapshot: RelationSnapshot = {};

  await Promise.all(
    CHILD_TABLES.map(async (table) => {
      const { data, error } = await supabaseAdmin.from(table).select('*').eq('package_id', packageId);
      if (error) throw error;
      snapshot[table] = (data ?? []) as ChildRow[];
    })
  );

  const dayIds = (snapshot.itinerary_days ?? []).map((day) => day.id as string);
  snapshot.itinerary_day_images = [];

  if (dayIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from('itinerary_day_images')
      .select('*')
      .in('itinerary_day_id', dayIds);

    if (error) throw error;
    snapshot.itinerary_day_images = (data ?? []) as ChildRow[];
  }

  return snapshot;
}

/** Deleting `itinerary_days` cascades to its images, so they need no separate delete. */
async function deleteRelations(packageId: string) {
  for (const table of CHILD_TABLES) {
    const { error } = await supabaseAdmin.from(table).delete().eq('package_id', packageId);
    if (error) throw error;
  }
}


async function restoreRelations(snapshot: RelationSnapshot) {
  for (const table of CHILD_TABLES) {
    await insertRows(table, snapshot[table] ?? []);
  }

  await insertRows('itinerary_day_images', snapshot.itinerary_day_images ?? []);
}

export async function updatePackageWithRelations(
  id: string,
  input: PackageUpdateOutput
): Promise<{ id: string }> {
  const packageRow = stripRelations(input);

  const snapshot = await snapshotRelations(id);

  const { data, error } = await supabaseAdmin
    .from('packages')
    .update(packageRow)
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Package not found');

  try {
    await deleteRelations(id);
    await insertPackageRelations(id, input);
  } catch (relationError) {
    try {
      await deleteRelations(id);
      await restoreRelations(snapshot);
    } catch {
      throw new Error(
        'The package could not be updated and its previous contents could not be restored. Check the package before editing it again.'
      );
    }

    throw relationError;
  }

  return { id };
}
