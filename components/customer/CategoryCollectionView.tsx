import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PackageCard } from '@/components/customer/PackageCard';
import Breadcrumb, { type BreadcrumbItem } from '@/components/customer/Breadcrumb';
import DynamicIcon from '@/components/ui/DynamicIcon';
import EmptyState from '@/components/ui/EmptyState';
import { isIconName } from '@/lib/icons';
import type { TravelPackage } from '@/lib/packageList';

export interface CollectionLink {
  label: string;
  href: string;
  description?: string | null;
  imageUrl?: string | null;
  iconName?: string | null;
  packageCount?: number;
}

interface CategoryCollectionViewProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string | null;
  heroImageUrl?: string | null;
  packages: TravelPackage[];
  collections?: CollectionLink[];
  emptyDescription?: string;
}


export default function CategoryCollectionView({
  breadcrumbs,
  title,
  description,
  heroImageUrl,
  packages,
  collections,
  emptyDescription,
}: CategoryCollectionViewProps) {
  const countLabel = `${packages.length} ${packages.length === 1 ? 'package' : 'packages'}`;

  return (
    <div className="min-h-screen bg-brand-tint-light pb-16">
      <Breadcrumb items={breadcrumbs} />

      {/* Hero */}
      <header className="mx-auto mt-4 max-w-7xl px-5 sm:px-8">
        <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden rounded-2xl sm:h-[46vh]">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A3C34] to-[#A9B388]" />
          )}
          <div className="overlay-brand-primary absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10">
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-white/85">{countLabel}</p>
          </div>
        </div>

        {description && (
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-brand-medium sm:text-base">
            {description}
          </p>
        )}

        {collections && collections.length > 0 && (
          <nav aria-label={`${title} subcategories`} className="mt-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
              Collections
            </p>
            <h2 className="mt-1 text-center text-xl font-semibold text-brand-darkest sm:text-2xl">
              Find your kind of {title} trip
            </h2>

            <ul className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <li key={collection.href}>
                  <Link
                    href={collection.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)] transition hover:-translate-y-1 hover:border-brand-medium hover:shadow-lg"
                  >
                    {/* Cover — image when set, brand gradient + icon/monogram otherwise */}
                    <span className="relative block h-36 w-full overflow-hidden">
                      {collection.imageUrl ? (
                        <>
                          <Image
                            src={collection.imageUrl}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <span className="overlay-brand-primary absolute inset-0" aria-hidden="true" />
                        </>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A3C34] to-[#A9B388]"
                        >
                          {collection.iconName && isIconName(collection.iconName) ? (
                            <DynamicIcon
                              name={collection.iconName}
                              className="h-10 w-10 text-white/80 transition group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-4xl font-bold text-white/80 transition group-hover:scale-110">
                              {collection.label.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                      )}

                      <span className="absolute bottom-3 left-4 right-3 text-base font-semibold text-white drop-shadow">
                        {collection.label}
                      </span>

                      {collection.packageCount != null && (
                        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-darkest backdrop-blur-sm">
                          {collection.packageCount === 0
                            ? 'Coming soon'
                            : `${collection.packageCount} ${collection.packageCount === 1 ? 'package' : 'packages'}`}
                        </span>
                      )}
                    </span>

                    <span className="flex flex-1 items-center justify-between gap-3 p-4 text-left">
                      <span className="text-xs leading-relaxed text-brand-medium line-clamp-2">
                        {collection.description ?? `Explore ${collection.label} trips`}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-brand-medium transition group-hover:translate-x-1 group-hover:text-brand-dark"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Package grid */}
      <main className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        {packages.length === 0 ? (
          <EmptyState
            variant="packages"
            title="No packages here yet"
            description={
              emptyDescription ??
              'We are still curating trips for this collection. Please check back soon or browse all our packages.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
