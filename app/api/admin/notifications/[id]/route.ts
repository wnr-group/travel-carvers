import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { markNotificationRead } from '@/lib/api/admin/notifications';
import { toApiError } from '@/lib/api/errors';

/** Mark a single notification as read. */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const data = await markNotificationRead(id);

    if (!data) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'notification');
    return NextResponse.json({ error: message }, { status });
  }
}
