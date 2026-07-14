# Changes Summary

## Features Implemented

**1. Admin navigation shell** (`431541a`)
A fixed left sidebar (`AdminNav`) with links for Dashboard, Packages, Categories, Leads, Reviews, Homepage and Settings, highlighting the active route via `usePathname`, with the logout button docked at the bottom. A top bar (`AdminHeader`) provides a search input and a user chip. The admin layout renders both, and deliberately skips them on `/admin/login` so the login screen stays full-bleed.


**2. Category list page** (`/admin/categories`)
A table of all categories — display order, cover thumbnail, name, slug, icon name, active flag — fetched with React Query. Rows offer edit and delete; delete asks for confirmation naming the category. The hardening pass added distinct loading, error and empty states (previously only "Loading..." existed, and an API failure rendered an empty table with no explanation).

**3. Category create/edit form** (`CategoryForm`)
A modal form for name, slug, description, cover image, icon name, display order and active flag. Validated with Zod through `react-hook-form`. When creating, the slug auto-generates from the name; when editing, the slug is read-only because it is part of the public URL.

**4. Cover image upload** (`ImageUploader`)
File picker that uploads a cover image and hands the resulting public URL back to the form, which shows a live preview. In the hardening pass this was rerouted from the browser Supabase client to a new server-side upload endpoint (see API Changes) — the reason is important and is explained under **Bug Fixes**.

**5. Session refresh and admin route protection** (`proxy.ts`, working tree)
All `/admin/*` pages and `/api/admin/*` routes now pass through a proxy that validates the access token, silently refreshes it from the refresh token when it has expired, and redirects to `/admin/login` (or returns `401` for API paths) when there is no valid session.

---

## Files Added

### From the commits

| File | Description |
| --- | --- |
| `components/admin/AdminNav.tsx` | Fixed sidebar with the seven admin nav links, active-route highlighting, and the logout button. |
| `components/admin/AdminHeader.tsx` | Top bar: search input, notification bell, user avatar/name. Visual only — the search box and bell are not wired to anything. |
| `components/admin/CategoryForm.tsx` | Modal create/edit form for a category. |
| `components/admin/ImageUploader.tsx` | Cover-image file input with uploading state. |
| `app/(admin)/admin/categories/page.tsx` | Category list page. |
| `lib/types/category.ts` | The `Category` interface mirroring the `categories` table. |
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge), `slugify()`, and `firstZodIssue()` for turning a `ZodError` into one API-friendly message. |

### From the working tree (untracked)

| File | Description |
| --- | --- |
| `proxy.ts` | Auth guard + Supabase token refresh for `/admin/:path*` and `/api/admin/:path*`. In **Next.js 16 the `middleware` convention is deprecated and renamed to `proxy`** — this is that file, not a custom abstraction. |
| `app/api/admin/categories/upload/route.ts` | `POST` endpoint that uploads a cover image to the `category-images` bucket with the service-role key. |
| `lib/api/guard.ts` | `requireAdmin()` — returns a `401` response, or `null` when the caller is a signed-in admin. Used by every admin route handler. |
| `lib/api/errors.ts` | `toApiError()` — logs the raw error server-side and maps Postgres codes (`23505` unique violation, `23503` FK violation, `PGRST116` no rows) to safe client messages and correct HTTP statuses. |
| `lib/queryKeys.ts` | Exports `ADMIN_CATEGORIES_KEY` so the list query and the mutations that invalidate it can't drift apart via a typo. |
| `components/ui/modal.tsx` | Reusable Radix `Dialog` modal with title/description/close. **Not yet imported anywhere** — `CategoryForm` still uses its own hand-rolled overlay. |
| `next.config.ts` | Next config with `images.remotePatterns` allowing `images.unsplash.com`.

---

## Files Modified

### `app/(admin)/layout.tsx` (commit)
Became a client component (needs `usePathname`) and now renders `AdminNav` + `AdminHeader` around the page content, skipping both on the login route.

### `app/(admin)/admin/dashboard/page.tsx`, `LogoutButton.tsx` (commit)
Dashboard restyled to fit inside the new sidebar shell; the logout button was restyled from a standalone pill into a sidebar nav row with a `LogOut` icon.

### `app/(admin)/admin/categories/page.tsx` (working tree)
Replaced the decorative drag handle with the actual `display_order` value; added a placeholder tile for categories with no cover image; added loading / error / empty states; the delete mutation now throws on a non-OK response; the confirm dialog names the category; edit and delete buttons got `aria-label`s; the form is keyed on the category id so switching between rows resets its state.

