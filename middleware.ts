import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('supabase-auth-token')

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('supabase-auth-token')

    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
