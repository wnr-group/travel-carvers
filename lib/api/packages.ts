import { supabaseAdmin } from '@/lib/supabase/server';
import { cleanupOrphanedImages, referencedUrlsFrom } from '@/lib/supabase/storageCleanup';
import type { UploadBucket } from '@/lib/storage/buckets';
import type { AdminPackage, PackageCategoryRef, PackageStatus } from '@/lib/types/package';
import { slugify } from '@/lib/utils';
import { MONTHS } from '@/lib/validations/package.schema';
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
      'package_highlights',
      (input.highlights ?? []).map((highlight) => ({
        package_id: packageId,
        highlight_text: highlight.highlight,
        display_order: highlight.display_order,
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

    insertRows(
      'cancellation_policies',
      (input.cancellation_policy ?? []).map((rule) => ({
        package_id: packageId,
        window_label: rule.window_label,
        refund_text: rule.refund_text,
        display_order: rule.display_order,
      }))
    ),

    insertRows(
      'required_documents',
      (input.required_documents ?? []).map((document) => ({
        package_id: packageId,
        document_text: document.document_text,
        display_order: document.display_order,
      }))
    ),

    insertItineraryDays(packageId, input),
  ]);
}

/**
 * Itinerary days, then the entries hanging off each one.
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
        timing: day.timing,
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

  // The form holds entries as an ordered list, so their order *is* their array position.
  const entries = days.flatMap((day) => {
    const dayId = idByDayNumber.get(day.day_number);
    if (!dayId) return [];

    return (day.entries ?? []).map((entry, index) => ({
      itinerary_day_id: dayId,
      name: entry.name,
      time_label: entry.time_label ?? null,
      description: entry.description ?? null,
      image_url: entry.image_url ?? null,
      icon_name: entry.icon ?? null,
      display_order: index,
    }));
  });

  await insertRows('itinerary_entries', entries);
}

/** What the package row needs to mirror once its destination is known. */
interface ResolvedDestination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

async function resolveDestination(
  input: Pick<PackageRelations, 'destination_id' | 'new_destination'>
): Promise<ResolvedDestination | null> {
  if (input.new_destination) {
    const { name, country, latitude, longitude } = input.new_destination;
    const slug = slugify(name);

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('destinations')
      .select('id, name, latitude, longitude')
      .eq('slug', slug)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      return {
        id: existing.id as string,
        name: existing.name as string,
        latitude: Number(existing.latitude),
        longitude: Number(existing.longitude),
      };
    }

    const { data: created, error: insertError } = await supabaseAdmin
      .from('destinations')
      .insert({ name, country, slug, latitude, longitude, is_active: true })
      .select('id, name, latitude, longitude')
      .single();

    if (insertError) throw insertError;

    return {
      id: created.id as string,
      name: created.name as string,
      latitude: Number(created.latitude),
      longitude: Number(created.longitude),
    };
  }

  if (input.destination_id) {
    const { data, error } = await supabaseAdmin
      .from('destinations')
      .select('id, name, latitude, longitude')
      .eq('id', input.destination_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('The selected destination no longer exists.');

    return {
      id: data.id as string,
      name: data.name as string,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };
  }

  return null;
}

async function linkPackageToDestination(packageId: string, destinationId: string | null) {
  const { error: deleteError } = await supabaseAdmin
    .from('package_destinations')
    .delete()
    .eq('package_id', packageId);

  if (deleteError) throw deleteError;

  if (!destinationId) return;

  const { error: insertError } = await supabaseAdmin
    .from('package_destinations')
    .upsert(
      { package_id: packageId, destination_id: destinationId },
      { onConflict: 'package_id,destination_id', ignoreDuplicates: true }
    );

  if (insertError) throw insertError;
}

function withDestinationColumns<T extends Record<string, unknown>>(
  row: T,
  destination: ResolvedDestination | null
): T {
  if (!destination) return row;

  return {
    ...row,
    destination_name: destination.name,
    main_destination_lat: destination.latitude,
    main_destination_lng: destination.longitude,
  };
}

/**
 * The form fields that live in other tables. Everything else is a column on `packages`.
 */
