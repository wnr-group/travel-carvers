import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata, absoluteUrl, SITE } from '@/lib/seo';
import {
  getCategorySummary,
  getSubcategorySummary,
  getPublishedPackagesBySubcategory,
  type CategorySummary,
  type SubcategorySummary,
} from '@/lib/api/public/categories';
import { mapPackage, type RawListPackage } from '@/lib/packageList';
import CategoryCollectionView from '@/components/customer/CategoryCollectionView';

export const revalidate = 3600;

type Params = Promise<{ slug: string; subslug: string }>;

const fetchPair = cache(
  async (
    slug: string,
    subslug: string
  ): Promise<{ category: CategorySummary; subcategory: SubcategorySummary } | null> => {
    try {
      const category = await getCategorySummary(slug);
      if (!category) return null;

      const subcategory = await getSubcategorySummary(category.id, subslug);
      if (!subcategory) return null;

      return { category, subcategory };
    } catch {
      return null;
    }
  }
);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, subslug } = await params;
  const pair = await fetchPair(slug, subslug);

  if (!pair) {
    return createMetadata({
      title: 'Category Not Found | Travel Carvers',
      description: 'This travel category could not be found. Explore our other tour packages instead.',
      path: `/categories/${slug}/${subslug}`,
      noIndex: true,
    });
  }

  const { category, subcategory } = pair;

  return createMetadata({
    title: `${subcategory.name} ${category.name} Packages | Travel Carvers`,
    description:
      subcategory.description ??
      `Explore our ${subcategory.name} ${category.name} tour packages. ${SITE.defaultDescription}`,
    path: `/categories/${slug}/${subslug}`,
    keywords: [subcategory.name, category.name, 'tour packages', 'holiday packages', 'Travel Carvers'],
    images: [category.cover_image_url ?? absoluteUrl(SITE.defaultOgImage)],
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug, subslug } = await params;
  const pair = await fetchPair(slug, subslug);

  if (!pair) notFound();

  const { category, subcategory } = pair;

  const rows = await getPublishedPackagesBySubcategory(subcategory.id, category.id).catch(() => []);
  const packages = ((rows ?? []) as RawListPackage[]).map((row) => ({
    ...mapPackage(row),
    categories: [subcategory.name],
  }));

  return (
    <CategoryCollectionView
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/' },
        { label: category.name, href: `/categories/${category.slug}` },
        { label: subcategory.name },
      ]}
      title={subcategory.name}
      description={subcategory.description}
      heroImageUrl={subcategory.cover_image_url ?? category.cover_image_url}
      packages={packages}
      emptyDescription={`We are still curating ${subcategory.name} trips. Please check back soon or browse all our packages.`}
    />
  );
}
