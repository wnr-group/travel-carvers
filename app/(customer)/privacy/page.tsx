import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy | Travel Carvers',
  description: 'Understand how Travel Carvers collects, uses, and protects your personal data when booking tour packages or using our website.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return <PrivacyClient />;
}
