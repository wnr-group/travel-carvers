import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { getNotifications, markAllNotificationsRead } from '@/lib/api/admin/notifications';
import { toApiError } from '@/lib/api/errors';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getNotifications();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'notification');
    return NextResponse.json({ error: message }, { status });
  }
}

/** Mark every unread notification as read. */
export async function PATCH() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await markAllNotificationsRead();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'notification');
    return NextResponse.json({ error: message }, { status });
  }
}
