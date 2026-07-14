import { z } from 'zod';
import { slugify } from '@/lib/utils';

export const SHORT_DESCRIPTION_MAX = 200;

export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;

export const basicInfoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z
    .string()
    .max(200)
    .transform(slugify)
    .refine((value) => value.length >= 3, 'Slug must be at least 3 characters'),
  short_description: z
    .string()
    .min(20, 'Short description must be at least 20 characters')
    .max(SHORT_DESCRIPTION_MAX, `Short description must be ${SHORT_DESCRIPTION_MAX} characters or fewer`),
  full_description: z.string().min(50, 'Full description must be at least 50 characters'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),

  // Flags
  is_featured: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_new: z.boolean().default(false),
});

export const packageSchema = z.object({
  ...basicInfoSchema.shape,

  // Pricing
  price_adult: z.number().positive('Adult price must be positive').optional(),
  price_child: z.number().positive('Child price must be positive').optional(),
  price_infant: z.number().positive('Infant price must be positive').optional(),
  show_price: z.boolean().default(true),

  // Duration
  duration_days: z.number().int().positive('Days must be positive'),
  duration_nights: z.number().int().min(0, 'Nights cannot be negative'),

  // Details
  difficulty_level: z.enum(['easy', 'moderate', 'hard']).optional(),
  group_size_min: z.number().int().positive().optional(),
  group_size_max: z.number().int().positive().optional(),
  age_restriction: z.string().optional(),

  // Location
  destination_name: z.string().optional(),
  main_destination_lat: z.number().min(-90).max(90).optional(),
  main_destination_lng: z.number().min(-180).max(180).optional(),

  // SEO
  meta_title: z.string().max(META_TITLE_MAX).optional(),
  meta_description: z.string().max(META_DESCRIPTION_MAX).optional(),
  meta_keywords: z.string().optional(),
  og_image: z.string().url().optional(),

  // Related data (arrays)
  category_ids: z.array(z.string().uuid()).min(1, 'Select at least one category'),
  subcategory_ids: z.array(z.string().uuid()).optional(),
  gallery_images: z.array(z.object({
    url: z.string().url(),
    is_cover: z.boolean(),
    display_order: z.number(),
  })).optional(),
  video_urls: z.array(z.string().url()).optional(),
  itinerary_days: z.array(z.object({
    day_number: z.number(),
    title: z.string(),
    morning_activity: z.string().optional(),
    afternoon_activity: z.string().optional(),
    evening_activity: z.string().optional(),
    breakfast: z.boolean(),
    lunch: z.boolean(),
    dinner: z.boolean(),
    images: z.array(z.string().url()).optional(),
  })).optional(),
  inclusions: z.array(z.object({
    text: z.string(),
    icon: z.string(),
    display_order: z.number(),
  })).optional(),
  exclusions: z.array(z.object({
    text: z.string(),
    icon: z.string(),
    display_order: z.number(),
  })).optional(),
  stay_details: z.array(z.object({
    hotel_name: z.string(),
    location: z.string().optional(),
    rating: z.number().int().min(1).max(5),
    room_type: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    image_url: z.string().url().optional(),
    check_in_date: z.string().optional(),
    check_out_date: z.string().optional(),
    display_order: z.number(),
  })).optional(),
  travel_tips: z.array(z.object({
    tip: z.string(),
    display_order: z.number(),
  })).optional(),
  best_time_to_visit: z.array(z.object({
    month_start: z.string(),
    month_end: z.string(),
    description: z.string().optional(),
    weather_condition: z.string().optional(),
  })).optional(),
  places_to_visit: z.array(z.object({
    place_name: z.string(),
    description: z.string().optional(),
    distance_from_hotel: z.string().optional(),
    entry_fee: z.string().optional(),
  })).optional(),
});


export type PackageFormInput = z.input<typeof packageSchema>;
export type PackageFormOutput = z.output<typeof packageSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;


export const packageUpdateSchema = packageSchema.omit({ slug: true });

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
