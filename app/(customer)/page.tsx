'use client';

import { useEffect, useRef } from 'react';
import HeroSection from '@/components/customer/HeroSection';
import { Globe, Package, HeartHandshake, Smile, Compass, MapPin, Plane } from 'lucide-react';

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="w-full overflow-y-auto">
      {/* Hero Section with Carousel and Map */}
      <HeroSection />

      {/* Trending Packages Section */}
      <section className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12 scroll-animate opacity-0 translate-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-2">
                Trending Packages
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our most popular destinations
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1A3C34] to-[#A9B388] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
              View More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bali Paradise - 7 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    POPULAR
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Bali Paradise</h3>
                  <p className="text-white/90 text-sm mb-3">7 Days • All Inclusive</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full backdrop-blur-sm">Beaches</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full backdrop-blur-sm">Temples</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹45,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dubai Luxury - 5 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    LUXURY
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Dubai Luxury</h3>
                  <p className="text-white/90 text-sm mb-3">5 Days • Premium Hotels</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full backdrop-blur-sm">Desert</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full backdrop-blur-sm">City Tour</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹59,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kerala Backwaters - 6 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    TRENDING
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Kerala Backwaters</h3>
                  <p className="text-white/90 text-sm mb-3">6 Days • Houseboat Stay</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Nature</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Ayurveda</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹32,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Switzerland Alps - 8 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    PREMIUM
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Switzerland Alps</h3>
                  <p className="text-white/90 text-sm mb-3">8 Days • Mountain Resorts</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Alps</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Scenic</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹1,25,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goa Beach Escape - 4 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '400ms' }}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    HOT DEAL
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Goa Beach Escape</h3>
                  <p className="text-white/90 text-sm mb-3">4 Days • Beach Resort</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Party</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Beaches</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹18,999</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Maldives Honeymoon - 5 Days */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '500ms' }}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent group-hover:from-[#A9B388]/80 transition-all"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold">
                    ROMANTIC
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Maldives Honeymoon</h3>
                  <p className="text-white/90 text-sm mb-3">5 Days • Overwater Villas</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Luxury</span>
                      <span className="px-2 py-1 bg-[#1A3C34]/50 rounded-full">Romance</span>
                    </div>
                    <span className="text-white font-bold text-lg">₹95,999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View More Button */}
          <div className="md:hidden mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A9B388] to-[#A9B388] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
              View More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#FEFAE0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-4">
              Travel Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose your perfect adventure from our curated travel experiences
            </p>
          </div>

          {/* Vertical Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

              {/* International Packages */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C34] via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">International</h3>
                    <p className="text-white/90 text-sm">Explore the world</p>
                  </div>
                </div>
              </div>

              {/* Domestic */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '100ms' }}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/90 via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Domestic</h3>
                    <p className="text-white/90 text-sm">India tours</p>
                  </div>
                </div>
              </div>

              {/* Group Tours */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '200ms' }}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C34] via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Group Tours</h3>
                    <p className="text-white/90 text-sm">Travel together</p>
                  </div>
                </div>
              </div>

              {/* Honeymoon Package */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '300ms' }}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/90 via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Honeymoon</h3>
                    <p className="text-white/90 text-sm">Romance awaits</p>
                  </div>
                </div>
              </div>

              {/* Stranger Trips */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '300ms' }}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C34] via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Stranger Trips</h3>
                    <p className="text-white/90 text-sm">Make friends</p>
                  </div>
                </div>
              </div>

              {/* Weddings */}
              <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-10 hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '400ms' }}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/90 via-[#A9B388]/50 to-transparent group-hover:from-[#A9B388]/90 transition-all"></div>
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Weddings</h3>
                    <p className="text-white/90 text-sm">Destination weddings</p>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </section>

      {/* Stats/Badges Section */}
      <section className="py-24 bg-[#FEFAE0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A3C34] mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { val: "50+", label: "Countries", icon: Globe },
              { val: "200+", label: "Packages", icon: Package },
              { val: "24/7", label: "Support", icon: HeartHandshake },
              { val: "10K+", label: "Travelers", icon: Smile },
              { val: "500+", label: "Guides", icon: Compass },
              { val: "1K+", label: "Spots", icon: MapPin },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-pointer relative">
                
                {/* Stamp Frame with Forward Orbiting Plane */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                  <div className="absolute w-full h-full rounded-full border-4 border-dashed border-[#A9B388] group-hover:border-[#1A3C34] animate-[spin_20s_linear_infinite] transition-colors duration-500"></div>
                  
                  {/*Plane */}
                  <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
                    <Plane className="w-6 h-6 text-[#1A3C34] absolute -top-3 left-1/2 rotate-45" />
                  </div>

                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A9B388] to-[#8FA08B] group-hover:from-[#1A3C34] group-hover:to-[#1A3C34] flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500">
                    <stat.icon className="w-7 h-7 mb-1" />
                    <span className="text-lg font-bold">{stat.val}</span>
                  </div>
                </div>
                
                <p className="text-[#1A3C34] font-bold uppercase tracking-[0.2em] text-xs transition-colors duration-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-6">
            {["World Class", "Award Winning", "Best Price", "Secure Booking", "Expert Guides"].map((text, i) => (
              <div key={i} className="relative  bg-gradient-to-br from-[#1A3C34] to-[#A9B388] group-hover:bg-[#1A3C34] text-white px-6 py-3 rounded-sm shadow-md font-bold text-sm uppercase tracking-widest overflow-hidden hover:bg-[#1A3C34] transition-colors duration-500 before:absolute before:left-[-10px] before:top-2 before:w-5 before:h-5 before:bg-[#FEFAE0] before:rounded-full after:absolute after:right-[-10px] after:top-2 after:w-5 after:h-5 after:bg-[#FEFAE0] after:rounded-full">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Auto Scrolling */}
      <section className="py-20 bg-[#FEFAE0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real experiences from real adventurers
            </p>
          </div>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="flex animate-scroll hover:pause-animation">
              {/* Testimonials Set 1 */}
              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">S</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Sarah Johnson</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;The Taj Mahal tour was absolutely breathtaking! Travel Carvers made everything seamless.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#A9B388] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#A9B388] text-xl font-bold shadow-lg">R</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">Rajesh Kumar</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Best travel experience ever! The Kerala backwaters trip was magical. Professional guides!&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">E</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Emily Chen</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;Tokyo and Bali in one trip - dream come true! Such attention to detail and care!&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#5F6F52] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#5F6F52] text-xl font-bold shadow-lg">M</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">Michael Brown</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Dubai luxury package exceeded expectations! Everything was first class from start to finish.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">P</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Priya Sharma</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;Honeymoon in Maldives was perfect! Romantic setup and amazing service throughout.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#A9B388] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#A9B388] text-xl font-bold shadow-lg">A</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">Alex Martinez</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Switzerland Alps tour was stunning! Beautiful scenery and excellent accommodation.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">L</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Lisa Wang</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;Goa beach escape was so much fun! Great party scene and relaxing beaches.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#5F6F52] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#5F6F52] text-xl font-bold shadow-lg">D</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">David Lee</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Group tour to Europe was fantastic! Made so many friends and memories.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">N</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Nina Patel</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;Bali was paradise! Beautiful temples, beaches, and incredible food experiences.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#A9B388] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#A9B388] text-xl font-bold shadow-lg">J</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">James Wilson</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Stranger trip to Thailand was amazing! Met wonderful people and had incredible adventures.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              {/* Duplicate Set for Seamless Loop */}
              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">S</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Sarah Johnson</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;The Taj Mahal tour was absolutely breathtaking! Travel Carvers made everything seamless.&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-[#A9B388] to-[#A9B388] rounded-2xl shadow-xl p-6 h-full hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#A9B388] text-xl font-bold shadow-lg">R</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-white text-lg">Rajesh Kumar</h4>
                      <div className="text-yellow-300 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed">&quot;Best travel experience ever! The Kerala backwaters trip was magical. Professional guides!&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <span className="text-xs text-white/80 font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-96 mx-4">
                <div className="relative bg-gradient-to-br from-white to-[#FEFAE0] rounded-2xl shadow-xl p-6 h-full border-2 border-[#A9B388]/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">E</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-[#5F6F52] text-lg">Emily Chen</h4>
                      <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">&quot;Tokyo and Bali in one trip - dream come true! Such attention to detail and care!&quot;</p>
                  <div className="mt-4 pt-4 border-t border-[#A9B388]/20">
                    <span className="text-xs text-[#A9B388] font-semibold">VERIFIED TRAVELER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FEFAE0] to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FEFAE0] to-transparent pointer-events-none"></div>
        </div>
      </section>

      <style jsx global>{`
        /* Testimonials scroll animation */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }

        .hover\:pause-animation:hover {
          animation-play-state: paused;
        }

        /* Page load animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        /* Scroll-triggered animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scroll-animate {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          scale: 1 !important;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Hover lift effect */
        .hover\:-translate-y-2:hover {
          transform: translateY(-0.5rem);
        }

        /* Pulse animation for CTA buttons */
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(140, 163, 132, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(140, 163, 132, 0);
          }
        }

        button:hover {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#1A3C34] to-[#5F6F52] text-white py-12 border-t-4 border-[#A9B388]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 scroll-animate opacity-0 translate-y-10">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <img
                  src="/logo.png"
                  alt="Travel Cravers"
                  className="h-16 w-auto object-contain drop-shadow-lg brightness-110"
                />
              </div>
              <p className="text-white/80 text-sm">
                Creating unforgettable travel experiences since 2020
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Packages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>📧 info@travelcarvers.com</li>
                <li>📞 +91 98765 43210</li>
                <li>📍 Bangalore, India</li>
                <li className="pt-2 space-x-3">
                  <a href="#" className="hover:text-white transition-colors text-xl">📘</a>
                  <a href="#" className="hover:text-white transition-colors text-xl">📸</a>
                  <a href="#" className="hover:text-white transition-colors text-xl">🐦</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
            <p>&copy; 2026 Travel Carvers. All rights reserved. Crafted with 💚 in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
