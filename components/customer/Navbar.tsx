'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Sparkles } from 'lucide-react'
import SearchModal from './SearchModal'
import { useNavCategories } from '@/lib/hooks/useNavCategories'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Visa', href: '/visa', highlight: true }, // Highlighted Visa link
  { label: 'About Us', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const { data: navCategories } = useNavCategories()
  const categoryItems = (navCategories ?? []).map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
    highlight: false,
  }))
  const packagesIndex = NAV_ITEMS.findIndex((item) => item.href === '/packages')
  const insertAt = packagesIndex === -1 ? NAV_ITEMS.length : packagesIndex + 1
  const navItems = [...NAV_ITEMS.slice(0, insertAt), ...categoryItems, ...NAV_ITEMS.slice(insertAt)]

  return (
    <nav className="bg-gradient-brand-navbar shadow-lg sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Travel Carvers"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover border-2 border-white/50"
            />
            <div>
              <span className="block text-xl font-bold text-white">Travel Carvers</span>
              <p className="text-xs text-white/80">Explore Your Next Adventure</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 group ${
                    item.highlight 
                      ? 'text-white bg-white/15 rounded-full border border-white/30 shadow-inner hover:bg-white/25' 
                      : 'text-white hover:scale-110'
                  } ${active ? 'scale-105' : ''}`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.highlight && <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />}
                    {item.label}
                  </span>
                  {!item.highlight && (
                    <>
                      <span className={`absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transition-transform duration-300 ${active ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
                      <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ${active ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
                    </>
                  )}
                </Link>
              )
            })}

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-white rounded-lg hover:bg-white/10 hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Search packages, categories and destinations"
            >
              <Search aria-hidden="true" className="w-5 h-5" />
            </button>

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
                <svg aria-hidden="true" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Search packages, categories and destinations"
            >
              <Search aria-hidden="true" className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-semibold transition-all py-3 px-4 rounded-lg flex items-center justify-between ${
                      item.highlight ? 'bg-white/20 text-yellow-200 border border-white/30' : ''
                    } ${active ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      {item.highlight && <Sparkles className="w-4 h-4 text-yellow-300" />}
                      {item.label}
                    </span>
                    {item.highlight && <span className="text-[10px] uppercase tracking-widest bg-yellow-400 text-brand-darkest font-extrabold px-2 py-0.5 rounded-full">Fast Track</span>}
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
                  <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}