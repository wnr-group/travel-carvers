'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
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

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
const HERO_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function CategoryCollectionView({
  breadcrumbs,
  title,
  description,
  heroImageUrl,
  packages,
  collections,
  emptyDescription,
}: CategoryCollectionViewProps) {
  const shouldReduce = useReducedMotion();
  const countLabel = `${packages.length} ${packages.length === 1 ? 'package' : 'packages'}`;

  const initial = shouldReduce ? false : 'hidden';

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
            <div className="absolute inset-0 bg-gradient-to-br from-brand-forest to-brand-sage" />
          )}
          <div className="overlay-brand-primary absolute inset-0" />
          <motion.div
            variants={HERO_VARIANTS}
            initial={initial}
            animate="visible"
            className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10"
          >
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-white/85">{countLabel}</p>
          </motion.div>
        </div>

        {description && (
          <motion.p
            variants={HERO_VARIANTS}
            initial={initial}
            animate="visible"
            className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-brand-medium sm:text-base"
          >
            {description}
          </motion.p>
        )}

        {collections && collections.length > 0 && (
          <nav aria-label={`${title} subcategories`} className="mt-12">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
              Collections
            </p>
            <h2 className="mt-1 text-center text-xl font-semibold text-brand-darkest sm:text-2xl">
              Find your kind of {title} trip
            </h2>

            <motion.ul
              variants={CONTAINER_VARIANTS}
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              // Three up against the package grid's four, so a collection card stays
              // visibly wider than a package card at every desktop size without going so
              // wide that a long list of subcategories looks sparse.
              className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {collections.map((collection) => (
                <motion.li key={collection.href} variants={ITEM_VARIANTS} className="h-full">
                  <Link
                    href={collection.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)] transition duration-300 hover:-translate-y-1 hover:border-brand-medium hover:shadow-lg"
                  >
                    {/* Cover — image when set, brand gradient + icon/monogram otherwise */}
                    <span className="relative block h-64 w-full overflow-hidden sm:h-72">
                      {collection.imageUrl ? (
                        <>
                          <Image
                            src={collection.imageUrl}
                            alt=""
                            fill
                            // The grid caps at max-w-7xl, so a 3-up card tops out near 410px.
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 410px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <span className="overlay-brand-primary absolute inset-0" aria-hidden="true" />
                        </>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-forest to-brand-sage"
                        >
                          {collection.iconName && isIconName(collection.iconName) ? (
                            <DynamicIcon
                              name={collection.iconName}
                              className="h-14 w-14 text-white/80 transition duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-6xl font-bold text-white/80 transition duration-300 group-hover:scale-110">
                              {collection.label.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                      )}

                      <span className="absolute bottom-5 left-5 right-4 text-xl font-semibold text-white drop-shadow sm:text-2xl">
                        {collection.label}
                      </span>

                      {collection.packageCount != null && (
                        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-darkest backdrop-blur-sm">
                          {collection.packageCount === 0
                            ? 'Coming soon'
                            : `${collection.packageCount} ${collection.packageCount === 1 ? 'package' : 'packages'}`}
                        </span>
                      )}
                    </span>

                    <span className="flex flex-1 items-center justify-between gap-4 p-6 text-left">
                      <span className="text-base leading-relaxed text-brand-medium line-clamp-2">
                        {collection.description ?? `Explore ${collection.label} trips`}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-brand-medium transition duration-300 group-hover:translate-x-1 group-hover:text-brand-dark"
                      />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        )}
      </header>

      {/* Package grid */}
      <main className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
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
          <>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-brand-light/60 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
                  The Trips
                </p>
                <h2 className="mt-1 text-xl font-semibold text-brand-darkest sm:text-2xl">
                  All {title} packages
                </h2>
              </div>
              <p className="shrink-0 pb-1 text-sm font-medium text-brand-medium">{countLabel}</p>
            </div>

            <motion.div
              variants={CONTAINER_VARIANTS}
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              // Four up — one more than the collections grid above, which is what keeps a
              // collection card the larger of the two.
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={ITEM_VARIANTS}
                  className="flex flex-col [&>article]:flex-1"
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}