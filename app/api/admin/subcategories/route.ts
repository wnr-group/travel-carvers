import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { getSubcategoriesAdmin } from '@/lib/api/categories';
import { toApiError } from '@/lib/api/errors';

/**
 * Lists every subcategory with the categories it belongs to.
 *
 * `getSubcategoriesAdmin` already existed as a data function but was never exposed over
 * HTTP, so nothing in the browser could reach it. Same shape as the categories route:
 * requireAdmin, then `{ data }` / `{ error }`.
 */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getSubcategoriesAdmin();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
