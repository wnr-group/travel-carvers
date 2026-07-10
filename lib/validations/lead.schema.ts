import { z } from 'zod';

export const leadSchema = z.object({
  package_id: z.string().uuid('Invalid package ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
