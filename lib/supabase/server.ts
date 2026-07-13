import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  if (!supabaseServiceKey || supabaseServiceKey.length < 100) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set or invalid. Expected JWT token with length ~160 characters. Run: npm run supabase:status to get your credentials'
    )
  }
}

// Server-side client with service role key (full access)
// Use only in Server Actions and API routes
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
