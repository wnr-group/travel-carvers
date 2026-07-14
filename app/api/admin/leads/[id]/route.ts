import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { updateLeadStatus, deleteLead } from '@/lib/api/leads';
import { toApiError } from '@/lib/api/errors';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required.' }, { status: 400 });
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'converted'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 });
    }

    const data = await updateLeadStatus(id, status);
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
    await deleteLead(id);
    return NextResponse.json({ data: { id } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
