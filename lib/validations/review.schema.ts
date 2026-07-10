import { z } from 'zod';

export const reviewSchema = z.object({
  package_id: z.string().uuid('Invalid package ID'),
  reviewer_name: z.string().min(2, 'Name must be at least 2 characters'),
  reviewer_email: z.string().email('Invalid email address'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  review_text: z.string().min(10, 'Review must be at least 10 characters'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
