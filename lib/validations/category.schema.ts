import { z } from 'zod';
import { slugify } from '@/lib/utils';

/**
 * Optional text fields arrive from the form as '' rather than undefined. Store them as NULL 
 */
const emptyToNull = <T extends z.ZodType<string>>(schema: T) =>
  z
    .union([schema, z.literal('')])
    .optional()
    .transform((value) => (value ? value : null));

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .max(100)
    .transform(slugify)
    .refine((value) => value.length >= 2, 'Slug must be at least 2 characters'),
  description: emptyToNull(z.string().max(500, 'Description must be 500 characters or fewer')),
  cover_image_url: emptyToNull(z.url({ error: 'Cover image must be a valid URL' })),
  icon_name: emptyToNull(z.string().max(50)),
  display_order: z.number().int().min(0, 'Order cannot be negative').default(0),
  is_active: z.boolean().default(true),
  // Whether the category appears in the customer header/navigation menu.
  show_in_nav: z.boolean().default(false),
});

export const subcategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .max(100)
    .transform(slugify)
    .refine((value) => value.length >= 2, 'Slug must be at least 2 characters'),
  description: emptyToNull(z.string().max(500, 'Description must be 500 characters or fewer')),
  cover_image_url: emptyToNull(z.url({ error: 'Cover image must be a valid URL' })),
  icon_name: emptyToNull(z.string().max(50)),
  display_order: z.number().int().min(0, 'Order cannot be negative').default(0),
  is_active: z.boolean().default(true),
  // Categories ↔ subcategories are many-to-many. An unlinked subcategory is
  // invisible in the package form, so at least one parent is required.
  category_ids: z.array(z.uuid()).min(1, 'Pick at least one parent category'),
});

/**
 * Updates deliberately omit `slug`
 */
export const categoryUpdateSchema = categorySchema.omit({ slug: true });
export const subcategoryUpdateSchema = subcategorySchema.omit({ slug: true });

// export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormOutput = z.output<typeof categorySchema>;
export type CategoryUpdateOutput = z.output<typeof categoryUpdateSchema>;
export type SubcategoryFormInput = z.input<typeof subcategorySchema>;
export type SubcategoryFormOutput = z.output<typeof subcategorySchema>;
export type SubcategoryUpdateOutput = z.output<typeof subcategoryUpdateSchema>;
