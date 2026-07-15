'use client';

import Image from 'next/image';
import Link from 'next/link';
import DynamicIcon from '@/components/ui/DynamicIcon';

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  icon_name?: string | null;
}

interface HomeCategoryCardProps {
  category: HomeCategory;
}

export function HomeCategoryCard({ category }: HomeCategoryCardProps) {
  return (
    <Link
      href={`/packages?category=${encodeURIComponent(category.slug)}`}
      className="group relative block h-96 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      {category.cover_image_url ? (
        <>
          <Image
            src={category.cover_image_url}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C34] via-[#A9B388]/50 to-transparent transition-all group-hover:from-[#A9B388]/90" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A3C34] to-[#A9B388]">
          <DynamicIcon name={category.icon_name} className="h-16 w-16 text-white/80" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-bold text-white">{category.name}</h3>
          {category.description && (
            <p className="line-clamp-2 text-sm text-white/90">{category.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function HomeCategoryCardSkeleton() {
  return <div className="h-96 animate-pulse rounded-2xl bg-black/5" />;
}
