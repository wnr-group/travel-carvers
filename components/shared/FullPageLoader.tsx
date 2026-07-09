'use client'

import SpinningLoader from './SpinningLoader'

interface FullPageLoaderProps {
  message?: string
}

export default function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <SpinningLoader size={100} />
      {message && (
        <p className="mt-6 text-lg font-semibold text-gray-700">{message}</p>
      )}
    </div>
  )
}
