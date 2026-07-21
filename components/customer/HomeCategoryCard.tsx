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
  index?: number;
}

export function HomeCategoryCard({ category, index = 0 }: HomeCategoryCardProps) {
  const isLarge = index === 0 || index === 3;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-white/80 bg-brand-forest flex flex-col justify-end ${
        isLarge ? 'md:col-span-2 h-[150px] sm:h-[160px]' : 'h-[150px] sm:h-[160px]'
      }`}
    >
      {category.cover_image_url ? (
        <>
          <Image
            src={category.cover_image_url}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-100 contrast-105"
          />
          {/* Lighter gradient overlay to ensure images are crystal clear and fully visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/80 via-brand-forest/20 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-brand-primary">
          <DynamicIcon name={category.icon_name} className="h-8 w-8 text-white/90" />
        </div>
      )}

      <div className="relative z-20 p-3.5 sm:p-4 flex flex-col justify-end">
        <h3 className="mb-0.5 text-sm sm:text-base font-bold text-white drop-shadow-md">
          {category.name}
        </h3>
        {category.description && (
          <p className="line-clamp-1 text-[10px] text-white/90 font-medium mb-1.5 drop-shadow">
            {category.description}
          </p>
        )}

        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pastel-mint transition-all group-hover:text-white">
          <span>Explore</span>
          <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function HomeCategoryCardSkeleton() {
  return <div className="h-[150px] sm:h-[160px] animate-pulse rounded-xl bg-black/10" />;
}