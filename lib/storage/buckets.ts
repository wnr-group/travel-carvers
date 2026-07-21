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
] as const

export type UploadBucket = (typeof UPLOAD_BUCKETS)[number]

export function isUploadBucket(value: string): value is UploadBucket {
  return (UPLOAD_BUCKETS as readonly string[]).includes(value)
}

/** Matches the buckets' own `file_size_limit` (5MB) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export const DROPZONE_ACCEPT: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
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
