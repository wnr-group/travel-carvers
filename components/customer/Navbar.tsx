'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-[#1A3C34] to-[#A9B388] shadow-lg sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt="Travel Carvers"
              className="h-12 w-12 rounded-full object-cover border-2 border-white/50"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Travel Carvers</h1>
              <p className="text-xs text-white/80">Explore Your Next Adventure</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-white/80 font-medium transition-colors">
              Home
            </Link>
            <Link href="#packages" className="text-white hover:text-white/80 font-medium transition-colors">
              Packages
            </Link>
            <Link href="#destinations" className="text-white hover:text-white/80 font-medium transition-colors">
              Destinations
            </Link>
            <Link href="#about" className="text-white hover:text-white/80 font-medium transition-colors">
              About Us
            </Link>
            <Link href="#contact" className="text-white hover:text-white/80 font-medium transition-colors">
              Contact
            </Link>

            {/* CTA Button */}
            <button className="px-6 py-2 bg-[#1A3C34] backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30">
              Get Quote
            </button>
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
              <Link
                href="/"
                className="text-white hover:text-white/80 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#packages"
                className="text-white hover:text-white/80 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Packages
              </Link>
              <Link
                href="#destinations"
                className="text-white hover:text-white/80 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link
                href="#about"
                className="text-white hover:text-white/80 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="text-white hover:text-white/80 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <button className="mt-2 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30 text-center">
                Get Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
