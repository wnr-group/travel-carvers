import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fast admin-auth helpers shared by the middleware and the server-side guards.
 *
 * The old path called `auth.getUser()` (a network round-trip to the Supabase auth
 * server) on every admin request, plus a fresh `admin_users` query — twice over,
 * once in the middleware and once in the route/page guard. That added ~4 sequential
 * round-trips to Supabase per request and made the admin panel feel sluggish.
 *
 * Instead:
 *  - Verify the access token *locally* with `getClaims()`. Supabase now signs
 *    tokens with an asymmetric key (ES256), so the signature + expiry can be
 *    checked against the cached JWKS with no per-request network call.
 *  - Cache the (tiny, rarely-changing) set of admin user ids in memory with a
 *    short TTL instead of querying `admin_users` on every request.
 */

/**
 * Verify a Supabase access token locally and return its user id (`sub`), or null
 * if the token is missing, malformed, expired, or has an invalid signature.
 * After the first call the JWKS is cached on the client, so this is network-free.
 */
export async function verifyAccessToken(
  client: SupabaseClient,
  token: string | undefined | null
): Promise<string | null> {
  if (!token) return null;
  try {
    const { data, error } = await client.auth.getClaims(token);
    if (error || !data?.claims?.sub) return null;
    return data.claims.sub as string;
  } catch {
    return null;
  }
}

let cachedAdminIds: Set<string> | null = null;
let cacheExpiresAt = 0;
const ADMIN_CACHE_TTL_MS = 60_000; // 1 minute — admins change rarely

/**
 * Whether `userId` is an admin. Caches the full `admin_users` id set per runtime
 * instance for a minute, so repeated requests skip the DB round-trip. `service`
 * must be a service-role client (RLS-exempt). On a lookup error it falls back to
 * the last good cache, and denies only if there is none (fail-closed).
 */
export async function isAdminId(service: SupabaseClient, userId: string): Promise<boolean> {
  const now = Date.now();

  if (!cachedAdminIds || now >= cacheExpiresAt) {
    const { data, error } = await service.from('admin_users').select('user_id');
    if (error) {
      console.error('[adminAuth] admin lookup failed', error);
      return cachedAdminIds ? cachedAdminIds.has(userId) : false;
    }
    cachedAdminIds = new Set((data ?? []).map((row) => row.user_id as string));
    cacheExpiresAt = now + ADMIN_CACHE_TTL_MS;
  }

  return cachedAdminIds.has(userId);
}
