'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './server'

export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[auth] admin lookup failed', error)
    return false
  }

  return Boolean(data)
}

export async function signIn(email: string, password: string) {
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data, error } = await authClient.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: error.message }
  }

  // isAdminUser runs on the pristine `supabaseAdmin`, so it reads `admin_users` as service_role.
  if (data.user && !(await isAdminUser(data.user.id))) {
    return { success: false, error: 'Invalid login credentials' }
  }

  if (data.session) {
    const cookieStore = await cookies()
    const secure = process.env.NODE_ENV === 'production'

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

export async function getAdminUser() {
  const user = await getSession()
  if (!user) return null

  return (await isAdminUser(user.id)) ? user : null
}
