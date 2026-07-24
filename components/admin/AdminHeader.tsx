'use client';

import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import NotificationBell from '@/components/admin/NotificationBell';

interface AdminHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export default function AdminHeader({ isCollapsed, onToggleCollapse, onOpenMobile }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 mb-6 flex h-14 items-center justify-between border-b border-brand-medium/20 bg-white px-3 sm:px-6">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-brand-dark transition-colors hover:bg-brand-medium/10 hover:text-brand-darkest lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Collapse/Expand Toggle */}
        <button
          onClick={onToggleCollapse}
          className="relative group hidden rounded-lg p-2 text-brand-dark transition-colors hover:bg-brand-medium/10 hover:text-brand-darkest lg:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
          <span className="admin-tooltip pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded px-2.5 py-1.5 text-xs font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
        </button>
      </div>

      {/* Right cluster: identical on every admin page. */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <NotificationBell />

        {/* Logout lives in the sidebar; the header keeps identity only. */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-medium text-sm font-bold text-white">
            A
          </span>
          <span className="hidden text-sm font-medium text-brand-darkest sm:inline">Admin User</span>
        </div>
      </div>
    </header>
  );
}
