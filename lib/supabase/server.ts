import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Debug: Check if service role key is loaded (only in development)
if (process.env.NODE_ENV === 'development') {
  if (!supabaseServiceKey || supabaseServiceKey.length < 100) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set or invalid!')
    console.warn('Current value length:', supabaseServiceKey?.length)
    console.warn('Expected: JWT token with length ~160 characters')
    console.warn('Run: npm run supabase:status to get your credentials')
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY loaded (length:', supabaseServiceKey.length, ')')
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
