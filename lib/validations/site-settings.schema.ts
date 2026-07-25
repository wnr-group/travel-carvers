import { z } from 'zod';

/** Optional URL field: '' / null → null; anything else must be a valid URL. */
const optionalUrl = z
  .union([z.url({ error: 'Enter a full URL, starting with https://' }), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

/**
 * Admin → Settings. Guards the single site-settings row so a blank company
 * name, malformed email, or junk social URL can't be persisted (the customer
 * footer and contact page read these directly).
 */
export const siteSettingsSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name is too long'),
  contact_email: z.email({ error: 'Enter a valid email address' }).max(120, 'Email is too long'),
  contact_phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(30, 'Phone number is too long')
    .regex(/^\+?[0-9\s\-()]{7,25}$/, 'Enter a valid phone number'),
  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(1000, 'Address is too long'),
  show_prices_globally: z.boolean().default(true),
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  twitter_url: optionalUrl,
  linkedin_url: optionalUrl,
});

export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
export type SiteSettingsOutput = z.output<typeof siteSettingsSchema>;
