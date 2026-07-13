import { z } from 'zod';

export const leadSchema = z.object({
  package_id: z.string().optional().nullable().or(z.literal('')),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().optional(),
  number_of_adults: z.number().int().min(1, 'Minimum 1 adult required'),
  number_of_children: z.number().int().min(0),
  number_of_infants: z.number().int().min(0),
  travel_start_date: z.string().min(1, 'Start date is required'),
  travel_end_date: z.string().optional().nullable().or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadSchema>;
