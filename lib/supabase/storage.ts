import { supabase } from './client'
import { supabaseAdmin } from './server'

// Storage bucket names
export const STORAGE_BUCKETS = {
  DESTINATIONS: 'destinations',
  PACKAGES: 'packages',
  ATTRACTIONS: 'attractions',
} as const

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param file - The file to upload
 * @param isAdmin - Whether to use admin client (server-side)
 * @returns The public URL of the uploaded file or error
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  isAdmin = false
) {
  const client = isAdmin ? supabaseAdmin : supabase

  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    console.error('Upload error:', error)
    return { error, publicUrl: null }
  }

  const {
    data: { publicUrl },
  } = client.storage.from(bucket).getPublicUrl(path)

  return { error: null, publicUrl }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param isAdmin - Whether to use admin client (server-side)
 */
export async function deleteFile(bucket: string, path: string, isAdmin = false) {
  const client = isAdmin ? supabaseAdmin : supabase

  const { error } = await client.storage.from(bucket).remove([path])

  if (error) {
    console.error('Delete error:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get public URL for a file
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 */
export function getPublicUrl(bucket: string, path: string) {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)

  return publicUrl
}

/**
 * List files in a bucket
 * @param bucket - The storage bucket name
 * @param path - Optional folder path
 * @param isAdmin - Whether to use admin client (server-side)
 */
export async function listFiles(bucket: string, path = '', isAdmin = false) {
  const client = isAdmin ? supabaseAdmin : supabase

  const { data, error } = await client.storage.from(bucket).list(path)

  if (error) {
    console.error('List files error:', error)
    return { error, files: [] }
  }

  return { error: null, files: data }
}
