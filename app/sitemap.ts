import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { getPublishedPackages } from '@/lib/api/public/packages';
import {
  getActiveCategories,
  getActiveCategorySubcategoryPairs,
} from '@/lib/api/public/categories';

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/packages', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
];

const DESTINATION_SLUGS = [
  'bali',
  'thailand',
  'vietnam',
  'singapore',
  'malaysia',
  'dubai',
  'europe',
  'kashmir',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const destinationEntries: MetadataRoute.Sitemap = DESTINATION_SLUGS.map((slug) => ({
    url: absoluteUrl(`/packages?destination=${slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  let packageEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];
  let subcategoryEntries: MetadataRoute.Sitemap = [];

  // Independent fetches — run them in parallel; each failure only drops its own section.
  const [packagesResult, categoriesResult, pairsResult] = await Promise.allSettled([
    getPublishedPackages(),
    getActiveCategories(),
    getActiveCategorySubcategoryPairs(),
  ]);

  if (packagesResult.status === 'fulfilled') {
    packageEntries = (packagesResult.value ?? [])
      .filter((pkg): pkg is { slug: string; updated_at?: string } => Boolean(pkg?.slug))
      .map((pkg) => ({
        url: absoluteUrl(`/packages/${pkg.slug}`),
        lastModified: pkg.updated_at ? new Date(pkg.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } else {
    console.error('[sitemap] failed to load packages', packagesResult.reason);
  }

  if (categoriesResult.status === 'fulfilled') {
    categoryEntries = (categoriesResult.value ?? [])
      .filter((category): category is { slug: string; updated_at?: string } => Boolean(category?.slug))
      .map((category) => ({
        url: absoluteUrl(`/categories/${category.slug}`),
        lastModified: category.updated_at ? new Date(category.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
  } else {
    console.error('[sitemap] failed to load categories', categoriesResult.reason);
  }

  if (pairsResult.status === 'fulfilled') {
    subcategoryEntries = (pairsResult.value ?? []).map((pair) => ({
      url: absoluteUrl(`/categories/${pair.categorySlug}/${pair.subcategorySlug}`),
      lastModified: pair.updatedAt ? new Date(pair.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } else {
    console.error('[sitemap] failed to load subcategories', pairsResult.reason);
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...subcategoryEntries,
    ...destinationEntries,
    ...packageEntries,
  ];
}

export const revalidate = 3600;
