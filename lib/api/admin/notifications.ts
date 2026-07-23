import { supabaseAdmin } from '@/lib/supabase/server';

/** Kinds the feed understands. 'system' is unused today — reserved for future events. */
export const NOTIFICATION_TYPES = ['lead', 'contact', 'review', 'system'] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

/** The panel is a recent-activity list, not an archive. */
const FEED_LIMIT = 20;

export async function getNotifications(): Promise<{
  items: AdminNotification[];
  unreadCount: number;
}> {
  const [feed, unread] = await Promise.all([
    supabaseAdmin
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(FEED_LIMIT),
    // Counted separately so the badge stays correct when unread items fall past the limit.
    supabaseAdmin
      .from('admin_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
  ]);

  if (feed.error) throw feed.error;
  if (unread.error) throw unread.error;

  return {
    items: (feed.data ?? []) as AdminNotification[],
    unreadCount: unread.count ?? 0,
  };
}

export async function markNotificationRead(id: string) {
  const { data, error } = await supabaseAdmin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function markAllNotificationsRead() {
  const { error } = await supabaseAdmin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw error;
  return { success: true };
}
