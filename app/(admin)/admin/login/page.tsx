'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loginAction } from './actions'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter() 

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await loginAction(formData)

      if (result.success) {
        toast.success('Login successful!')
        // `replace`, so Back does not return to the login screen of an active session.
        router.replace('/admin/dashboard')
        // Deliberately stays loading: the navigation is still in flight, and re-enabling
        // the button here makes the form look idle while the dashboard is loading.
        return
      }

      toast.error(result.error || 'Login failed')
      setIsLoading(false)
    } catch (e) {
      toast.error('An error occurred. Please try again.')
      console.error(e)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-brand-primary">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Travel Carvers" width={64} height={64} className="h-16 w-16 rounded-full object-cover" priority />
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Travel Carvers Admin Panel
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue="admin@travelcarvers.in"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-gray-900 bg-white text-base lg:text-sm"
              placeholder="admin@travelcarvers.in"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              defaultValue="Admin@123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-gray-900 bg-white text-base lg:text-sm"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-dark text-white py-3 rounded-lg font-semibold hover:bg-brand-darkest hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Default credentials:</p>
          <p className="font-mono text-xs mt-1">admin@travelcarvers.in / Admin@123</p>
        </div>
      </div>
    </div>
  )
}
