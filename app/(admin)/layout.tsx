'use client'; // This must be a client component to use usePathname

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

  return (
    <div className={!isLoginPage ? "flex min-h-screen bg-brand-tint-subtle" : ""}>
      {!isLoginPage && <AdminNav />}
      
      <div className={!isLoginPage ? "ml-64 flex-1" : "w-full"}>
        {!isLoginPage && <AdminHeader />}
        
        <main className={!isLoginPage ? "px-8 pb-8" : ""}>
          {children}
        </main>
      </div>
    </div>
  )
}