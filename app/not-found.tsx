import Link from 'next/link';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';

/**
 * Friendly 404 for unmatched routes.
 *
 * This file sits at the app root, so it renders under `app/layout.tsx` rather than the
 * `(customer)` layout — the site chrome has to be included by hand or the page arrives
 * with no navigation at all.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center"
      >
        <p className="font-mono text-6xl font-bold text-brand-dark">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-brand-darkest">Page not found</h1>
        <p className="mt-2 max-w-md text-sm text-brand-medium">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Go home
          </Link>
          <Link
            href="/packages"
            className="rounded-full border border-brand-light px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-lightest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            Browse packages
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
