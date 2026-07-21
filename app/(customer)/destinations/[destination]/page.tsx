import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata, absoluteUrl, SITE } from '@/lib/seo';
import {
  getDestinationSummary,
  getPublishedPackagesByDestination,
} from '@/lib/api/public/destinations';
import { mapPackage, type RawListPackage } from '@/lib/packageList';
import CategoryCollectionView from '@/components/customer/CategoryCollectionView';
import type { DestinationSummary } from '@/lib/types/destination';

export const revalidate = 3600;

const fetchDestination = cache(async (slug: string): Promise<DestinationSummary | null> => {
  try {
    return await getDestinationSummary(slug);
  } catch {
    return null;
  }
});

function locationLabel(destination: DestinationSummary): string {
  return destination.city ? `${destination.city}, ${destination.country}` : destination.country;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string }>;
}): Promise<Metadata> {
  const { destination: slug } = await params;
  const destination = await fetchDestination(slug);

  if (!destination) {
    return createMetadata({
      title: 'Destination Not Found | Travel Carvers',
      description:
        'This destination could not be found. Explore our other tour packages instead.',
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }

  const description =
    destination.meta_description ??
    destination.description ??
    `Explore our ${destination.name} tour packages. ${SITE.defaultDescription}`;

  return createMetadata({
    title: destination.meta_title ?? `${destination.name} Tour Packages | Travel Carvers`,
    description,
    path: `/destinations/${destination.slug}`,
    keywords: [
      destination.name,
      destination.country,
      ...(destination.city ? [destination.city] : []),
      'tour packages',
      'holiday packages',
      'Travel Carvers',
    ],

    images: [
      destination.og_image ?? destination.hero_image_url ?? absoluteUrl(SITE.defaultOgImage),
    ],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination: slug } = await params;
  const destination = await fetchDestination(slug);

  if (!destination) notFound();
  
  const rows = await getPublishedPackagesByDestination(destination.id).catch(() => []);

  const packages = ((rows ?? []) as RawListPackage[]).map(mapPackage);

  return (
    <CategoryCollectionView
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Destinations', href: '/destinations' },
        { label: destination.name },
      ]}
      title={destination.name}
      description={destination.description ?? locationLabel(destination)}
      heroImageUrl={destination.hero_image_url}
      packages={packages}
      emptyDescription={`We are still curating trips to ${destination.name}. Please check back soon or browse all our packages.`}
    />
  );
}
