'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { groupSizeLabel } from '@/lib/packageList';

export interface HomePackage {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  show_price?: boolean | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  destination_name?: string | null;
  status?: string | null;
  is_group_package?: boolean | null;
  group_size_min?: number | null;
  group_size_max?: number | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
}

function coverImage(pkg: HomePackage): string {
  const gallery = pkg.package_gallery ?? [];
  const cover = gallery.find((image) => image.is_cover) ?? gallery[0];
  return cover?.image_url ?? `https://picsum.photos/seed/${pkg.slug}/800/600`;
}


function formatPrice(pkg: HomePackage): string {
  // Admins can hide a package's price from customers.
  if (pkg.show_price === false) return 'On request';
  const value = pkg.price_adult;
  if (value === null || value === undefined || value === '') return 'On request';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function formatDuration(pkg: HomePackage): string {
  if (!pkg.duration_days) return 'Flexible itinerary';
  const nights = pkg.duration_nights ? ` / ${pkg.duration_nights} Nights` : '';
  return `${pkg.duration_days} Days${nights}`;
}

interface HomePackageCardProps {
  pkg: HomePackage;
  badge?: string;
}

export function HomePackageCard({ pkg, badge }: HomePackageCardProps) {
  const groupSize = groupSizeLabel(pkg);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group relative block h-72 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      <Image
        src={coverImage(pkg)}
        alt={pkg.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#A9B388]/70 via-[#A9B388]/30 to-transparent transition-all group-hover:from-[#A9B388]/80" />

      {pkg.status === 'sold_out' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
          <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700">
            Sold Out
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-2">
          {badge ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#5F6F52] backdrop-blur-sm">
              {badge}
            </span>
          ) : (
            <span />
          )}

          {/* Group departures advertise their size up front, not just on the detail page. */}
          {groupSize && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1A3C34]/90 px-3 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              {groupSize}
            </span>
          )}
        </div>

        <div>
          <h3 className="mb-2 line-clamp-2 text-2xl font-bold text-white">{pkg.title}</h3>
          <p className="mb-3 text-sm text-white/90">{formatDuration(pkg)}</p>
          <div className="flex items-center justify-between gap-2">
            {pkg.destination_name ? (
              <span className="truncate rounded-full bg-[#1A3C34]/50 px-2 py-1 text-xs text-white/90 backdrop-blur-sm">
                {pkg.destination_name}
              </span>
            ) : (
              <span />
            )}
            <span className="shrink-0 text-lg font-bold text-white">{formatPrice(pkg)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomePackageCardSkeleton() {
  return <div className="h-72 animate-pulse rounded-2xl bg-black/5" />;
}
