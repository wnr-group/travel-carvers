import { z } from 'zod';

const attachmentFile = z.object({
  file_url: z.url({ error: 'The uploaded file has no valid URL' }),
  file_path: z.string().trim().min(1, 'The uploaded file has no storage path'),
  file_name: z.string().trim().min(1, 'The uploaded file has no name').max(255),
  file_type: z.string().trim().max(120).optional(),
  file_size: z.number().int().nonnegative().optional(),
});

export const visaAttachmentSchema = attachmentFile.extend({
  country_name: z
    .string()
    .trim()
    .min(2, 'Enter a country name')
    .max(120, 'Must be 120 characters or fewer'),
});

export const visaAttachmentFileSchema = attachmentFile;

export type VisaAttachmentInput = z.output<typeof visaAttachmentSchema>;
export type VisaAttachmentFileInput = z.output<typeof visaAttachmentFileSchema>;
