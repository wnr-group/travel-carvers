'use server'

import { signIn } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  const result = await signIn(email, password)

  if (result.success) {
    redirect('/admin/dashboard')
  }

  return result
}
