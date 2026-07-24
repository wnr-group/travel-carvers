import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata, packageCoverImage, packageJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getPackageBySlug } from '@/lib/api/public/packages';
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
    // Undefined when the package has no imagery, so the generated default card is used.
    images: (() => {
      const cover = packageCoverImage(pkg);
      return cover ? [cover] : undefined;
    })(),
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await fetchPackage(slug);

  if (!pkg) notFound();

  const reviews = await getApprovedReviews(pkg.id).catch(() => []);
  const detail = toPackageDetail(pkg, reviews);

  return (
    <>
      <JsonLd data={packageJsonLd(pkg)} />
      <PackageDetailView detail={detail} />
    </>
  );
}
