import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import PackagesView from './PackagesView';

export const metadata: Metadata = createMetadata({
  title: 'Tour Packages | Travel Carvers',
  description:
    'Browse all Travel Carvers tour packages — domestic and international holidays, honeymoon trips and group tours. Filter by price, duration and category.',
  path: '/packages',
  keywords: [
    'tour packages',
    'holiday packages',
    'travel packages',
    'international tours',
    'india tours',
    'honeymoon packages',
    'Travel Carvers',
  ],
});

export default function Page() {
  return <PackagesView />;
}
