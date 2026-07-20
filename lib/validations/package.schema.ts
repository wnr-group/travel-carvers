import { z } from 'zod';
import { slugify } from '@/lib/utils';

export const SHORT_DESCRIPTION_MAX = 200;

export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;

export const MAX_GALLERY_IMAGES = 20;

export const MIN_HOTEL_RATING = 1;
export const MAX_HOTEL_RATING = 5;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEATHER_CONDITIONS = [
  'Sunny',
  'Pleasant',
  'Hot',
  'Humid',
  'Rainy',
  'Monsoon',
  'Cool',
  'Cold',
  'Snowy',
  'Windy',
] as const;

/**
 * Free text that must actually contain something.
 */
const requiredText = (message: string, max = 500) =>
  z.string().trim().min(1, message).max(max, `Must be ${max} characters or fewer`);

/**
 * Free text that may be left blank.
 */
const optionalText = (max = 500, message?: string) =>
  z
    .string()
    .trim()
    .max(max, message ?? `Must be ${max} characters or fewer`)
    .transform((value) => value || undefined)
    .optional();

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z
    .string()
    .transform((value) => value || undefined)
    .optional()
    .pipe(z.enum(values, { error: message }).optional());

export const basicInfoSchema = z.object({
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be 200 characters or fewer'),
  slug: z
    .string({ error: 'Slug is required' })
    .max(200, 'Slug must be 200 characters or fewer')
    .transform(slugify)
    .refine((value) => value.length >= 3, 'Slug must be at least 3 characters'),
  short_description: z
    .string({ error: 'Short description is required' })
    .trim()
    .min(20, 'Short description must be at least 20 characters')
    .max(
      SHORT_DESCRIPTION_MAX,
      `Short description must be ${SHORT_DESCRIPTION_MAX} characters or fewer`
    ),
  full_description: z
    .string({ error: 'Full description is required' })
    .trim()
    .min(50, 'Full description must be at least 50 characters'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),

  // Flags
  is_featured: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_new: z.boolean().default(false),
});


