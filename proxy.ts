import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminId, verifyAccessToken } from '@/lib/supabase/adminAuth'

const AUTH_COOKIE = 'supabase-auth-token'
const REFRESH_COOKIE = 'supabase-refresh-token'
const LOGIN_PATH = '/admin/login'

// Created once per runtime instance so the JWKS cache (used for local token
// verification) and connections persist across requests instead of being
// rebuilt every time.
const authClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
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

  // Fast path: verify the access token locally (no auth-server round-trip).
  if (accessToken) {
    const userId = await verifyAccessToken(authClient, accessToken)
    if (userId) {
      return (await isAdminId(serviceClient, userId)) ? NextResponse.next() : forbid(request)
    }
  }

  // Slow path: access token missing/expired — refresh it (needs the auth server).
  if (!refreshToken) {
    return deny(request)
  }

  const { data, error } = await authClient.auth.refreshSession({ refresh_token: refreshToken })

  if (error || !data.session) {
    return deny(request)
  }

  if (!(await isAdminId(serviceClient, data.session.user.id))) {
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
