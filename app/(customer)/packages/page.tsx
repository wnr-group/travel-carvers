'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePackages } from '@/lib/hooks/usePackages';
import { Clock, MapPin, Star, Loader2 } from 'lucide-react';

const mockPackagesList = [
  {
    title: "Bali Paradise",
    slug: "bali-paradise",
    duration: "7 Days • All Inclusive",
    location: "Bali, Indonesia",
    price: 45999,
    tag: "POPULAR",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
  },
  {
    title: "Dubai Luxury",
    slug: "dubai-luxury",
    duration: "5 Days • Premium Hotels",
    location: "Dubai, UAE",
    price: 59999,
    tag: "LUXURY",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
  },
  {
    title: "Kerala Backwaters",
    slug: "kerala-backwaters",
    duration: "6 Days • Houseboat Stay",
    location: "Kerala, India",
    price: 32999,
    tag: "TRENDING",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
  },
  {
    title: "Switzerland Alps",
    slug: "switzerland-alps",
    duration: "8 Days • Mountain Resorts",
    location: "Alps, Switzerland",
    price: 125999,
    tag: "PREMIUM",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
  },
  {
    title: "Goa Beach Escape",
    slug: "goa-beach-escape",
    duration: "4 Days • Beach Resort",
    location: "Goa, India",
    price: 18999,
    tag: "HOT DEAL",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  },
  {
    title: "Maldives Honeymoon",
    slug: "maldives-honeymoon",
    duration: "5 Days • Overwater Villas",
    location: "Maldives",
    price: 95999,
    tag: "ROMANTIC",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
  },
  {
    title: "Ladakh High Passes Circuit",
    slug: "ladakh-high-passes-circuit",
    duration: "8 Days / 7 Nights",
    location: "Leh, Ladakh, India",
    price: 68500,
    tag: "ADVENTURE",
    img: "https://picsum.photos/seed/ladakh-hero/800/600",
  }
];

export default function PackagesCatalogPage() {
  const { data: dbPackages, isLoading } = usePackages();

  const getDisplayPackages = () => {
    if (!dbPackages || dbPackages.length === 0) return mockPackagesList;
    return dbPackages.map((p: any) => ({
      title: p.title,
      slug: p.slug,
      duration: `${p.duration_days} Days / ${p.duration_nights} Nights`,
      location: p.destination_name || 'India',
      price: Number(p.price_adult) || 45000,
      tag: p.is_trending ? 'TRENDING' : p.is_featured ? 'FEATURED' : 'HOT',
      img: p.package_gallery?.find((g: any) => g.is_cover)?.image_url || p.package_gallery?.[0]?.image_url || 'https://picsum.photos/seed/placeholder/800/600',
    }));
  };

  const packages = getDisplayPackages();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
        <p className="text-slate-500 font-medium text-sm">Loading package catalog...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F1EA] min-h-screen py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-4">
            Our Tour Packages
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your perfect adventure from our curated travel catalog. Click any package to explore itinerary skyline details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/packages/${pkg.slug}`}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col h-96"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={pkg.img}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[#5F6F52] text-xs font-bold shadow-sm">
                  {pkg.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-2xl font-bold text-[#1A3C34] mb-1 leading-tight group-hover:text-[#5F6F52] transition-colors">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {pkg.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[#1A3C34] font-extrabold text-xl font-mono">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
