import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata, absoluteUrl, SITE } from '@/lib/seo';
import {
  getCategorySummary,
  getPublishedPackagesByCategory,
  getSubcategoriesForCategory,
  getSubcategoryPackageCounts,
  type CategorySummary,
} from '@/lib/api/public/categories';
import { mapPackage, type RawListPackage } from '@/lib/packageList';
import CategoryCollectionView from '@/components/customer/CategoryCollectionView';

export const revalidate = 3600;

const fetchCategory = cache(async (slug: string): Promise<CategorySummary | null> => {
  try {
    return await getCategorySummary(slug);
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
  const category = await fetchCategory(slug);

  if (!category) {
    return createMetadata({
      title: 'Category Not Found | Travel Carvers',
      description: 'This travel category could not be found. Explore our other tour packages instead.',
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${category.name} Tour Packages | Travel Carvers`,
    description:
      category.description ??
      `Explore our ${category.name} tour packages. ${SITE.defaultDescription}`,
    path: `/categories/${slug}`,
    keywords: [category.name, 'tour packages', 'holiday packages', 'Travel Carvers'],
    images: [category.cover_image_url ?? absoluteUrl(SITE.defaultOgImage)],
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) notFound();

  // All best-effort — a failure just yields an empty section, not a hard error.
  const [rows, subcategories] = await Promise.all([
    getPublishedPackagesByCategory(category.id).catch(() => []),
    getSubcategoriesForCategory(category.id).catch(() => []),
  ]);

  const packageCounts = await getSubcategoryPackageCounts(
    subcategories.map((subcategory) => subcategory.id)
  ).catch(() => ({}) as Record<string, number>);

  const packages = ((rows ?? []) as RawListPackage[]).map((row) => ({
    ...mapPackage(row),
    categories: [category.name],
  }));

  return (
    <CategoryCollectionView
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/' },
        { label: category.name },
      ]}
      title={category.name}
      description={category.description}
      heroImageUrl={category.cover_image_url}
      packages={packages}
      collections={subcategories.map((subcategory) => ({
        label: subcategory.name,
        href: `/categories/${category.slug}/${subcategory.slug}`,
        description: subcategory.description,
        imageUrl: subcategory.cover_image_url,
        iconName: subcategory.icon_name,
        packageCount: packageCounts[subcategory.id] ?? 0,
      }))}
      emptyDescription={`We are still curating ${category.name} trips. Please check back soon or browse all our packages.`}
    />
  );
}
