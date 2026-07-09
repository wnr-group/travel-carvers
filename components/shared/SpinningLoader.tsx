'use client'

import Image from 'next/image'

interface SpinningLoaderProps {
  size?: number
  className?: string
}

export default function SpinningLoader({ size = 80, className = '' }: SpinningLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="relative animate-spin-3d"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <Image
            src="/logo.png"
            alt="Travel Carvers"
            width={size}
            height={size}
            className="w-full h-full object-cover rounded-full"
            priority
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-3d {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        .animate-spin-3d {
          animation: spin-3d 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