### `app/api/admin/categories/route.ts` and `[id]/route.ts` (working tree)
Every handler now calls `requireAdmin()` first, validates its body with Zod, and funnels errors through `toApiError()`. `POST` returns `201`. `DELETE` returns `404` when nothing was deleted. `catch (error: any)` replaced with `catch (error: unknown)` throughout.

### `components/admin/CategoryForm.tsx` (working tree)
`category?: any` replaced with the real `Category` type. Per-field validation errors are now displayed (before, a rejected form failed silently). Added the missing **Display Order** input. Added an `onError` toast on save. Labels are tied to inputs with `htmlFor`/`id`. Slug auto-fill stops once the admin edits the slug by hand.

### `components/admin/ImageUploader.tsx` (working tree)
Uploads now `POST` a `FormData` to `/api/admin/categories/upload` instead of calling `supabase.storage` from the browser. The file input is restricted to `image/jpeg,image/png,image/webp` and is cleared after each attempt so the same file can be retried after a failure.

### `lib/api/categories.ts` (working tree)
The `any` parameter types on `createCategory`, `updateCategory`, `createSubcategory` and `updateSubcategory` were replaced with the Zod-derived types. `deleteCategory` now returns the deleted row (or `null`) via `.select('id').maybeSingle()` so the caller can tell a real delete from a no-op.

### `lib/validations/category.schema.ts` (working tree)
See **Technical Improvements**. Added `categoryUpdateSchema` (= `categorySchema` without `slug`), an `emptyToNull` helper, and length/range bounds.

### `lib/supabase/auth.ts` (working tree)
Cookie lifetimes corrected — see **Bug Fixes**.

### `components/Globe.tsx` — **deleted** (staged)
A 347-line three.js globe component. Nothing in the repo imports it: `app/(customer)/page.tsx` imports the `Globe` *icon* from `lucide-react`, and the animated globe on the homepage is the separate `components/AnimatedGlobe.tsx`. So the deletion looks like dead-code removal, but **the reason is not recorded anywhere in git and I could not confirm it** — worth a sanity check before merging.

---

## API Changes

All three routes are gated by `requireAdmin()` and return errors as `{ error: string }`.

| Route | Method | Behaviour |
| --- | --- | --- |
| `/api/admin/categories` | `GET` | Lists all categories (including inactive). `401` if not an admin. |
| `/api/admin/categories` | `POST` | Creates a category. Body validated by `categorySchema`. **`201`** on success (was `200`), `400` on validation failure, `409` on duplicate name/slug. |
| `/api/admin/categories/[id]` | `PUT` | Updates a category. Body validated by `categoryUpdateSchema` — **`slug` is not accepted and is stripped if sent**. |
| `/api/admin/categories/[id]` | `DELETE` | Deletes a category. Returns the deleted row, or **`404`** if no category had that id. |
| `/api/admin/categories/upload` | `POST` | **New.** Multipart `file` field. Validates mime type (JPEG/PNG/WebP → `415`), non-empty (`400`), ≤ 5 MB (`413`). Stores under a `crypto.randomUUID()` filename with an extension derived from the *sniffed* mime type, never from the client filename. Returns `201` with `{ data: { url, path } }`. |

---

## Bug Fixes

**1. Admin API routes had no authentication.** `GET`/`POST`/`PUT`/`DELETE` on `/api/admin/categories` queried Supabase with the **service-role key, which bypasses RLS**, while performing no session check. Anyone who knew the URL could read, create, edit and delete categories. Fixed by `requireAdmin()` in every handler, plus the `proxy.ts` guard in front.

**2. Unvalidated uploads.** The old uploader accepted any file the OS dialog allowed, took the extension straight from the user-supplied filename, and used `Math.random()` for the storage key. Now: mime allow-list, size cap, extension derived from the mime type, `crypto.randomUUID()` key.

**3. Session died after one hour but the UI didn't know.** `signIn` set both cookies to `maxAge: 6 hours`, but a Supabase access token is only valid for `jwt_expiry` (1 h by default). Between hour 1 and hour 6 the admin appeared logged in — pages rendered — while every API call failed authorization. The auth cookie now expires with the token (`data.session.expires_in`), the refresh cookie lives 7 days, and `proxy.ts` mints a new access token from it. It also **re-stores the rotated refresh token**, without which the *next* refresh would be rejected.

