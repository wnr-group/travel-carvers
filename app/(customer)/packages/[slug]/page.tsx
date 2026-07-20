import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata, packageCoverImage, packageJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getPackageBySlug, getPublishedPackages, getPublicSettings } from '@/lib/api/public/packages';
import { getApprovedReviews } from '@/lib/api/public/reviews';
import { toPackageDetail, type RawPackageDetail } from '@/lib/packageDetail';
import PackageDetailView from './PackageDetailView';

export const revalidate = 3600;

const fetchPackage = cache(async (slug: string): Promise<RawPackageDetail | null> => {
  try {
    return (await getPackageBySlug(slug)) as RawPackageDetail;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await fetchPackage(slug);

  if (!pkg) {
    return createMetadata({
      title: 'Package Not Found | Travel Carvers',
      description:
        'This travel package could not be found. Explore our other tour packages instead.',
      path: `/packages/${slug}`,
      noIndex: true,
    });
  }

  const durationLabel = pkg.duration_days ? `${pkg.duration_days} Days` : '';
  const title = `${[pkg.title, durationLabel].filter(Boolean).join(' ')} | Travel Carvers`;

  const keywords = [pkg.title, pkg.destination_name, 'travel', 'tour package', 'Travel Carvers'].filter(
    (keyword): keyword is string => Boolean(keyword),
  );

  return createMetadata({
    title,
    description: pkg.short_description ?? undefined,
    path: `/packages/${slug}`,
    keywords,
    images: [packageCoverImage(pkg)],
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await fetchPackage(slug);

  if (!pkg) notFound();

  // Reviews + sibling packages + settings are best-effort — a failure just yields empty sections/default settings.
  const [reviews, published, settings] = await Promise.all([
    getApprovedReviews(pkg.id).catch(() => []),
    getPublishedPackages().catch(() => []),
    getPublicSettings().catch(() => ({ show_prices_globally: true })),
  ]);

  const similar = (published ?? []).filter((candidate) => candidate?.slug && candidate.slug !== slug);
  const detail = toPackageDetail(pkg, reviews, similar, settings?.show_prices_globally !== false);

  return (
    <>
      <JsonLd data={packageJsonLd(pkg)} />
      <PackageDetailView detail={detail} />
    </>
  );
}
