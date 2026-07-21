'use client';

import { MapPin, Clock3, Star, Tent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TravelPackage, Difficulty, formatPrice } from '@/lib/hooks/usePackageFilters';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles: Record<Difficulty, string> = {
    Easy: 'bg-brand-lightest text-brand-darkest',
    Moderate: 'bg-brand-light/70 text-brand-darkest',
    Challenging: 'bg-brand-dark text-white',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[difficulty]}`}>{difficulty}</span>
  );
}

interface PackageCardProps {
  pkg: TravelPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const category = pkg.categories[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)] transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="overlay-brand-primary absolute inset-0" />
        {pkg.difficulty && (
          <div className="absolute left-3 top-3">
            <DifficultyBadge difficulty={pkg.difficulty} />
          </div>
        )}
        {pkg.location && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white">
            <MapPin className="h-3.5 w-3.5" />
            {pkg.location}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-brand-darkest">{pkg.name}</h3>
        </div>
        <p className="mb-3 line-clamp-2 text-xs text-brand-medium">{pkg.description}</p>

        <div className="mb-3 flex items-center gap-3 text-xs text-brand-medium">
          {pkg.durationDays > 0 && (
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {pkg.durationDays} days
            </span>
          )}
          {pkg.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-brand-dark" />
              {pkg.rating.toFixed(1)}
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1">
              <Tent className="h-3.5 w-3.5" />
              {category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-brand-lightest pt-3">
          <div>
            {pkg.price > 0 ? (
              <>
                <span className="text-base font-bold text-brand-darkest">{formatPrice(pkg.price)}</span>
                <span className="ml-1 text-xs text-brand-medium">/ person</span>
              </>
            ) : (
              <span className="text-base font-bold text-brand-darkest">On request</span>
            )}
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-darkest hover:shadow-md"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

