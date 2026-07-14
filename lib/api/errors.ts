/**
  convert database errors (Supabase/Postgres errors) into safe, user-friendly HTTP responses.
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

/**
 * @param resource what the caller is working with ("category", "package"), so a duplicate-slug
 *   message names the right thing. It used to be hardcoded to "category", which read as
 *   nonsense the moment a second route started using this.
 */
export function toApiError(
  error: unknown,
  resource = 'record'
): { message: string; status: number } {
  console.error('[api]', error)

  if (isPostgrestError(error)) {
    switch (error.code) {
      case UNIQUE_VIOLATION:
        return {
          message: `A ${resource} with that name or slug already exists`,
          status: 409,
        }
      case FOREIGN_KEY_VIOLATION:
        return {
          message: 'This record is still referenced by other data',
          status: 409,
        }
      case NO_ROWS_RETURNED:
        return { message: `${resource[0].toUpperCase()}${resource.slice(1)} not found`, status: 404 }
    }
  }

  return { message: 'Something went wrong. Please try again.', status: 500 }
}
