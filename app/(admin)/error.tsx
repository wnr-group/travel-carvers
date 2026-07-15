'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin error]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16">
      <ErrorMessage
        variant="error"
        title="Something went wrong"
        message="This admin page failed to load. Try again, or return to the dashboard."
        retry={reset}
        className="w-full max-w-md"
      />
      <Link
        href="/admin/dashboard"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-light px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-lightest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>
    </div>
  );
}
