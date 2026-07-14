import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const AUTH_COOKIE = 'supabase-auth-token'
const REFRESH_COOKIE = 'supabase-refresh-token'
const LOGIN_PATH = '/admin/login'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The login page must stay reachable while signed out.
  if (pathname === LOGIN_PATH) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(AUTH_COOKIE)?.value
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value

  if (!accessToken && !refreshToken) {
    return deny(request)
  }

  // Anon key: refreshing a session is exactly what an unprivileged client does.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  if (accessToken) {
    const { data } = await supabase.auth.getUser(accessToken)

    if (data.user) {
      return (await isAdmin(data.user.id)) ? NextResponse.next() : forbid(request)
    }
  }

  if (!refreshToken) {
    return deny(request)
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

  if (error || !data.session) {
    return deny(request)
  }


  if (!(await isAdmin(data.session.user.id))) {
    return forbid(request)
  }

  request.cookies.set(AUTH_COOKIE, data.session.access_token)
  request.cookies.set(REFRESH_COOKIE, data.session.refresh_token)
  const response = NextResponse.next({ request })

  response.cookies.set(AUTH_COOKIE, data.session.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: data.session.expires_in,
  })
  response.cookies.set(REFRESH_COOKIE, data.session.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}

async function isAdmin(userId: string): Promise<boolean> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data, error } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  // Fail closed: a broken lookup denies access rather than granting it.
  if (error) {
    console.error('[proxy] admin lookup failed', error)
    return false
  }

  return Boolean(data)
}

/** Not signed in. */
function deny(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
}

/**
 * Signed in, but not an admin.
 */
function forbid(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
