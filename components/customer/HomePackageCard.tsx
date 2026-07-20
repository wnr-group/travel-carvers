'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface HomePackage {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  destination_name?: string | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
  show_price?: boolean | null;
}

function coverImage(pkg: HomePackage): string {
  const gallery = pkg.package_gallery ?? [];
  const cover = gallery.find((image) => image.is_cover) ?? gallery[0];
  return cover?.image_url ?? `https://picsum.photos/seed/${pkg.slug}/800/600`;
}


function formatPrice(value: HomePackage['price_adult'], showPrice?: boolean | null): string {
  if (showPrice === false || value === null || value === undefined || value === '') return 'On request';
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

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          {badge && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#5F6F52] backdrop-blur-sm">
              {badge}
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
            <span className="shrink-0 text-lg font-bold text-white">{formatPrice(pkg.price_adult, pkg.show_price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomePackageCardSkeleton() {
  return <div className="h-72 animate-pulse rounded-2xl bg-black/5" />;
}
