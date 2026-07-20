import type { Metadata } from 'next';
import DestinationManager from '@/components/admin/DestinationManager';

export const metadata: Metadata = {
  title: 'Destinations | Admin',
};

export default function DestinationsPage() {
  return (
    <div className="py-4">
      <DestinationManager />
    </div>
  );
}
