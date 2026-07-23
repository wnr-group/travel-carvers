'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api/fetchJson';
import type { AdminNotification, NotificationType } from '@/lib/api/admin/notifications';

export type { AdminNotification, NotificationType };

export const ADMIN_NOTIFICATIONS_KEY = ['admin', 'notifications'] as const;

interface NotificationFeed {
  items: AdminNotification[];
  unreadCount: number;
}

const POLL_INTERVAL = 60 * 1000;

export function useAdminNotifications() {
  return useQuery({
    queryKey: ADMIN_NOTIFICATIONS_KEY,
    queryFn: () => fetchJson<NotificationFeed>('/api/admin/notifications'),
    refetchInterval: POLL_INTERVAL,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/notifications/${id}`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_NOTIFICATIONS_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchJson<{ success: boolean }>('/api/admin/notifications', { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_NOTIFICATIONS_KEY });
    },
  });
}
