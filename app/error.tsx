'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';

/**
 * Global error boundary for the app segment. Catches unexpected runtime errors thrown while
 * rendering a route and offers recovery (retry via `reset`, or navigate home).
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app error]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16">
      <ErrorMessage
        variant="error"
        title="Something went wrong"
        message="An unexpected error occurred. You can try again, or head back to the homepage."
        retry={reset}
        className="w-full max-w-md"
      />
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-light px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-lightest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Go home
      </Link>
    </div>
  );
}
