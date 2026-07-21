/**
 * Upload constants shared by the browser and the upload route.
 */

export const UPLOAD_BUCKETS = [
  'category-images',
  'package-images',
  'itinerary-images',
  'hotel-images',
  'testimonial-images',
  'destination-images',
  'visa-attachments',
] as const

export type UploadBucket = (typeof UPLOAD_BUCKETS)[number]

export function isUploadBucket(value: string): value is UploadBucket {
  return (UPLOAD_BUCKETS as readonly string[]).includes(value)
}

/** Matches the image buckets' own `file_size_limit` (5MB) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

/** Documents are allowed to be larger — matches the visa-attachments bucket (10MB). */
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export const ALLOWED_DOCUMENT_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
}


const DOCUMENT_BUCKETS: readonly UploadBucket[] = ['visa-attachments']

export function isDocumentBucket(bucket: UploadBucket): boolean {
  return DOCUMENT_BUCKETS.includes(bucket)
}

export function allowedTypesFor(bucket: UploadBucket): Record<string, string> {
  return isDocumentBucket(bucket) ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES
}

export function maxBytesFor(bucket: UploadBucket): number {
  return isDocumentBucket(bucket) ? MAX_DOCUMENT_BYTES : MAX_UPLOAD_BYTES
}

export const DROPZONE_ACCEPT: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

export const DOCUMENT_ACCEPT: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

const SAFE_PATH = /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/

export function normalizeStoragePath(path: string | undefined | null): string {
  return (path ?? '').trim().replace(/^\/+|\/+$/g, '')
}

/**
 * Validate a folder prefix rather than scrubbing it.
 */
export function isSafeStoragePath(path: string): boolean {
  return path === '' || SAFE_PATH.test(path)
}
