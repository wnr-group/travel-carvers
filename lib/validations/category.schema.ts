import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  icon_name: z.string().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const subcategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100),
  description: z.string().optional(),
  icon_name: z.string().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

// export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryFormData = z.input<typeof categorySchema>;
export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
