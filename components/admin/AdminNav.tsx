'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, FolderTree, Mail, 
  Star, Home, Settings, MessageSquare 
} from 'lucide-react';
import LogoutButton from '@/app/(admin)/admin/dashboard/LogoutButton';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/leads', label: 'Leads', icon: Mail },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    // 1. Added 'flex flex-col' to the main container
    <nav className="w-64 bg-brand-darkest h-screen fixed left-0 top-0 p-4 flex flex-col">
      
      {/* Logo Area */}
      <div className="mb-8 px-4">
        <h1 className="text-white text-xl font-bold">Travel Carvers</h1>
        <p className="text-white/60 text-sm">Admin Panel</p>
      </div>

      {/* 2. Added 'flex-1' so this list pushes the next div to the bottom */}
      <ul className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-medium text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 3. This div is automatically pushed to the bottom because of flex-1 above */}
      <div className="border-t border-white/10 pt-4 mt-auto">
        <LogoutButton />
      </div>
    </nav>
  );
}