**4. A failed delete reported success.** The list page's delete mutation was `mutationFn: (id) => fetch(...)`. `fetch` only rejects on network failure, so a `404` or `500` still resolved, `onSuccess` fired, and the UI showed "Category deleted" for a row that was still in the database. It now throws on a non-OK response. Related: `deleteCategory` didn't check whether a row was actually removed, so deleting a non-existent id returned `{ success: true }`; it now 404s.

**5. Raw Postgres errors were returned to the browser.** `catch (error: any) => { error: error.message }` forwarded messages like `duplicate key value violates unique constraint "categories_slug_key"` — schema disclosure, and meaningless to an admin. `toApiError()` logs them and returns a friendly message with the right status.

**6. `PUT` accepted an unvalidated body.** Only `POST` ran Zod. `PUT` passed `await req.json()` straight into the update, so an edit could write anything into any column. It now validates against `categoryUpdateSchema`.

**7. Slug auto-fill clobbered manual edits.** Typing in Name overwrote the slug on every keystroke, even after the admin had hand-edited it. It now stops once `dirtyFields.slug` is set.

**8. Empty optional fields were stored as `''`.** Clearing Description or Icon Name wrote an empty string rather than `NULL`, and an empty `cover_image_url` was validated as a URL. `emptyToNull` converts `''` → `null`.

---

## Technical Improvements

- **Type safety:** `any` eliminated from the category path — `CategoryForm`'s props, the four `lib/api/categories.ts` mutators, and every route-handler `catch`. The `useForm<CategoryFormInput, unknown, CategoryFormOutput>` generic now reflects that Zod transforms the input, so `handleSubmit` hands over the *transformed* shape.
- **Validation:** `slug` is now **normalised rather than rejected** — it runs through `slugify()` — because a legacy row with a bad slug would otherwise be uneditable (the field is read-only when editing, so there'd be no way to fix it from the UI). `description` capped at 500 chars, `icon_name` at 50, `display_order` at ≥ 0.
- **Slug immutability enforced server-side:** `categoryUpdateSchema = categorySchema.omit({ slug: true })`. The read-only input was only a UI affordance; now a hand-crafted `PUT` can't rewrite the public URL either.
- **Error handling centralised** in `lib/api/errors.ts` instead of being copy-pasted per handler.
- **React Query key centralised** in `lib/queryKeys.ts` — a typo in one file can no longer silently break cache invalidation in another.
- **Correct React Query state:** `isLoading` → `isPending`/`isError`, and `form.watch()` → `useWatch()` (which subscribes to just that field instead of re-rendering the whole form).
- Route handlers use the Next 16 `params: Promise<{ id: string }>` signature.

---

## How It Works

**Signing in.** `signIn()` calls Supabase, then stores the access token and refresh token in two httpOnly cookies. Nothing auth-related is exposed to client-side JavaScript.

**Every admin request.** `proxy.ts` runs before the page or route handler. It reads the access-token cookie and asks Supabase whether it's still valid. If it is, the request proceeds. If it has expired, the proxy uses the refresh token to get a new one, writes it back to the cookie, and lets the request through with the new token attached. If there's no usable session, the request is redirected to `/admin/login` — or given a `401` if it's an API call.

**Loading categories.** `/admin/categories` fetches `GET /api/admin/categories` through React Query. The route re-checks the admin session (`requireAdmin`) — belt and braces, because the query itself runs with the service-role key that ignores RLS — then returns every category, active or not.

**Creating or editing.** The modal form validates locally with Zod. On submit it `POST`s (create) or `PUT`s (edit) as JSON. The server re-validates with the *same* schema, writes via the service-role client, and on success React Query invalidates `ADMIN_CATEGORIES_KEY` so the table refetches.

**Uploading a cover image.** The browser posts the file to `/api/admin/categories/upload`. That route checks the admin session, checks the file's type and size, renames it to a random UUID, and uploads it with the service-role key — the only identity the bucket accepts writes from. It returns the public URL, which the form drops into a hidden `cover_image_url` field and renders as a preview. The URL is saved with the rest of the form.

**Why uploads go through the server:** the browser's Supabase client has no session (the tokens are httpOnly, server-side only), so a direct browser upload would authenticate as `anon` — which is exactly why the bucket had been left publicly writable.

---

