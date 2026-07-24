import { z } from 'zod';

export const reviewSchema = z.object({
  package_id: z.guid('We could not identify this package. Please refresh and try again.'),
  reviewer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(100, 'Name must be 100 characters or fewer.'),
  reviewer_email: z
    .email('Please enter a valid email address, like name@example.com.')
    .max(100, 'Email must be 100 characters or fewer.'),
  rating: z
    .number('Please select a star rating.')
    .int()
    .min(1, 'Please select a rating between 1 and 5 stars.')
    .max(5, 'Please select a rating between 1 and 5 stars.'),
  review_text: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more — at least 10 characters.')
    .max(2000, 'Review must be 2000 characters or fewer.'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
