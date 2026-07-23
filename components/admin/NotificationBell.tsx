'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Star,
  type LucideIcon,
} from 'lucide-react';
import {
  useAdminNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  type NotificationType,
} from '@/lib/hooks/useAdminNotifications';

/** Per-type glyph and tint, so the feed is scannable without reading every line. */
const TYPE_STYLE: Record<NotificationType, { Icon: LucideIcon; className: string; label: string }> = {
  lead: { Icon: Mail, className: 'bg-blue-50 text-blue-600', label: 'Lead' },
  contact: { Icon: MessageSquare, className: 'bg-violet-50 text-violet-600', label: 'Contact' },
  review: { Icon: Star, className: 'bg-amber-50 text-amber-600', label: 'Review' },
  system: { Icon: Info, className: 'bg-slate-100 text-slate-600', label: 'System' },
};

/** "just now" / "5m ago" / "3d ago" — precise enough for an activity feed. */
function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError } = useAdminNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
        }
        className="relative rounded-lg p-2 text-brand-dark transition-colors hover:bg-brand-medium/10 hover:text-brand-darkest"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-40 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-brand-darkest">Notifications</p>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-lightest/40 disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : isError ? (
              <p className="px-4 py-10 text-center text-sm text-rose-600">
                Could not load notifications.
              </p>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm font-semibold text-gray-700">No notifications yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  New leads, enquiries and reviews will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((item) => {
                  const style = TYPE_STYLE[item.type] ?? TYPE_STYLE.system;
                  const { Icon } = style;

                  const content = (
                    <>
                      <span
                        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${style.className}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className={`text-sm leading-snug ${
                              item.is_read ? 'text-gray-600' : 'font-semibold text-brand-darkest'
                            }`}
                          >
                            {item.title}
                          </span>
                          {!item.is_read && (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-rose-500"
                            />
                          )}
                        </span>
                        {item.body && (
                          <span className="mt-0.5 line-clamp-2 block text-xs text-gray-500">
                            {item.body}
                          </span>
                        )}
                        <span className="mt-1 block text-[11px] font-medium text-gray-400">
                          {style.label} · {relativeTime(item.created_at)}
                        </span>
                      </span>
                    </>
                  );

                  const onActivate = () => {
                    if (!item.is_read) markRead.mutate(item.id);
                    setIsOpen(false);
                  };

                  const className = `flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-lightest/20 ${
                    item.is_read ? '' : 'bg-brand-lightest/10'
                  }`;

                  return (
                    <li key={item.id}>
                      {item.link ? (
                        <Link href={item.link} onClick={onActivate} className={className}>
                          {content}
                        </Link>
                      ) : (
                        <button type="button" onClick={onActivate} className={className}>
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
