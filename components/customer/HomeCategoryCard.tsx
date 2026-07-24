'use client';

import Image from 'next/image';
import Link from 'next/link';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { ArrowRight } from 'lucide-react';

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
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-2xl border border-white/80 bg-brand-forest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {category.cover_image_url ? (
        <>
          <Image
            src={category.cover_image_url}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-brand-forest via-brand-forest/55 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-brand-primary">
          <DynamicIcon name={category.icon_name} className="h-10 w-10 text-white/90" />
        </div>
      )}

      <div className="relative z-20 flex flex-col justify-end p-3 sm:p-4">
        <h3 className="mb-1 text-sm font-bold leading-tight text-white drop-shadow-md sm:text-base">
          {category.name}
        </h3>
        {category.description && (
          <p className="mb-2 line-clamp-2 text-[11px] font-medium leading-snug text-white/85 drop-shadow">
            {category.description}
          </p>
        )}

        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pastel-mint transition-all group-hover:text-white">
          <span>Explore</span>
          <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function HomeCategoryCardSkeleton() {
  return <div className="aspect-[9/16] animate-pulse rounded-2xl bg-black/10" />;
}
