import { revalidatePath } from 'next/cache';

/**
 * On-demand ISR revalidation for the public site.
 *
 * The public pages are statically cached (`export const revalidate = 3600`), so
 * without an explicit revalidate an admin change wouldn't appear for up to an
 * hour. These helpers map an admin mutation to the public pages that
 * *server-render* the affected data.
 *
 * Only server-rendered data needs this. Content pulled client-side with React
 * Query — the homepage's featured/trending packages and categories, the
 * testimonials carousel, trust badges, and the footer/contact site settings —
 * is always fresh and is deliberately NOT listed here.
 *
 * For dynamic routes we pass the route *pattern* + `'page'`, which marks every
 * instance of that route for regeneration (a package/category edit can surface
 * on any number of them, and admin edits are infrequent).
 */

/**
 * Best-effort revalidation: a cache refresh must never fail the admin write it
 * follows. If revalidatePath throws, the DB change has already committed — log
 * and move on rather than surfacing a false error to the admin.
 */
function safeRevalidate(run: () => void): void {
  try {
    run();
  } catch (err) {
    console.error('[revalidate] failed:', err);
  }
}

/** Homepage — server-renders the `homepage_sections` hero/featured/trending copy. */
export function revalidateHomepage(): void {
  safeRevalidate(() => revalidatePath('/'));
}

/** `/visa` — server-renders the visa document list. */
export function revalidateVisaPages(): void {
  safeRevalidate(() => revalidatePath('/visa'));
}

/** Package detail — server-renders the package and its approved reviews. */
export function revalidatePackagePages(): void {
  safeRevalidate(() => revalidatePath('/packages/[slug]', 'page'));
}

/**
 * Every public page that server-renders catalog data (packages, categories,
 * subcategories, destinations). These are interlinked — a package shows its
 * destination/categories, a destination/category page lists its packages and
 * counts — so a change to any of them refreshes the whole set.
 */
export function revalidateCatalogPages(): void {
  safeRevalidate(() => {
    revalidatePath('/packages/[slug]', 'page');
    revalidatePath('/destinations');
    revalidatePath('/destinations/[destination]', 'page');
    revalidatePath('/categories/[slug]', 'page');
    revalidatePath('/categories/[slug]/[subslug]', 'page');
  });
}
