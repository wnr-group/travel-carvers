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
    // Set session in cookies
    const cookieStore = await cookies()
    cookieStore.set('supabase-auth-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 6, // 6 hours
      path: '/',
    })

    cookieStore.set('supabase-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 6, // 6 hours
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
