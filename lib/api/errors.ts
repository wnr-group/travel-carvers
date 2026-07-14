/**
  convert database errors (Supabase/Postgres errors) into safe, user-friendly HTTP responses.
 
 * Raw Postgres messages ("duplicate key value violates unique constraint
 * categories_slug_key") disclose the schema, so they are logged server-side and replaced
 * with a friendly message before they reach the client.
 */

const UNIQUE_VIOLATION = '23505'
const FOREIGN_KEY_VIOLATION = '23503'
const NO_ROWS_RETURNED = 'PGRST116'

interface PostgrestLikeError {
  code: string
  message: string
}

function isPostgrestError(error: unknown): error is PostgrestLikeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  )
}

export function toApiError(error: unknown): { message: string; status: number } {
  console.error('[api]', error)

  if (isPostgrestError(error)) {
    switch (error.code) {
      case UNIQUE_VIOLATION:
        return {
          message: 'A category with that name or slug already exists',
          status: 409,
        }
      case FOREIGN_KEY_VIOLATION:
        return {
          message: 'This record is still referenced by other data',
          status: 409,
        }
      case NO_ROWS_RETURNED:
        return { message: 'Category not found', status: 404 }
    }
  }

  return { message: 'Something went wrong. Please try again.', status: 500 }
}
