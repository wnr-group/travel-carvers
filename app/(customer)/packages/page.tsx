import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
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
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSkeleton variant="grid" count={6} />
        </div>
      }
    >
      <PackagesView />
    </Suspense>
  );
}
