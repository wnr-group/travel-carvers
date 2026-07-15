import type { Metadata } from 'next';
import { createMetadata, organizationJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import HomeView from './HomeView';

export const metadata: Metadata = createMetadata({
  title: 'Travel Carvers | Best Domestic & International Tour Packages',
  description:
    'Explore premium domestic and international tour packages with Travel Carvers. Discover Bali, Thailand, Vietnam, Europe, Kashmir and more.',
  path: '/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HomeView />
    </>
  );
}
