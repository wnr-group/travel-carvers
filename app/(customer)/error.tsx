'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import ErrorMessage from '@/components/ui/ErrorMessage';

/**
 * Error boundary for the customer route group. Renders inside the customer layout, so the
 * Navbar and Footer stay in place while the failing page is replaced with a recoverable panel.
 */
export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[customer error]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16">
      <ErrorMessage
        variant="error"
        title="We hit a snag"
        message="We couldn’t load this page just now. Please try again in a moment."
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
