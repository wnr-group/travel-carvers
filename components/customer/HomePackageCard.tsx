'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Star } from 'lucide-react';
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
  reviews?: { rating: number | null; is_approved: boolean | null }[] | null;
}

function coverImage(pkg: HomePackage): string {
  const gallery = pkg.package_gallery ?? [];
  const cover = gallery.find((image) => image.is_cover) ?? gallery[0];
  return cover?.image_url ?? `https://picsum.photos/seed/${pkg.slug}/800/600`;
}

function formatPrice(pkg: HomePackage): string {
  if (pkg.show_price === false) return 'On request';
  const value = pkg.price_adult;
  if (value === null || value === undefined || value === '') return 'On request';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function averageRating(pkg: HomePackage): { value: number; count: number } | null {
  const approved = (pkg.reviews ?? [])
    .filter((review) => review.is_approved === true && review.rating != null)
    .map((review) => review.rating as number);

  if (approved.length === 0) return null;

  const total = approved.reduce((sum, rating) => sum + rating, 0);
  return {
    value: Math.round((total / approved.length) * 10) / 10,
    count: approved.length,
  };
}

function formatDuration(pkg: HomePackage): string {
  if (!pkg.duration_days) return 'Flexible itinerary';
  const nights = pkg.duration_nights ? `${pkg.duration_nights}N` : '';
  const days = `${pkg.duration_days}D`;
  return nights ? `${nights} / ${days}` : days;
}

interface HomePackageCardProps {
  pkg: HomePackage;
  badge?: string;
}

export function HomePackageCard({ pkg, badge }: HomePackageCardProps) {
  const groupSize = groupSizeLabel(pkg);
  const rating = averageRating(pkg);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border border-brand-light/30 flex flex-col justify-between"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={coverImage(pkg)}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {badge && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
            {badge}
          </span>
        )}

        {groupSize && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-forest shadow backdrop-blur-sm">
            <Users aria-hidden="true" className="h-3 w-3" />
            {groupSize}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 font-semibold mb-1">
            <span className="truncate">{formatDuration(pkg)}</span>
            {rating ? (
              <span
                className="flex shrink-0 items-center gap-1 text-amber-500 font-bold"
                title={`${rating.value} out of 5 from ${rating.count} review${rating.count === 1 ? '' : 's'}`}
              >
                <Star aria-hidden="true" className="w-3.5 h-3.5 fill-current" />
                {rating.value.toFixed(1)}
                <span className="font-medium text-gray-400">({rating.count})</span>
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-brand-forest/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-forest/70">
                New
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-brand-forest group-hover:text-brand-dark transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{pkg.destination_name || 'Global Destination'}</p>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting from</span>
            <span className="text-sm font-black text-brand-forest">{formatPrice(pkg)}</span>
          </div>
          <span className="px-3.5 py-1.5 bg-brand-forest text-white rounded-full text-xs font-bold group-hover:bg-brand-sage transition-colors">
            Explore
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomePackageCardSkeleton() {
  return <div className="h-72 animate-pulse rounded-2xl bg-black/10" />;
}