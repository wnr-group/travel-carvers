'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './server'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (data.session) {
    const cookieStore = await cookies()
    const secure = process.env.NODE_ENV === 'production'

    // The access token is only valid for `expires_in` seconds (jwt_expiry, 1h by default).
    // Giving the cookie a longer life than the token it holds leaves the user "logged in"
    // with a dead token: pages render but every API call 401s. Keep the two in step and
    // let proxy.ts mint a new one from the refresh token.
    cookieStore.set('supabase-auth-token', data.session.access_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: data.session.expires_in,
      path: '/',
    })

    cookieStore.set('supabase-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days — this is what keeps the admin signed in
      path: '/',
    })
  }

  return { success: true, user: data.user }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('supabase-auth-token')
  cookieStore.delete('supabase-refresh-token')

  // Also sign out from Supabase
  await supabaseAdmin.auth.signOut()

  redirect('/admin/login')
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('supabase-auth-token')

    if (!token) {
      return null
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token.value)

    if (error || !data.user) {
      return null
    }

    return data.user
  } catch {
    return null
  }
}
