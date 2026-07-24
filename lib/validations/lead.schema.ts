import { z } from 'zod';

export const LEAD_MESSAGES = {
  name: 'Please enter your full name (at least 2 characters).',
  nameMax: 'Name must be 100 characters or fewer.',
  email: 'Please enter a valid email address, like name@example.com.',
  emailMax: 'Email must be 100 characters or fewer.',
  phone: 'Please enter a valid phone number (at least 7 digits).',
  phoneMax: 'Phone number must be 20 characters or fewer.',
  phoneFormat: 'Phone number can only contain digits, spaces and + - ( ) characters.',
  message: 'Message must be 2000 characters or fewer.',
  adults: 'At least 1 adult is required.',
  countMax: 'That is more travellers than we can book online — please contact us.',
  startRequired: 'Please choose your travel start date.',
  startPast: 'Travel start date cannot be in the past.',
  endBeforeStart: 'Travel end date must be on or after the start date.',
  package: 'Please pick a package from the list.',
} as const;

const PHONE_PATTERN = /^[\d\s+\-()]+$/;

const phoneField = z
  .string()
  .trim()
  .min(1, LEAD_MESSAGES.phone)
  .max(20, LEAD_MESSAGES.phoneMax)
  .regex(PHONE_PATTERN, LEAD_MESSAGES.phoneFormat)
  .refine((value) => (value.match(/\d/g) ?? []).length >= 7, LEAD_MESSAGES.phone);

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export const LEAD_SOURCES = ['website', 'contact', 'admin'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const leadSchema = z
  .object({
    source: z.enum(LEAD_SOURCES).default('website'),
    package_id: z.string().trim().optional().nullable().or(z.literal('')),
    name: z.string().trim().min(2, LEAD_MESSAGES.name).max(100, LEAD_MESSAGES.nameMax),
    email: z.email(LEAD_MESSAGES.email).max(100, LEAD_MESSAGES.emailMax),
    phone: phoneField,
    message: z.string().trim().max(2000, LEAD_MESSAGES.message).optional(),
    number_of_adults: z.number().int().min(1, LEAD_MESSAGES.adults).max(99, LEAD_MESSAGES.countMax),
    number_of_children: z.number().int().min(0).max(99, LEAD_MESSAGES.countMax),
    number_of_infants: z.number().int().min(0).max(99, LEAD_MESSAGES.countMax),
    travel_start_date: z
      .string()
      .min(1, LEAD_MESSAGES.startRequired)
      .refine(isValidDate, LEAD_MESSAGES.startRequired),
    travel_end_date: z.string().optional().nullable().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.travel_start_date && new Date(data.travel_start_date) < startOfToday()) {
      ctx.addIssue({
        code: 'custom',
        path: ['travel_start_date'],
        message: LEAD_MESSAGES.startPast,
      });
    }

    if (
      data.travel_end_date &&
      data.travel_start_date &&
      new Date(data.travel_end_date) < new Date(data.travel_start_date)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['travel_end_date'],
        message: LEAD_MESSAGES.endBeforeStart,
      });
    }
  });

export type LeadFormData = z.infer<typeof leadSchema>;

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted'] as const;

const optionalDate = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional()
  .nullable();

export const adminLeadSchema = z
  .object({
    name: z.string().trim().min(2, LEAD_MESSAGES.name).max(100, LEAD_MESSAGES.nameMax),
    email: z.email(LEAD_MESSAGES.email).max(100, LEAD_MESSAGES.emailMax),
    phone: phoneField,
    message: z
      .string()
      .trim()
      .max(2000, LEAD_MESSAGES.message)
      .transform((value) => value || undefined)
      .optional(),
    package_id: z
      .union([z.guid(LEAD_MESSAGES.package), z.literal('')])
      .transform((value) => value || undefined)
      .optional()
      .nullable(),
    number_of_adults: z.number().int().min(1, LEAD_MESSAGES.adults).max(99, LEAD_MESSAGES.countMax).default(1),
    number_of_children: z.number().int().min(0).max(99, LEAD_MESSAGES.countMax).default(0),
    number_of_infants: z.number().int().min(0).max(99, LEAD_MESSAGES.countMax).default(0),
    travel_start_date: optionalDate,
    travel_end_date: optionalDate,
    status: z.enum(LEAD_STATUSES).default('new'),
    source: z.enum(LEAD_SOURCES).default('admin'),
  })
  .superRefine((data, ctx) => {
    if (
      data.travel_end_date &&
      data.travel_start_date &&
      new Date(data.travel_end_date) < new Date(data.travel_start_date)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['travel_end_date'],
        message: LEAD_MESSAGES.endBeforeStart,
      });
    }
  });

export type AdminLeadInput = z.input<typeof adminLeadSchema>;
export type AdminLeadOutput = z.output<typeof adminLeadSchema>;
