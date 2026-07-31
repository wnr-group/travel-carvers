import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidatePackagePages } from '@/lib/api/revalidate';
import { approveReview, rejectReview, deleteReview } from '@/lib/api/admin/reviews';
import { toApiError } from '@/lib/api/errors';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    let data;
    if (action === 'approve') {
      data = await approveReview(id);
    } else if (action === 'reject') {
      data = await rejectReview(id);
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be approve or reject.' }, { status: 400 });
    }

    revalidatePackagePages();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    await deleteReview(id);
    revalidatePackagePages();
    return NextResponse.json({ data: { id } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
