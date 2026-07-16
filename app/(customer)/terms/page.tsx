import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import TermsClient from './TermsClient';

export const metadata: Metadata = createMetadata({
  title: 'Terms & Conditions | Travel Carvers',
  description: 'Read the terms of use, booking policies, and legal guidelines for the Travel Carvers website before scheduling your next journey.',
  path: '/terms',
});

export default function TermsPage() {
  return <TermsClient />;
}