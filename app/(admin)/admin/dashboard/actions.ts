'use server'

import { signOut } from '@/lib/supabase/auth'

export async function logoutAction() {
  await signOut()
}