const RELATION_KEYS = [
  'category_ids',
  'subcategory_ids',
  'destination_id',
  'new_destination',
  'gallery_images',
  'video_urls',
  'itinerary_days',
  'inclusions',
  'exclusions',
  'stay_details',
  'highlights',
  'travel_tips',
  'best_time_to_visit',
  'places_to_visit',
  'cancellation_policy',
  'required_documents',
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
  const destination = await resolveDestination(input);
  const packageRow = withDestinationColumns(stripRelations(input), destination);

  const { data, error } = await supabaseAdmin
    .from('packages')
    .insert(packageRow satisfies PackageRecordInput)
    .select('id')
    .single();

  if (error) throw error;

  const packageId = data.id as string;

  try {
    await insertPackageRelations(packageId, input);
    await linkPackageToDestination(packageId, destination?.id ?? null);
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

/* -------------------------- Image storage cleanup -------------------------- */

/**
 * Buckets a package's own images live in. Cleanup is scoped to these so it can
 * never touch a file owned by another content type (categories, testimonials,
 * etc.) — even if such a URL was pasted into a package's free-text `og_image`.
 */
const PACKAGE_IMAGE_BUCKETS: readonly UploadBucket[] = [
  'package-images',
  'hotel-images',
  'itinerary-images',
];

/** Every image URL a package currently references across its tables. */
async function collectPackageImageUrls(packageId: string): Promise<string[]> {
  const urls: string[] = [];

  const [pkg, gallery, stays, days] = await Promise.all([
    supabaseAdmin.from('packages').select('og_image').eq('id', packageId).maybeSingle(),
    supabaseAdmin.from('package_gallery').select('image_url').eq('package_id', packageId),
    supabaseAdmin.from('stay_details').select('image_url').eq('package_id', packageId),
    supabaseAdmin.from('itinerary_days').select('id').eq('package_id', packageId),
  ]);

  if (pkg.data?.og_image) urls.push(pkg.data.og_image as string);
  for (const row of gallery.data ?? []) if (row.image_url) urls.push(row.image_url as string);
  for (const row of stays.data ?? []) if (row.image_url) urls.push(row.image_url as string);

  const dayIds = (days.data ?? []).map((day) => day.id as string);
  if (dayIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('itinerary_entries')
      .select('image_url')
      .in('itinerary_day_id', dayIds);
    for (const row of data ?? []) if (row.image_url) urls.push(row.image_url as string);
  }

  return urls;
}

/**
 * Of the given URLs, which are still referenced by *some* package right now.
 *
 * Call this after the delete/update has committed, so a URL that survives here is
 * genuinely still in use (by another package, or elsewhere in the same one). On
 * any query error we conservatively treat every candidate as referenced, so a
 * transient failure can never cause an in-use file to be deleted.
 */
async function stillReferencedByPackages(urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();

  const [gallery, stays, entries, ogs] = await Promise.all([
    supabaseAdmin.from('package_gallery').select('image_url').in('image_url', urls),
    supabaseAdmin.from('stay_details').select('image_url').in('image_url', urls),
    supabaseAdmin.from('itinerary_entries').select('image_url').in('image_url', urls),
    supabaseAdmin.from('packages').select('og_image').in('og_image', urls),
  ]);

  return referencedUrlsFrom(urls, [
    { ...gallery, column: 'image_url' },
    { ...stays, column: 'image_url' },
    { ...entries, column: 'image_url' },
    { ...ogs, column: 'og_image' },
  ]);
}

/**
 * Delete the given candidate files that no package references any more.
 * Must be called *after* the package delete/update has committed.
 */
async function cleanupOrphanedPackageImages(candidateUrls: string[]): Promise<void> {
  await cleanupOrphanedImages(candidateUrls, PACKAGE_IMAGE_BUCKETS, stillReferencedByPackages);
}

/**
 * Admin: Delete package (requires server-side)
 */
export async function deletePackage(id: string) {
  // Capture image URLs before the rows (and their references) disappear.
  const imageUrls = await collectPackageImageUrls(id).catch(() => [] as string[]);

  const { error } = await supabaseAdmin
    .from('packages')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Remove now-orphaned files that no other package still references.
  await cleanupOrphanedPackageImages(imageUrls);
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
  'cancellation_policies',
  'required_documents',
  'package_highlights',
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
    cancellationRows,
    documentRows,
    highlightRows,
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

  const { data: destinationLinks, error: destinationError } = await supabaseAdmin
    .from('package_destinations')
    .select('destination_id')
    .eq('package_id', id)
    .limit(1);

  if (destinationError) throw destinationError;

  const dayIds = days.map((day) => day.id as string);
  let dayEntries: ChildRow[] = [];

  if (dayIds.length > 0) {
    const { data, error: entryError } = await supabaseAdmin
      .from('itinerary_entries')
      .select('*')
      .in('itinerary_day_id', dayIds);

    if (entryError) throw entryError;
    dayEntries = (data ?? []) as ChildRow[];
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
    is_group_package: pkg.is_group_package ?? false,

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
    og_image: pkg.og_image ?? undefined,

    category_ids: categories.map((row) => row.category_id as string),
    subcategory_ids: subcategories.map((row) => row.subcategory_id as string),
    destination_id: (destinationLinks?.[0]?.destination_id as string | undefined) ?? null,
    new_destination: null,

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
        timing: (day.timing as string) ?? '',
        breakfast: (day.breakfast as boolean) ?? false,
        lunch: (day.lunch as boolean) ?? false,
        dinner: (day.dinner as boolean) ?? false,
        entries: byDisplayOrder(
          dayEntries.filter(
            (entry) => entry.itinerary_day_id === day.id
          ) as { display_order?: number | null }[]
        ).map((row) => {
          const entry = row as ChildRow;
          return {
            name: (entry.name as string) ?? '',
            time_label: (entry.time_label as string) ?? '',
            description: (entry.description as string) ?? '',
            image_url: (entry.image_url as string) ?? '',
            icon: (entry.icon_name as string) ?? '',
          };
        }),
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

    highlights: byDisplayOrder(highlightRows as { display_order?: number | null }[]).map((row) => {
      const highlight = row as ChildRow;
      return {
        highlight: (highlight.highlight_text as string) ?? '',
        display_order: (highlight.display_order as number) ?? 0,
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
      month_start: toMonth(season.month_start, 'January'),
      month_end: toMonth(season.month_end, 'December'),
      description: (season.description as string) ?? '',
      weather_condition: (season.weather_condition as string) ?? '',
    })),

    places_to_visit: places.map((place) => ({
      place_name: (place.place_name as string) ?? '',
      description: (place.description as string) ?? '',
      distance_from_hotel: (place.distance_from_hotel as string) ?? '',
      entry_fee: (place.entry_fee as string) ?? '',
    })),

    cancellation_policy: byDisplayOrder(
      cancellationRows as { display_order?: number | null }[]
    ).map((row, index) => {
      const rule = row as ChildRow;
      return {
        window_label: (rule.window_label as string) ?? '',
        refund_text: (rule.refund_text as string) ?? '',
        display_order: (rule.display_order as number) ?? index,
      };
    }),

    required_documents: byDisplayOrder(
      documentRows as { display_order?: number | null }[]
    ).map((row, index) => {
      const document = row as ChildRow;
      return {
        document_text: (document.document_text as string) ?? '',
        display_order: (document.display_order as number) ?? index,
      };
    }),
  };
}

const DEFAULT_HOTEL_RATING = 3;

type Month = (typeof MONTHS)[number];

function toMonth(value: unknown, fallback: Month): Month {
  return MONTHS.includes(value as Month) ? (value as Month) : fallback;
}

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
  snapshot.itinerary_entries = [];

  if (dayIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from('itinerary_entries')
      .select('*')
      .in('itinerary_day_id', dayIds);

    if (error) throw error;
    snapshot.itinerary_entries = (data ?? []) as ChildRow[];
  }

  return snapshot;
}

/** Deleting `itinerary_days` cascades to its entries, so they need no separate delete. */
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

  await insertRows('itinerary_entries', snapshot.itinerary_entries ?? []);
}

export async function updatePackageWithRelations(
  id: string,
  input: PackageUpdateOutput
): Promise<{ id: string }> {
  const destination = await resolveDestination(input);
  const packageRow = withDestinationColumns(stripRelations(input), destination);

  const snapshot = await snapshotRelations(id);
  // Image URLs the package referenced before this edit. Any that are no longer
  // referenced once the update commits get their files removed from storage.
  const previousImageUrls = await collectPackageImageUrls(id).catch(() => [] as string[]);

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
    await linkPackageToDestination(id, destination?.id ?? null);
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

  // Update committed successfully — drop any images the edit left orphaned.
  await cleanupOrphanedPackageImages(previousImageUrls);

  return { id };
}
