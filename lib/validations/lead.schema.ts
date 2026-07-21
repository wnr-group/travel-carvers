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

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted'] as const;

/** Blank optional inputs arrive as '' from the form; store them as NULL. */
const optionalDate = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional()
  .nullable();


export const adminLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.email('Invalid email address').max(100),
  phone: z
    .string()
    .trim()
    .min(6, 'Phone number must be at least 6 digits')
    .max(20, 'Phone number must be 20 characters or fewer'),
  message: z
    .string()
    .trim()
    .max(2000, 'Message must be 2000 characters or fewer')
    .transform((value) => value || undefined)
    .optional(),
  package_id: z
    .union([z.uuid('Pick a package from the list'), z.literal('')])
    .transform((value) => value || undefined)
    .optional()
    .nullable(),
  number_of_adults: z.number().int().min(1, 'At least 1 adult').max(99).default(1),
  number_of_children: z.number().int().min(0).max(99).default(0),
  number_of_infants: z.number().int().min(0).max(99).default(0),
  travel_start_date: optionalDate,
  travel_end_date: optionalDate,
  status: z.enum(LEAD_STATUSES).default('new'),
});

export type AdminLeadInput = z.input<typeof adminLeadSchema>;
export type AdminLeadOutput = z.output<typeof adminLeadSchema>;
