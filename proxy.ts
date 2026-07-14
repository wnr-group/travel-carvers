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

/**
 * Guards the admin area and keeps the session alive.
 *
 * Supabase access tokens expire after jwt_expiry (1h). Without a refresh the admin is
 * left holding a cookie containing a dead token: pages still render, but every API call
 * fails authorization. This runs ahead of both pages and route handlers and is the only
 * place that can write cookies for either, so it is where the refresh belongs.
 *
 * Uses the anon key — refreshing a session is exactly what an unprivileged client does,
 * and the service-role key must never be shipped to a proxy that may run at the edge.
 */
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  if (accessToken) {
    const { data } = await supabase.auth.getUser(accessToken)
    if (data.user) {
      return NextResponse.next()
    }
  }

  if (!refreshToken) {
    return deny(request)
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

  if (error || !data.session) {
    return deny(request)
  }

  // Make the fresh token visible to the page/route handler serving *this* request...
  request.cookies.set(AUTH_COOKIE, data.session.access_token)
  request.cookies.set(REFRESH_COOKIE, data.session.refresh_token)
  const response = NextResponse.next({ request })

  // ...and persist it in the browser. Refresh-token rotation is enabled, so the new
  // refresh token must be stored or the next refresh will be rejected.
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

function deny(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
