import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local file
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        const value = valueParts.join('=').trim()
        if (key && value) {
          process.env[key] = value
        }
      }
    })
  } catch {
    console.warn('Could not load .env.local file')
  }
}

loadEnv()

// Get Supabase credentials from environment or use local dev defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set!')
  console.error('Run: npm run supabase:status')
  console.error('Then copy the service_role key to your .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedAdmin() {
  console.log('🌱 Seeding admin user...')

  const email = 'admin@travelcarvers.in'
  const password = 'Admin@123'

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()

  const existing = existingUsers?.users.find((user) => user.email === email)

  let userId = existing?.id

  if (existing) {
    console.log('✅ Admin user already exists:', email)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error('❌ Error creating admin user:', error.message)
      process.exit(1)
    }

    userId = data.user.id
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
  }

  const { error: grantError } = await supabase
    .from('admin_users')
    .upsert({ user_id: userId, email }, { onConflict: 'user_id' })

  if (grantError) {
    console.error('❌ Error granting admin access:', grantError.message)
    console.error('   Has the admin_users migration been applied? Run: npx supabase migration up')
    process.exit(1)
  }

  console.log('🔐 Admin access granted (admin_users)')
  console.log('🔗 Login at: http://localhost:3000/admin/login')
}

seedAdmin()
  .then(() => {
    console.log('\n✨ Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
