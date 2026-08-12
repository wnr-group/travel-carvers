import Link from 'next/link';

/**
 * 404 for `notFound()` thrown inside the customer route group — an unpublished (draft)
 * package slug, a deleted destination, a mistyped category, and so on.
 *
 * Next resolves a thrown 404 against the *nearest* not-found boundary and renders it in
 * place of the page, inside the surrounding layouts. Without this file the root
 * `app/not-found.tsx` was used, and because that one carries its own Navbar/Footer (it has
 * to — unmatched URLs render it under `app/layout.tsx` alone) the customer layout's chrome
 * and the 404's chrome both mounted: two headers, two footers, two `#main-content` ids.
 *
 * So this boundary renders the message only. The layout supplies Navbar, `<main>` and Footer.
 */
export default function CustomerNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
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
    </div>
  );
}
