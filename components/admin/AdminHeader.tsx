'use client';

import { Bell, User, Search } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-brand-medium/20 flex items-center justify-between px-8 mb-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-medium" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-brand-lightest bg-brand-lightest/30 focus:outline-none focus:ring-2 focus:ring-brand-medium/50"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        <button className="text-brand-dark hover:text-brand-darkest transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-medium flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-brand-darkest font-medium">Admin User</span>
        </div>
      </div>
    </header>
  );
}