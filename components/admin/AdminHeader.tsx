'use client';

import { Bell, Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export default function AdminHeader({ isCollapsed, onToggleCollapse, onOpenMobile }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-brand-medium/20 flex items-center justify-between px-4 sm:px-8 mb-8 sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={onOpenMobile}
          className="lg:hidden text-brand-dark hover:text-brand-darkest transition-colors p-2 hover:bg-brand-medium/10 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Collapse/Expand Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:block text-brand-dark hover:text-brand-darkest transition-colors p-2 hover:bg-brand-medium/10 rounded-lg"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* Search Bar */}
        <div className="relative w-40 sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-medium" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-brand-lightest bg-brand-lightest/30 text-base lg:text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="text-brand-dark hover:text-brand-darkest transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-medium flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="text-brand-darkest font-medium text-sm hidden sm:inline">Admin User</span>
        </div>
      </div>
    </header>
  );
}