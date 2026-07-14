'use client'; // This must be a client component to use usePathname

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <div className={!isLoginPage ? "flex min-h-screen bg-brand-tint-subtle" : ""}>
      {!isLoginPage && (
        <AdminNav 
          isCollapsed={isCollapsed} 
          isMobileOpen={isMobileOpen} 
          onCloseMobile={() => setIsMobileOpen(false)} 
        />
      )}
      
      <div 
        className={
          !isLoginPage 
            ? `flex-1 min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0` 
            : "w-full"
        }
      >
        {!isLoginPage && (
          <AdminHeader 
            isCollapsed={isCollapsed} 
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
            onOpenMobile={() => setIsMobileOpen(true)}
          />
        )}
        
        <main className={!isLoginPage ? "px-4 sm:px-8 pb-8" : ""}>
          {children}
        </main>
      </div>
    </div>
  )
}