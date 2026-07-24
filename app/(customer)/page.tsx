import type { Metadata } from 'next';
import { createMetadata, organizationJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getHomepageSections } from '@/lib/api/public/homepageSections';
import HomeView from './HomeView';

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: 'Travel Carvers | Best Domestic & International Tour Packages',
  description:
    'Explore premium domestic and international tour packages with Travel Carvers. Discover Bali, Thailand, Vietnam, Europe, Kashmir and more.',
  path: '/',
});

export default async function Page() {
  const sections = await getHomepageSections().catch(() => null);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HomeView sections={sections} />
    </>
  );
}
