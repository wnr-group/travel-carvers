import { getSession } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutButton from './LogoutButton'

export default async function AdminDashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#FEFAE0]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#5F6F52] to-[#A9B388] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Travel Carvers" width={48} height={48} className="h-12 w-12 rounded-full object-cover border-2 border-white/50" />
              <div>
                <h1 className="text-2xl font-bold text-white">Travel Carvers Admin</h1>
                <p className="text-sm text-white/80">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center text-[#5F6F52] font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.email}</p>
                  <p className="text-xs text-white/70">Administrator</p>
                </div>
              </div>

              {/* Logout Button */}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#A9B388] to-[#A9B388] rounded-xl shadow-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h2>
          <p className="text-white/90">
            Manage your travel packages, destinations, and customer leads from this dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#A9B388]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Packages</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-[#5F6F52]">0</p>
            <p className="text-xs text-gray-500 mt-1">No packages yet</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#A9B388]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
              <span className="text-2xl">📧</span>
            </div>
            <p className="text-3xl font-bold text-[#5F6F52]">0</p>
            <p className="text-xs text-gray-500 mt-1">No inquiries yet</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#A9B388]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Destinations</h3>
              <span className="text-2xl">🌍</span>
            </div>
            <p className="text-3xl font-bold text-[#5F6F52]">0</p>
            <p className="text-xs text-gray-500 mt-1">No destinations yet</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#5F6F52] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-gradient-to-br from-[#A9B388]/20 to-[#A9B388]/10 text-[#5F6F52] rounded-xl font-semibold hover:from-[#A9B388]/30 hover:to-[#A9B388]/20 hover:shadow-lg hover:scale-105 transition-all border border-[#A9B388]/30">
              <span className="text-4xl">➕</span>
              <span>Add Package</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-gradient-to-br from-[#A9B388]/20 to-[#A9B388]/10 text-[#5F6F52] rounded-xl font-semibold hover:from-[#A9B388]/30 hover:to-[#A9B388]/20 hover:shadow-lg hover:scale-105 transition-all border border-[#A9B388]/30">
              <span className="text-4xl">📋</span>
              <span>View Leads</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-gradient-to-br from-[#A9B388]/20 to-[#A9B388]/10 text-[#5F6F52] rounded-xl font-semibold hover:from-[#A9B388]/30 hover:to-[#A9B388]/20 hover:shadow-lg hover:scale-105 transition-all border border-[#A9B388]/30">
              <span className="text-4xl">🗺️</span>
              <span>Destinations</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-gradient-to-br from-[#A9B388]/20 to-[#A9B388]/10 text-[#5F6F52] rounded-xl font-semibold hover:from-[#A9B388]/30 hover:to-[#A9B388]/20 hover:shadow-lg hover:scale-105 transition-all border border-[#A9B388]/30">
              <span className="text-4xl">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-8 text-center bg-[#FEFAE0] py-3 px-4 rounded-lg">
            💡 These features will be implemented after database schema is ready.
          </p>
        </div>
      </main>
    </div>
  )
}
