'use client'

import { signOut } from '@/lib/supabase/auth'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error)
      }
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-3 w-full justify-start text-white/70 hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 ${
        isCollapsed ? 'lg:justify-center lg:px-0 lg:w-16 lg:mx-auto' : ''
      }`}
      title={isCollapsed ? "Logout" : undefined}
    >
      <LogOut className="w-5 h-5 flex-shrink-0" />
      <span className={isCollapsed ? 'lg:hidden' : 'block'}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </span>
    </button>
  )
}