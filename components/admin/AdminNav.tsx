'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Mail,
  Settings, Home, MessageSquare, X,
  Award, BarChart3, MapPin, FileText
} from 'lucide-react';
import LogoutButton from '@/app/(admin)/admin/dashboard/LogoutButton';
import { Quote } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { href: '/admin/visa', label: 'Visa', icon: FileText },
  { href: '/admin/leads', label: 'Leads', icon: Mail },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/trust-badges', label: 'Trust Badges', icon: Award },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminNavProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminNav({ isCollapsed, isMobileOpen, onCloseMobile }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      <nav 
        className={`bg-brand-darkest h-screen fixed left-0 top-0 p-4 flex flex-col z-40 w-64 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20 lg:p-2 lg:overflow-visible' : 'lg:w-64'}` }
      >
        
        {/* Logo Area */}
        <div className={`mb-8 px-4 flex items-center justify-between ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
          <div className={isCollapsed ? 'lg:hidden' : 'block'}>
            <h1 className="text-white text-xl font-bold">Travel Carvers</h1>
            <p className="text-white/60 text-sm">Admin Panel</p>
          </div>
          {isCollapsed && (
            <div className="hidden lg:block text-white text-xl font-black text-center w-full">
              TC
            </div>
          )}
          
          {/* Close button for Mobile Drawer */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden text-white/70 hover:text-white p-1 hover:bg-white/10 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation list */}
        <ul className={`space-y-2 flex-1 overflow-y-auto ${isCollapsed ? 'lg:items-center lg:overflow-visible' : ''}`}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${
                    isActive 
                      ? 'bg-brand-medium text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'lg:justify-center lg:px-0 lg:w-16 lg:mx-auto' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={isCollapsed ? 'lg:hidden' : 'block'}>{item.label}</span>
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1.5 admin-tooltip text-xs font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 hidden lg:block">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom logout area */}
        <div className={`border-t border-white/10 pt-4 mt-auto ${isCollapsed ? 'lg:overflow-visible' : ''}`}>
          <LogoutButton isCollapsed={isCollapsed} />
        </div>
      </nav>
    </>
  );
}