const packageObjectSchema = z.object({
  ...basicInfoSchema.shape,

  // Pricing
  price_adult: z
    .number({ error: 'Adult price must be a number' })
    .positive('Adult price must be greater than zero')
    .optional(),
  price_child: z
    .number({ error: 'Child price must be a number' })
    .positive('Child price must be greater than zero')
    .optional(),
  price_infant: z
    .number({ error: 'Infant price must be a number' })
    .positive('Infant price must be greater than zero')
    .optional(),
  show_price: z.boolean().default(true),

  // Duration
  duration_days: z
    .number({ error: 'Number of days is required' })
    .int('Days must be a whole number')
    .positive('Days must be at least 1'),
  duration_nights: z
    .number({ error: 'Number of nights is required' })
    .int('Nights must be a whole number')
    .min(0, 'Nights cannot be negative'),

  // Details
  difficulty_level: optionalEnum(
    ['easy', 'moderate', 'hard'],
    'Choose easy, moderate or hard'
  ),
  group_size_min: z
    .number({ error: 'Minimum group size must be a number' })
    .int('Minimum group size must be a whole number')
    .positive('Minimum group size must be at least 1')
    .optional(),
  group_size_max: z
    .number({ error: 'Maximum group size must be a number' })
    .int('Maximum group size must be a whole number')
    .positive('Maximum group size must be at least 1')
    .optional(),
  age_restriction: optionalText(100),

  // Location
  destination_name: optionalText(200),
  main_destination_lat: z
    .number({ error: 'Latitude must be a number' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  main_destination_lng: z
    .number({ error: 'Longitude must be a number' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),

  // SEO
  meta_title: optionalText(
    META_TITLE_MAX,
    `Meta title must be ${META_TITLE_MAX} characters or fewer`
  ),
  meta_description: optionalText(
    META_DESCRIPTION_MAX,
    `Meta description must be ${META_DESCRIPTION_MAX} characters or fewer`
  ),
  meta_keywords: optionalText(300),
  og_image: z.url({ error: 'Enter a full URL, starting with https://' }).optional(),

  // Related data (arrays)
  category_ids: z
    .array(z.uuid({ error: 'Category must be a valid id' }))
    .min(1, 'Select at least one category'),
  subcategory_ids: z.array(z.uuid({ error: 'Subcategory must be a valid id' })).optional(),
  gallery_images: z
    .array(
      z.object({
        url: z.url({ error: 'Each image needs a valid URL' }),
        is_cover: z.boolean(),
        display_order: z.number().int().min(0),
      })
    )
    .max(MAX_GALLERY_IMAGES, `You can add at most ${MAX_GALLERY_IMAGES} images`)
    .optional(),
  video_urls: z
    .array(z.url({ error: 'Enter a full video URL, starting with https://' }))
    .optional(),
  itinerary_days: z
    .array(
      z.object({
        day_number: z.number().int().positive(),
        title: requiredText('Give this day a title', 200),
        morning_activity: optionalText(1000),
        afternoon_activity: optionalText(1000),
        evening_activity: optionalText(1000),
        breakfast: z.boolean(),
        lunch: z.boolean(),
        dinner: z.boolean(),
        images: z.array(z.url({ error: 'Each image needs a valid URL' })).optional(),
      })
    )
    .optional(),
  inclusions: z
    .array(
      z.object({
        text: requiredText('Describe what is included, or remove this row', 200),
        icon: optionalText(50),
        display_order: z.number().int().min(0),
      })
    )
    .optional(),
  exclusions: z
    .array(
      z.object({
        text: requiredText('Describe what is not included, or remove this row', 200),
        icon: optionalText(50),
        display_order: z.number().int().min(0),
      })
    )
    .optional(),
  stay_details: z
    .array(
      z.object({
        hotel_name: requiredText('Hotel name is required', 200),
        location: optionalText(200),
        rating: z
          .number({ error: 'Pick a star rating' })
          .int('Rating must be a whole number')
          .min(MIN_HOTEL_RATING, `Rating must be between ${MIN_HOTEL_RATING} and ${MAX_HOTEL_RATING}`)
          .max(MAX_HOTEL_RATING, `Rating must be between ${MIN_HOTEL_RATING} and ${MAX_HOTEL_RATING}`),
        room_type: optionalText(200),
        amenities: z.array(z.string()).optional(),
        image_url: z.url({ error: 'Enter a valid image URL' }).optional(),
        check_in_date: optionalText(50),
        check_out_date: optionalText(50),
        display_order: z.number().int().min(0),
      })
    )
    .optional(),
  travel_tips: z
    .array(
      z.object({
        tip: requiredText('Write the tip, or remove this row', 500),
        display_order: z.number().int().min(0),
      })
    )
    .optional(),
  best_time_to_visit: z
    .array(
      z.object({
        month_start: z.enum(MONTHS, { error: 'Choose a start month' }),
        month_end: z.enum(MONTHS, { error: 'Choose an end month' }),
        description: optionalText(500),
        weather_condition: optionalEnum(WEATHER_CONDITIONS, 'Choose a weather condition'),
      })
    )
    .optional(),
  places_to_visit: z
    .array(
      z.object({
        place_name: requiredText('Place name is required, or remove this row', 200),
        description: optionalText(500),
        distance_from_hotel: optionalText(100),
        entry_fee: optionalText(100),
      })
    )
    .optional(),
});

type PackageShape = Omit<z.output<typeof packageObjectSchema>, 'slug'>;

const applyCrossFieldRules = (data: PackageShape, ctx: z.RefinementCtx) => {
  if (data.duration_nights > data.duration_days) {
    ctx.addIssue({
      code: 'custom',
      path: ['duration_nights'],
      message: `A ${data.duration_days}-day trip cannot have ${data.duration_nights} nights`,
    });
  }

  if (
    data.group_size_min !== undefined &&
    data.group_size_max !== undefined &&
    data.group_size_max < data.group_size_min
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['group_size_max'],
      message: 'Maximum group size cannot be smaller than the minimum',
    });
  }

  const hasLat = data.main_destination_lat !== undefined;
  const hasLng = data.main_destination_lng !== undefined;

  if (hasLat !== hasLng) {
    ctx.addIssue({
      code: 'custom',
      path: [hasLat ? 'main_destination_lng' : 'main_destination_lat'],
      message: 'Enter both latitude and longitude, or neither',
    });
  }

  const images = data.gallery_images ?? [];
  const covers = images.filter((image) => image.is_cover).length;

  if (images.length > 0 && covers !== 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['gallery_images'],
      message:
        covers === 0 ? 'Choose a cover image' : 'Only one image can be the cover',
    });
  }

  const days = data.itinerary_days ?? [];

  if (days.length > data.duration_days) {
    ctx.addIssue({
      code: 'custom',
      path: ['itinerary_days'],
      message: `The itinerary has ${days.length} days but the package runs for ${data.duration_days}`,
    });
  }
};

export const packageSchema = packageObjectSchema.superRefine(applyCrossFieldRules);

export type PackageFormInput = z.input<typeof packageSchema>;
export type PackageFormOutput = z.output<typeof packageSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;

export const packageUpdateSchema = packageObjectSchema
  .omit({ slug: true })
  .superRefine(applyCrossFieldRules);

export type PackageUpdateOutput = z.output<typeof packageUpdateSchema>;

export type PackageRelations = Pick<
  PackageFormOutput,
  | 'category_ids'
  | 'subcategory_ids'
  | 'gallery_images'
  | 'video_urls'
  | 'itinerary_days'
  | 'inclusions'
  | 'exclusions'
  | 'stay_details'
  | 'travel_tips'
  | 'best_time_to_visit'
  | 'places_to_visit'
>;

export type PackageRecordInput = Omit<
  PackageFormData,
  | 'category_ids'
  | 'subcategory_ids'
  | 'gallery_images'
  | 'video_urls'
  | 'itinerary_days'
  | 'inclusions'
  | 'exclusions'
  | 'stay_details'
  | 'travel_tips'
  | 'best_time_to_visit'
  | 'places_to_visit'
>;

/**
 * Query-string filters for the admin package list
 */
export const packageFiltersSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().trim().max(100).optional(),
  category: z.uuid({ error: 'Category must be a valid id' }).optional(),
});

export type PackageFilters = z.output<typeof packageFiltersSchema>;
