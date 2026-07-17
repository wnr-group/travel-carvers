import { headers } from 'next/headers';

/**
 * Best-effort in-memory sliding-window rate limiter.
 *
 * Scope: a single server instance (process-local). This is intended to blunt
 * casual abuse of the public review/upload server actions; for multi-instance
 * production hardening this should be backed by a shared store (e.g. Redis /
 * Postgres). It deliberately fails-open only across instances, never within one.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false; // over the limit
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return true; // allowed
}

/**
 * Derives a best-effort client identifier for rate-limiting from request headers.
 * Falls back to a shared bucket when no IP is available (still limits total load).
 */
export async function clientRateKey(scope: string): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return `${scope}:${ip}`;
}
