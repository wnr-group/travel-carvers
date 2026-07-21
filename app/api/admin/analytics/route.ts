import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { getAnalyticsSummary } from '@/lib/api/analytics';
import { toApiError } from '@/lib/api/errors';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getAnalyticsSummary();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
