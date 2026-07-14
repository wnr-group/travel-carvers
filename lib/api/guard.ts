import { NextResponse } from 'next/server'
import { getSession, isAdminUser } from '@/lib/supabase/auth'

export async function requireAdmin(): Promise<NextResponse | null> {
  const user = await getSession()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await isAdminUser(user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}
