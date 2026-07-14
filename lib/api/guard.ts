import { NextResponse } from 'next/server'
import { getSession } from '@/lib/supabase/auth'

/**
 * Admin route handlers query Supabase with the service-role key, which bypasses RLS.
 * They must therefore verify the caller is a signed-in admin themselves.
 *
 * Returns a 401 response to bail out with, or `null` when the caller is allowed.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
