import { z } from 'zod';

const emptyToNull = <T extends z.ZodType<string>>(schema: T) =>
  z
    .union([schema, z.literal(''), z.null()])
    .optional()
    .transform((value) => (value ? value : null));

export const siteSettingsSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(50, 'Phone number must be 50 characters or fewer')
    .regex(/^\+?[0-9\s\-()]{10,25}$/, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(1000),
  show_prices_globally: z.boolean().default(true),
  facebook_url: emptyToNull(
    z.string()
      .url('Please enter a valid URL')
      .regex(/^https:\/\/(www\.)?facebook\.com\/.+$/, 'Please enter a valid Facebook profile URL (e.g., https://facebook.com/username)')
  ),
  instagram_url: emptyToNull(
    z.string()
      .url('Please enter a valid URL')
      .regex(/^https:\/\/(www\.)?instagram\.com\/.+$/, 'Please enter a valid Instagram profile URL (e.g., https://instagram.com/username)')
  ),
  twitter_url: emptyToNull(
    z.string()
      .url('Please enter a valid URL')
      .regex(/^https:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/, 'Please enter a valid X/Twitter profile URL (e.g., https://x.com/username)')
  ),
  linkedin_url: emptyToNull(
    z.string()
      .url('Please enter a valid URL')
      .regex(/^https:\/\/(www\.)?linkedin\.com\/.+$/, 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/name)')
  ),
});

export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
export type SiteSettingsOutput = z.output<typeof siteSettingsSchema>;
