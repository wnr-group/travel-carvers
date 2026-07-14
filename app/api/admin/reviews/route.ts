import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { getAllReviews } from '@/lib/api/reviews';
import { toApiError } from '@/lib/api/errors';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getAllReviews();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
