import type { Metadata } from 'next';

/**
 * Central SEO configuration + helpers.
 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelcarvers.com';

export const SITE = {
  name: 'Travel Carvers',
  url: RAW_SITE_URL.replace(/\/+$/, ''),
  defaultTitle: 'Travel Carvers | Best Domestic & International Tour Packages',
  defaultDescription:
    'Explore premium domestic and international tour packages with Travel Carvers. Discover Bali, Thailand, Vietnam, Europe, Kashmir and more.',
  defaultKeywords: [
    'travel',
    'travel packages',
    'holiday packages',
    'international tours',
    'india tours',
    'honeymoon packages',
    'Travel Carvers',
  ],
  defaultOgImage: '/images/og-default.jpg',
  twitterHandle: '@travelcarvers',
  locale: 'en_IN',
} as const;

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export const generateCanonical = absoluteUrl;

interface CreateMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  keywords?: readonly string[];
  images?: readonly string[];
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description = SITE.defaultDescription,
  path = '/',
  keywords = SITE.defaultKeywords,
  images,
  type = 'website',
  noIndex = false,
}: CreateMetadataInput = {}): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedTitle = title ?? SITE.defaultTitle;

  // When a page supplies no image we deliberately omit `images` so Next falls back to the
  // generated card in app/opengraph-image.tsx. Naming a default here instead would point
  // every share preview at a single static file — which is exactly how the previous
  // default silently became a broken HTML error page.
  const ogImages = images && images.length ? images.map((url) => ({ url })) : undefined;

  return {
    title: resolvedTitle,
    description,
    keywords: [...keywords],
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: ogImages?.map((image) => image.url),
      creator: SITE.twitterHandle,
      site: SITE.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export interface SeoPackage {
  title: string;
  slug: string;
  short_description?: string | null;
  price_adult?: number | string | null;
  show_price?: boolean | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  destination_name?: string | null;
  package_gallery?: { image_url: string; is_cover?: boolean | null }[] | null;
}

/**
 * Cover image for a package: explicit cover → first gallery image → undefined.
 *
 * Undefined rather than a hardcoded default, so `createMetadata` omits `images` and the
 * generated card in app/opengraph-image.tsx is used instead.
 */
export function packageCoverImage(pkg: SeoPackage): string | undefined {
  const gallery = pkg.package_gallery ?? [];
  const cover = gallery.find((image) => image.is_cover) ?? gallery[0];
  return cover?.image_url ?? undefined;
}

/** Organization / TravelAgency + WebSite graph for the homepage. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'TravelAgency'],
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: absoluteUrl('/logo.png'),
        description: SITE.defaultDescription,
        sameAs: [
          'https://facebook.com',
          'https://instagram.com',
          'https://linkedin.com',
          'https://youtube.com',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.defaultDescription,
        publisher: { '@id': `${SITE.url}/#organization` },
      },
    ],
  };
}

/** TouristTrip + Offer for a package detail page. */
export function packageJsonLd(pkg: SeoPackage) {
  const canonical = absoluteUrl(`/packages/${pkg.slug}`);
  // A hidden price must not leak through structured data either.
  const price =
    pkg.show_price === false || pkg.price_adult == null ? null : Number(pkg.price_adult);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.short_description ?? SITE.defaultDescription,
    image: packageCoverImage(pkg),
    url: canonical,
    provider: {
      '@type': 'TravelAgency',
      name: SITE.name,
      url: SITE.url,
    },
  };

  if (pkg.destination_name) {
    data.itinerary = {
      '@type': 'Place',
      name: pkg.destination_name,
    };
  }

  if (price != null && !Number.isNaN(price)) {
    data.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: canonical,
    };
  }

  return data;
}
