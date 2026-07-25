import { supabaseAdmin } from './server';
import { isUploadBucket, type UploadBucket } from '@/lib/storage/buckets';

/**
 * Helpers for removing now-orphaned files from Supabase Storage.
 *
 * Uploads are written under unique UUID keys and never overwritten, so replacing
 * or deleting content only ever updates the *database* reference — the old file
 * lingers in the bucket. These helpers turn stored public URLs back into storage
 * paths and delete them, best-effort, so storage doesn't leak.
 */

const PUBLIC_MARKER = '/storage/v1/object/public/';

export interface StorageRef {
  bucket: UploadBucket;
  path: string;
}

/**
 * Parse a Supabase public object URL into its `{ bucket, path }`.
 *
 * Returns `null` for anything that isn't a public URL in one of our known upload
 * buckets — e.g. external seed URLs (picsum), empty strings, or a bucket we don't
 * manage. Callers can therefore pass a mixed bag of URLs and trust that only real,
 * owned storage objects come back.
 */
export function parseStorageUrl(url: string | null | undefined): StorageRef | null {
  if (!url) return null;

  const markerAt = url.indexOf(PUBLIC_MARKER);
  if (markerAt === -1) return null;

  const rest = url.slice(markerAt + PUBLIC_MARKER.length);
  const slashAt = rest.indexOf('/');
  if (slashAt === -1) return null;

  const bucket = decodeURIComponent(rest.slice(0, slashAt));
  // Drop any query string (cache-buster / transform params) before decoding.
  const path = decodeURIComponent(rest.slice(slashAt + 1).split('?')[0]);

  if (!path || !isUploadBucket(bucket)) return null;
  return { bucket, path };
}

/**
 * Delete the given public URLs from storage, best-effort.
 *
 * Groups paths by bucket, skips anything that isn't an owned storage object, and
 * never throws — storage cleanup must not fail the caller's main operation.
 * Returns the number of files it asked storage to remove.
 */
export async function deleteStorageObjects(urls: (string | null | undefined)[]): Promise<number> {
  const byBucket = new Map<UploadBucket, Set<string>>();

  for (const url of urls) {
    const ref = parseStorageUrl(url);
    if (!ref) continue;
    const paths = byBucket.get(ref.bucket) ?? new Set<string>();
    paths.add(ref.path);
    byBucket.set(ref.bucket, paths);
  }

  let removed = 0;
  for (const [bucket, paths] of byBucket) {
    const list = [...paths];
    if (list.length === 0) continue;
    try {
      const { error } = await supabaseAdmin.storage.from(bucket).remove(list);
      if (error) {
        console.error(`[storage-cleanup] failed to remove from "${bucket}": ${error.message}`);
      } else {
        removed += list.length;
      }
    } catch (err) {
      console.error(`[storage-cleanup] error removing from "${bucket}":`, err);
    }
  }

  return removed;
}
