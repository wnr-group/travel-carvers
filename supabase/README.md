# Supabase Setup for Travel Globe

## Local Development Setup

### 1. Start Supabase Local Instance

```bash
npx supabase start
```

This will start Docker containers for:
- PostgreSQL database
- Auth server
- Storage server
- Realtime server

### 2. Get Local Credentials

After starting, run:
```bash
npx supabase status
```

Copy these values to your `.env.local`:
- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Storage Buckets Setup

The following buckets need to be created (will be done via migration later):

- `destinations` - Store destination/country images
- `packages` - Store travel package images
- `attractions` - Store tourist attraction images

Each bucket will have:
- Public access for reading
- Authenticated access for uploading (admin only)

### 4. Stop Supabase

```bash
npx supabase stop
```

## Production Setup

When ready to deploy:

1. Create project at [supabase.com](https://supabase.com)
2. Get production credentials from project settings
3. Update `.env.local` or deployment environment variables
4. Run migrations: `npx supabase db push`

## Database Schema

Schema and tables will be added in future migrations under `supabase/migrations/`.

## Useful Commands

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# View status and credentials
npx supabase status

# Create new migration
npx supabase migration new <migration_name>

# Reset database (destructive!)
npx supabase db reset

# Push migrations to remote
npx supabase db push
```
