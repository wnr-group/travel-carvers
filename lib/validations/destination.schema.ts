import { z } from 'zod';
import { slugify } from '@/lib/utils';

export const DESTINATION_META_TITLE_MAX = 200;
export const DESTINATION_META_DESCRIPTION_MAX = 300;

const emptyToNull = <T extends z.ZodType<string>>(schema: T) =>
  z
    .union([schema, z.literal('')])
    .optional()
    .transform((value) => (value ? value : null));

export const destinationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be 200 characters or fewer'),
  country: z
    .string({ error: 'Country is required' })
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be 100 characters or fewer'),
  city: emptyToNull(z.string().max(100, 'City must be 100 characters or fewer')),
  slug: z
    .string({ error: 'Slug is required' })
    .max(200, 'Slug must be 200 characters or fewer')
    .transform(slugify)
    .refine((value) => value.length >= 2, 'Slug must be at least 2 characters'),
  hero_image_url: emptyToNull(z.url({ error: 'Hero image must be a valid URL' })),
  description: emptyToNull(z.string().max(2000, 'Description must be 2000 characters or fewer')),

  latitude: z
    .number({ error: 'Latitude is required' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ error: 'Longitude is required' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
    
  timezone: emptyToNull(z.string().max(100, 'Time zone must be 100 characters or fewer')),
  currency: emptyToNull(z.string().max(100, 'Currency must be 100 characters or fewer')),
  languages: emptyToNull(z.string().max(200, 'Languages must be 200 characters or fewer')),

  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  is_active: z.boolean().default(true),

  meta_title: emptyToNull(
    z.string().max(DESTINATION_META_TITLE_MAX, `Meta title must be ${DESTINATION_META_TITLE_MAX} characters or fewer`)
  ),
  meta_description: emptyToNull(
    z
      .string()
      .max(
        DESTINATION_META_DESCRIPTION_MAX,
        `Meta description must be ${DESTINATION_META_DESCRIPTION_MAX} characters or fewer`
      )
  ),
  og_image: emptyToNull(z.url({ error: 'OG image must be a valid URL' })),

  package_ids: z.array(z.uuid({ error: 'Package must be a valid id' })).default([]),
});

export const destinationUpdateSchema = destinationSchema.omit({ slug: true });

export type DestinationFormInput = z.input<typeof destinationSchema>;
export type DestinationFormOutput = z.output<typeof destinationSchema>;
export type DestinationUpdateOutput = z.output<typeof destinationUpdateSchema>;
