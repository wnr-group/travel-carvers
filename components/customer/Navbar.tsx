'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Countries', href: '/countries' },
  { label: 'India', href: '/india' },
  { label: 'About Us', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-brand-navbar shadow-lg sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Travel Carvers"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover border-2 border-white/50"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Travel Carvers</h1>
              <p className="text-xs text-white/80">Explore Your Next Adventure</p>
            </div>
          </Link>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-white font-semibold transition-all duration-300 hover:scale-110 group ${active ? 'scale-105' : ''
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transition-transform duration-300 ${active ? 'scale-100' : 'scale-0 group-hover:scale-100'
                    }`}></span>
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ${active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}></span>
                </Link>
              )
            })}

            {/* Contact Us Button */}
            <Link
              href="/contact"
              onClick={(e) => {
                if (pathname === '/contact') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <button className="ml-2 px-6 py-2.5 bg-white text-brand-darkest rounded-xl font-bold hover:bg-white/95 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 group">
                <span>Contact Us</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-semibold transition-all py-3 px-4 rounded-lg hover:translate-x-2 ${active
                      ? 'bg-white/20 text-white'
                      : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (pathname === '/contact') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <button className="w-full mt-4 px-6 py-3 bg-white text-brand-darkest rounded-xl font-bold hover:bg-white/95 hover:scale-105 transition-all shadow-lg text-center flex items-center justify-center gap-2">
                  <span>Contact Us</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
