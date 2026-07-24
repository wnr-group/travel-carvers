import { z } from 'zod';

/**
 * Optional text fields arrive from the form as '' rather than undefined. Store them as NULL.
 *
 * `null` is accepted as input too: this schema runs twice per save — once in the
 * browser, then again on the API route over the payload the first parse already
 * produced. Without it, every empty optional field round-trips as null and is
 * rejected server-side.
 */
const emptyToNull = <T extends z.ZodType<string>>(schema: T) =>
  z
    .union([schema, z.literal(''), z.null()])
    .optional()
    .transform((value) => (value ? value : null));

export const testimonialSchema = z.object({
  customer_name: z.string().min(2, 'Customer name must be at least 2 characters').max(255),
  customer_role: emptyToNull(z.string().max(255, 'Role must be 255 characters or fewer')),
  review_text: z.string().min(2, 'Review text is required').max(2000, 'Review must be 2000 characters or fewer'),
  rating: z.number().int('Rating must be a whole number').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  photo_url: emptyToNull(z.url({ error: 'Photo must be a valid URL' })),
  is_featured: z.boolean().default(false),
  display_order: z.number().int('Display order must be a whole number').min(0, 'Display order cannot be negative').default(0),
});

/** Updates allow any subset of fields. */
export const testimonialUpdateSchema = testimonialSchema.partial();

export type TestimonialInput = z.input<typeof testimonialSchema>;
export type TestimonialOutput = z.output<typeof testimonialSchema>;
export type TestimonialUpdateOutput = z.output<typeof testimonialUpdateSchema>;
