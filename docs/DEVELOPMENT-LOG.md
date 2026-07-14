# Travel Carvers — Development Log

**Branch:** `feature/admin-dashboard-categories`
----

# Admin Shell & Dashboard

**Goal.** Give the admin area a persistent frame (sidebar + header) so every future admin page has somewhere to live.

**Files created:** `components/admin/AdminNav.tsx`, `components/admin/AdminHeader.tsx`
**Files modified:** `app/(admin)/layout.tsx`, `app/(admin)/admin/dashboard/page.tsx`, `app/(admin)/admin/dashboard/LogoutButton.tsx`
**Components added:** `AdminNav` (sidebar, 7 links, active-route highlighting), `AdminHeader` (search box, notification bell, user chip)
**APIs added:** none
**Tables involved:** `packages`, `leads`, `reviews`, `categories` (dashboard counts only)

**Business logic.** The layout became a **client component** so it can call `usePathname()` and hide the sidebar/header on `/admin/login` — a login screen inside an admin chrome would be nonsense.

**State management.** None beyond `usePathname()`.
**UI changes.** Fixed 256px sidebar; dashboard stat cards restyled to fit inside it.
**Hooks used:** `usePathname`
**Assumptions.** Seven nav destinations were planned. **Only Dashboard, Categories and Packages actually exist** — the other four links (Leads, Reviews, Homepage, Settings) point at pages that don't exist yet.


---

# Categories Management (CRUD)

**Goal.** Let an admin create, edit and delete the categories packages are organised under.

**Files created:** `app/(admin)/admin/categories/page.tsx`, `components/admin/CategoryForm.tsx`, `components/admin/ImageUploader.tsx` (first version), `lib/types/category.ts`, `lib/utils.ts`, `app/api/admin/categories/route.ts`, `app/api/admin/categories/[id]/route.ts`
**Files modified:** `lib/validations/category.schema.ts`, `lib/api/categories.ts`

**APIs added:**

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/admin/categories` | `GET` | List all categories (including inactive) |
| `/api/admin/categories` | `POST` | Create |
| `/api/admin/categories/[id]` | `PUT` | Update |
| `/api/admin/categories/[id]` | `DELETE` | Delete |

**Tables involved:** `categories`

**Business logic introduced.**
- **`slugify()`** (`lib/utils.ts`) — turns *"Group Tours & Cruises"* into `group-tours-cruises`. Needed because the slug becomes part of the public URL and can't contain spaces or symbols.
- **Slug auto-fill** (`CategoryForm.tsx`) — typing a name mirrors into the slug **until the admin edits the slug by hand** (guarded by `dirtyFields.slug`). Without that guard, a deliberate slug would be clobbered on every keystroke.
- **Slug immutability on edit** — the slug is part of the public URL, so `categoryUpdateSchema = categorySchema.omit({ slug: true })`. The read-only input is only a UI hint; omitting the key server-side means a hand-crafted `PUT` can't rewrite it either.

**Validation added** (`lib/validations/category.schema.ts`): name 2–100 chars; description ≤ 500; icon name ≤ 50; display order ≥ 0. **`emptyToNull`** converts `''` → `null` so clearing a field actually clears the column, and an empty string is never validated as a URL.

**State management.** React Query for the list; `useMutation` for create/update/delete; cache keyed by `ADMIN_CATEGORIES_KEY` and invalidated after every mutation.
**Error handling.** Loading / error / empty states on the list; toast on every mutation outcome.
**Hooks used:** `useQuery`, `useMutation`, `useQueryClient`, `useForm`, `useWatch`
**Dependencies.** `lib/api/categories.ts` → `supabaseAdmin`.

---

#  Security & Reliability Hardening (`fix/blockers`)

**Files created:** `proxy.ts`, `lib/api/guard.ts`, `lib/api/errors.ts`, `lib/queryKeys.ts`, `supabase/migrations/20260713120000_restrict_category_image_uploads.sql`
**Files modified:** `lib/supabase/auth.ts`, all category routes, `CategoryForm.tsx`, `ImageUploader.tsx`, categories page, dashboard, login page

**Business logic introduced — and why each was needed:**

**1. `proxy.ts` — the auth gate.** In **Next.js 16 the `middleware` convention is deprecated and renamed to `proxy`**, so this file *is* the middleware. It guards `/admin/*` and `/api/admin/*`: it validates the access token, and if it has expired it silently refreshes it from the refresh token.
*Why:* a Supabase access token lives ~1 hour but the login cookie was set to 6. Between hour 1 and hour 6 the admin **appeared logged in** — pages rendered — while every API call silently failed. It also re-stores the **rotated** refresh token; without that, the *next* refresh would be rejected.

**2. `lib/api/guard.ts` — `requireAdmin()`.** The admin API routes had **no authentication at all** while querying with the **service-role key, which bypasses every database rule**. Anyone who knew the URL could read, create, edit and delete categories. Every admin route now calls this first.

**3. `lib/api/errors.ts` — `toApiError()`.** Raw Postgres messages (`duplicate key value violates unique constraint "categories_slug_key"`) were being sent to the browser — schema disclosure, and meaningless to an admin. Now logged server-side and replaced with a friendly message plus the right status (`23505` → 409, `23503` → 409, `PGRST116` → 404).

**4. A failed delete reported success.** `mutationFn: (id) => fetch(...)` — **`fetch` only rejects on network failure**, so a 404 or 500 still resolved, `onSuccess` fired, and the UI said "Category deleted" for a row still in the database.

**Edge cases handled.** Duplicate slug → friendly 409; deleting a non-existent id → 404; unvalidated `PUT` body → now validated; empty optional fields → `NULL` not `''`.
**Remaining TODOs.** None from this ticket — but the same *classes* of bug (UI-only validation, storage orphans) recur later.

---

# Package List Page

**Goal.** Browse packages in a table or a card grid, filtered by status, search and category.

**Files created:** `app/(admin)/admin/packages/page.tsx`, `components/admin/PackageTable.tsx`, `components/admin/PackageCard.tsx`, `components/admin/PackageFilters.tsx`, `components/admin/StatusBadge.tsx`, `lib/types/package.ts`, `lib/api/fetchJson.ts`, `lib/hooks/useAdminPackages.ts`, `lib/hooks/useAdminCategories.ts`, `lib/hooks/useDebouncedValue.ts`, `lib/hooks/useLocalStorage.ts`, `app/api/admin/packages/route.ts`, `supabase/migrations/20260714100000_add_package_view_count.sql`
**Files modified:** `lib/api/packages.ts`, `lib/queryKeys.ts`, `lib/utils.ts`, `lib/validations/package.schema.ts`, `app/(admin)/admin/categories/page.tsx` (de-duplicated onto the shared hook)

**Components added:** `PackageTable`, `PackageCard`, `PackageFilters`, `StatusBadge`
**APIs added:** `GET /api/admin/packages?status=&search=&category=`
**Tables involved:** `packages`, `package_gallery`, `package_categories`, `categories`

**Business logic introduced.**
- **`getPackagesAdmin(filters)`** (`lib/api/packages.ts`) — builds the filtered query and **flattens** Supabase's nested join rows into a flat `AdminPackage`, so the table and the cards don't each unpick the nesting.
- **`escapeLikePattern()`** — **`%` and `_` are SQL wildcards.** Searching for a package titled *"50% Off"* with an unescaped `%` would have matched **every package in the database**.
- **Category filtering resolves ids first.** PostgREST's `!inner` filter would also prune the *embedded* rows, so each package would show only the category you filtered by. Resolving the package ids in a separate query keeps the displayed category list complete.

**Validation added.** `packageFiltersSchema` — status enum, search ≤ 100 chars, category must be a UUID. Empty strings collapse to `undefined` before parsing.

**State management changes.** Filters live in the **React Query cache key** (`adminPackagesKey(filters)`), which is what makes changing a filter refetch automatically — **there is no manual refetch anywhere.** `keepPreviousData` stops the list flashing back to a skeleton on every keystroke.

**Important functions:** `getPackagesAdmin`, `escapeLikePattern`, `toAdminPackage`, `fetchJson`, `formatPrice`, `formatDate`, `packagePath`
**Hooks used:** `useQuery`, `useMemo`, `useState`, `useSyncExternalStore` (in `useLocalStorage`)

**`useLocalStorage` — why `useSyncExternalStore`.** The obvious `useState` + `useEffect` version was **rejected by ESLint** (`react-hooks/set-state-in-effect`) and it's right: localStorage is an *external store*. Seeding state from it during render breaks SSR (no `window`); seeding it from an effect makes the first paint disagree with the stored value.

**Error handling.** `fetchJson` throws on any non-2xx (because `fetch` doesn't). Loading / error / empty panels; the empty state distinguishes "no packages" from "no packages *match these filters*" and offers to clear them.

---

# Reusable ImageUploader & Generic Upload API

**Goal.** One drag-and-drop uploader used by every admin form, with a single secure upload endpoint.

**Files created:** `lib/storage/buckets.ts`, `lib/api/uploadImage.ts`, `app/api/admin/upload/route.ts`
**Files modified:** `components/admin/ImageUploader.tsx` (rewritten), `components/admin/CategoryForm.tsx`
**Files deleted:** `app/api/admin/categories/upload/route.ts` (superseded — **not duplicated**)

**APIs added:** `POST /api/admin/upload` (multipart: `file`, `bucket`, `path`)
**Tables involved:** none — Supabase **Storage** buckets: `category-images`, `package-images`, `itinerary-images`, `hotel-images`

**Third-party library added:** **`react-dropzone` ^17.0.0** — the only new dependency in this entire log.

**Business logic introduced.**
- **A bucket allow-list** (`lib/storage/buckets.ts`). The bucket is a *component prop*, which means it reaches the server as **user input**. Without the allow-list, a caller could name any bucket in the project and the service-role key would write to it. **This file deliberately imports nothing** — importing anything Supabase-related would drag the service-role client into the browser bundle.
- **Path validation, not scrubbing.** Scrubbing `../../etc/passwd` silently produced an `etc/passwd/` folder. It never escaped the bucket (a storage key is just a string inside one), but it buried a caller's bug as misplaced objects. It now returns `400`.
- **`uploadImage()`** uses **`XMLHttpRequest`, not `fetch`** — the only place in the codebase that does. **`fetch` emits no upload-progress events**, so a progress bar built on it can only ever be a fake animation. XHR exposes `upload.onprogress`, so the percentage shown is real bytes on the wire.
- **Controlled mode** (added later for the Gallery tab). `value` + `showPreviews` let a parent own the image list. Without it, removing an image in a gallery would drift from the uploader's internal count and "17 slots left" would start lying.

**Validation added.** MIME allow-list (JPEG/PNG/WebP → `415`), 5MB cap (`413`), empty file (`400`), unknown bucket (`400`), bad path (`400`). Extension is derived from the **sniffed MIME type, never the client filename**, and the file is renamed to a `crypto.randomUUID()`.

**Error handling / edge cases.** Drop 5 images and one fails → **the other 4 still upload** (`Promise.allSettled`), and the failure is toasted by name. The file input is cleared after each attempt so the same file can be retried.

**Hooks used:** `useDropzone`, `useCallback`, `useState`, `useRef`, `useEffect`
**Remaining TODO.** **Removing an image does not delete it from storage.** Orphans accumulate. This recurs in three later tickets and wants one solution, not four.

---

# Package Form architecture + Tab 1: Basic Info

**Goal.** A nine-tab form where every tab shares one form state, and adding a tab requires no refactor.

**Files created:** `app/(admin)/admin/packages/new/page.tsx`, `components/admin/PackageForm/PackageForm.tsx`, `components/admin/PackageForm/tabs.ts`, `components/admin/PackageForm/BasicInfoTab.tsx`, `components/admin/FieldError.tsx`
**Files modified:** `lib/validations/package.schema.ts` (split out `basicInfoSchema`), `lib/utils.ts` (`packagePath`), `CategoryForm.tsx` (shared `FieldError`), `PackageTable`/`PackageCard` (use `packagePath`)

**Business logic introduced.**
- **One `useForm`, shared via `FormProvider`.** Tabs take **no props**; they reach the form through `useFormContext()`. This is why switching tabs never loses input.
- **`tabs.ts` — a registry.** Each entry declares `id`, `label`, **the fields it owns**, and a `Component`. The field-ownership list is what lets the shell badge a tab red when something inside it is invalid **without knowing what those fields mean** — it just intersects the names with `formState.errors`. Tabs with no `Component` render a placeholder.
- **`defaultValues` seeds every field of the schema**, not just Basic Info's — so a tab added later finds its values present rather than flipping inputs from uncontrolled to controlled.

**Validation added.** Title 5–200; slug normalised via `transform(slugify)` (**normalised, not rejected** — a rejected slug would be unfixable from a read-only field); short description 20–200 with a live counter; full description ≥ 50.

**UI changes.** Tab strip with error badges; Basic Info fields; live character counter; `maxLength` at the keyboard **plus** schema enforcement on submit (because `maxLength` does nothing against paste-and-submit or a crafted request).

**Assumption fixed.** The spec's slug preview said `/package/{slug}` while the package list linked to `/packages/{slug}`. Both routes are unbuilt, but they mustn't disagree — so it's now **one helper**, `packagePath()`. Changing it is a one-line edit.

---

# Tab 2: Pricing & Duration

**Files created:** `PricingTab.tsx`, `fields.ts`, `FormSection.tsx`
**Files modified:** `tabs.ts`, `BasicInfoTab.tsx` (de-duplicated `INPUT_CLASSES`), `lib/types/package.ts` (`PACKAGE_DIFFICULTIES`)
**Tables involved:** `packages` (columns only)

**The one piece of logic that matters — `numberField` (`fields.ts`).**
An `<input type="number">` hands React Hook Form a **string**, and an empty box is `''`. The trap:

So `valueAsNumber: true` would silently turn a **cleared Adult Price into a free package**, and a cleared Days into a zero-day trip — and both would sail past `z.number()` because they genuinely *are* numbers. `numberField` maps empty → `undefined` ("left blank") and lets Zod decide whether blank was allowed.

**`optionalSelectField`** (later renamed `emptyToUndefined`) does the same for selects: `z.enum([...]).optional()` means "one of these, or **undefined**" — it **rejects `''`**, so picking "Not specified" for Difficulty would have raised an error the admin could not clear.

**Validation.** Prices positive & optional; days ≥ 1; nights ≥ 0 (a day trip is 0 nights); difficulty enum.

---

# Tab 3: Categories & Location

**Files created:** `CategoriesTab.tsx`, `app/api/admin/subcategories/route.ts`, `lib/hooks/useAdminSubcategories.ts`
**Files modified:** `lib/api/categories.ts` (`getSubcategoriesAdmin`), `lib/types/category.ts` (`Subcategory`), `lib/queryKeys.ts`, `tabs.ts`
**APIs added:** `GET /api/admin/subcategories`
**Tables involved:** `categories`, `subcategories`, `category_subcategory`

**Business logic.** **Subcategories belong to categories** via the `category_subcategory` join table, so only the subcategories of the *selected* categories are offered. `getSubcategoriesAdmin()` flattens the join into a `category_ids` array; the tab filters **in memory** (ticking a category is instant, no round trip).
**Pruning:** unticking a category drops any subcategory that only belonged to it — otherwise the package keeps a hidden subcategory the admin can't see to remove.

**`useController`, not `register`.** A checkbox *group* must produce an **array**. RHF's `register` only builds an array when several checkboxes share a name — with exactly **one** category in the database it would hand back `true` instead of `['abc-123']`.

**Coordinates.** Plain-text preview, no map. `RealWorldMap`/`WorldMap` exist but render a **hardcoded destination list and accept no coordinates** — nothing to reuse. **Oct → Mar-style year wrapping doesn't apply here**, but lat/lng are independently optional, so a latitude with no longitude is currently saveable.

**⚠️ Remaining TODO (blocking this feature in practice).** The **`category_subcategory` table is empty** in your database — all 5 real subcategories have no category links, and **no admin UI exists to create them**. So the subcategory picker will show *"The selected categories have no subcategories"* for every category until that's built.

---

# Tab 4: Gallery

**Files created:** `GalleryTab.tsx`, `gallery.ts`
**Files modified:** `ImageUploader.tsx` (**controlled mode** added), `lib/utils.ts` (`isYouTubeUrl`), `tabs.ts`
**Third-party library:** **none added** — `framer-motion` was already a dependency and exports `Reorder` + `useDragControls`, so drag-and-drop reuses it rather than adding `@dnd-kit`.

**Business logic — `normalize()` (`gallery.ts`).** Every mutation (upload, remove, set-cover, reorder) runs through one pure function that enforces two invariants:
1. `display_order` always equals array position.
2. **Exactly one image is the cover.** None flagged → the first takes over; several flagged → the first wins.

This makes *"only one cover can exist"* **true by construction** rather than something four handlers must remember. **The cover flag lives on the image object, not on a position**, so dragging the cover to the bottom keeps it the cover.

**`isYouTubeUrl()` (`lib/utils.ts`)** parses with `URL` and matches the **hostname** against an allow-list. A regex like `/youtube\.com/` would happily accept `https://youtube.com.evil.example/…`.

**Edge cases.** Enter in the video box is intercepted (`preventDefault`) — the gallery sits inside the package `<form>`, so without it Enter would **submit the whole package** instead of adding a video.

---

# Tab 5: Itinerary

**Files created:** `ItineraryTab.tsx`, `itinerary.ts`
**Files modified:** `tabs.ts`
**Tables involved:** `itinerary_days`, `itinerary_day_images`

**Business logic — auto-renumbering.** `day_number` is what the database stores and the public page renders, so deleting Day 2 must make the old Day 3 *become* Day 2 — otherwise the trip reads *"Day 1, Day 3, Day 4"*.

**A bug my own test caught:** the first version used `replace()` to delete a day. It renumbered correctly — but **`replace()` regenerates every field's `id`**, and those ids track which days are expanded. Deleting one day silently collapsed all the others. The fix is `remove(index)`, which **preserves the survivors' ids**. *(`replace` ≠ `remove` where ids are concerned — this bit twice.)*

**Scalability.** `useFieldArray` keeps inputs uncontrolled, so typing in Day 7 doesn't re-render Day 1. Days are **collapsible**, and the state tracks which are *collapsed* (inverted) so a day you just added is open with nothing to track, while a saved 30-day trip doesn't mount 30 dropzones and 90 textareas at once. A collapsed day still shows a red warning icon if something inside it is invalid.

**ImageUploader reuse.** Day images are a plain `string[]` — ImageUploader's native shape. `useController` + controlled mode means its own remove button writes straight back into the form. **Zero new upload or preview code.**

---

#  Tab 6: Inclusions & Exclusions

**Files created:** `InclusionsTab.tsx`, `ChecklistEditor.tsx`, `inclusions.ts`, `IconSelect.tsx`, `lib/icons.ts`, `components/ui/DynamicIcon.tsx`
**Tables involved:** `package_inclusions`

**Business logic.** Inclusions and exclusions have an **identical schema shape**, and in the database they're **one table** (`package_inclusions`, split by `is_included`). So `ChecklistEditor` is written once and rendered twice with a different `field` prop. **Adding a third list costs one line.**

**`lib/icons.ts` — a closed icon registry.** No icon list existed; `CategoryForm` uses a **free-text** `icon_name` box, so a typo like `"Camara"` silently renders nothing on the public site and nobody knows which names are valid. The registry makes an invalid icon unrepresentable. All 26 names were **verified against the installed lucide** first — this version has no `Youtube` export, which had already bitten once.

**`DynamicIcon` — why it exists.** `const Icon = getIcon(name)` then `<Icon />` is **rejected by ESLint**: *"Cannot create components during render."* The React Compiler can't prove the function returns an *existing* component rather than a fresh one (which would remount the subtree every render). `DynamicIcon` confines the lookup to one component that indexes the static registry directly.

**Live preview** stays in sync via `useWatch` — `getValues()` reads once and never updates, so a preview built on it would go stale instantly.

---

# Tab 7: Stay Details

**Files created:** `StayTab.tsx`, `stay.ts`, `components/ui/StarRating.tsx`, `CheckboxGroup.tsx`, `useCollapsibleRows.ts`
**Files modified:** `useOrderedFieldArray.ts` (one line), `CategoriesTab.tsx` + `ItineraryTab.tsx` (adopted the shared components)
**Tables involved:** `stay_details`

**The trap.** `image_url` is `z.string().url().optional()`. **`''` is not a valid URL**, so defaulting a photo-less hotel to `''` would fail validation with *"Invalid URL"* on **every hotel without a picture**. `createHotel()` uses `undefined`. *(CategoryForm gets away with `''` only because its schema runs an empty-string-to-null transform first; this one doesn't.)*

**`rating` is required** (`.min(1).max(5)`, no `.optional()`) while the **database column allows NULL** — the schema is stricter than the DB. A hotel therefore cannot be "unrated", so new hotels default to **3** (the middle; starting at 5 would quietly flatter every hotel the admin forgets to set).

**`StarRating`** uses real **`<input type="radio">`** elements, not buttons. That's the whole accessibility story for free: arrow-key navigation, "3 of 5 stars" announced, native form participation. Each group needs a **page-unique `name`** or hotel 2's stars would deselect hotel 1's.

**`check_in_date` / `check_out_date` are misleadingly named.** They're `VARCHAR(50)`, not dates — and logically can't be: a package is a reusable template with no fixed calendar dates. They're rendered as **times**.

**`CheckboxGroup`** was extracted from `CategoriesTab` (which had it inline) and wraps in a `<fieldset>`/`<legend>` — **closing an accessibility gap flagged three tickets earlier**, in both places at once.

---

# Tab 8: Additional Info

**Files created:** `AdditionalTab.tsx`, `additional.ts`, `useOrderedFieldArray.ts`, `ordering.ts`
**Files modified:** `tabs.ts`, `ItineraryTab.tsx` + `ChecklistEditor.tsx` (adopted the shared hook), `itinerary.ts` + `inclusions.ts` (removed the now-duplicated helpers)
**Tables involved:** `travel_tips`, `best_time_to_visit`, `places_to_visit`

**Business logic — `useOrderedFieldArray`.** `ItineraryTab` and `ChecklistEditor` each carried their **own copy** of the same four-step delete dance (read values → drop the row → write the corrected order back into every row that shifted). Travel Tips would have been a third. It's now one hook, with the arithmetic in a pure, tested function (`ordering.ts`). It also encodes the `remove()`-not-`replace()` rule so nobody re-learns it.

**`wrapsYearEnd()`.** **October → March is a completely normal "best time to visit"** — a naive `end > start` validation would **reject valid data**. Instead of erroring, the tab detects the wrap and says so, which also catches an admin who picked the months backwards.

**Schema inconsistency noted.** Only `travel_tips` has a `display_order`; `best_time_to_visit` and `places_to_visit` are ordered by array position alone. I did **not** invent one for them (that would be a schema change).

**Entry fee stays free text** — real values are `Free` and `₹200 (foreign nationals)`, which a number field would destroy.

---

# Tab 9: SEO Metadata

**Files created:** `SEOTab.tsx`, `seo.ts`
**Files modified:** `fields.ts` (renamed `optionalSelectField` → `emptyToUndefined`), `PricingTab.tsx`, `package.schema.ts` (exported `META_TITLE_MAX` / `META_DESCRIPTION_MAX`), `tabs.ts`

**Business logic.**
- **`truncate()`** cuts at a **word boundary**, with a 60% floor so a single very long word doesn't collapse the string to three characters. A hard `slice()` produces *"…with Houseboat Sta"*.
- **Auto-generation, and why it can't loop.** Three guards: (1) a `hasAutoFilled` ref means the effect *acts* only once per visit; (2) it reads via **`getValues()`**, not the watched values — putting `metaTitle` in the dependency array would make `setValue` re-trigger the effect (the classic infinite loop); (3) **`touchedFields`** — an admin who *deliberately clears* the meta title must not have it helpfully re-filled forever. An `isDirty` check wouldn't work, because clearing back to `''` equals the default and RHF considers that **not dirty**.
- **`og_image` hits the same `''` trap** as the hotel image — hence the `emptyToUndefined` rename (one helper, two uses, no duplication).

---

# Submit & Validation (Package Creation)

**Goal.** Make the form actually save — across 12 tables.

**Files created:** none
**Files modified:** `lib/api/packages.ts` (`createPackageWithRelations`), `app/api/admin/packages/route.ts` (`POST`), `PackageForm.tsx` (Draft/Publish buttons), `app/(admin)/admin/packages/new/page.tsx` (mutation + redirect), `lib/api/errors.ts` (`toApiError(error, resource)`)

**APIs added:** `POST /api/admin/packages` → `201 { data: { id } }`
**Tables involved:** `packages`, `package_categories`, `package_subcategories`, `package_gallery`, `package_videos`, `itinerary_days`, `itinerary_day_images`, `package_inclusions`, `stay_details`, `travel_tips`, `best_time_to_visit`, `places_to_visit` — **12 tables.**

**The core problem: the form's field names don't match the database columns.**

| Form (`packageSchema`) | Database column |
| --- | --- |
| `inclusions[].text` / `.icon` | `package_inclusions.item_text` / `icon_name` |
| `exclusions` | **same table**, `is_included = false` |
| `travel_tips[].tip` | `travel_tips.tip_text` |
| `gallery_images[].url` | `package_gallery.image_url` |
| `video_urls: string[]` | `package_videos.video_url` + `display_order` |
| `itinerary_days[].images` | **separate table**, keyed by the day's generated `id` |
| `category_ids` | join-table rows |

A naive `insert(data)` fails on every one. `insertPackageRelations()` is where that translation happens — deliberately in one place, spelled out.

**Insert order (forced by the foreign keys).** `packages` first (everything references its `id`) → then all children in parallel. **`itinerary_day_images` references `itinerary_days.id`, not `package_id`**, so days must be inserted and their ids read back first. Ids are matched to images **by `day_number`, not array position** — PostgREST makes no promise about the order it returns inserted rows in, so pairing "the 3rd row I sent" with "the 3rd row it returned" would silently attach **Day 3's photos to Day 5**.

**Rollback — and the honest caveat.** **Supabase has no client-side transactions.** If a child insert fails after the package row is in, the package row is **deleted again**, and every child's `ON DELETE CASCADE` takes the children with it. Verified: a forced FK violation left **zero orphaned rows**. But this is a **compensating delete, not a rollback** — if the cleanup call itself fails, a bare package row survives. A Postgres function via `rpc()` would be genuinely atomic; it's on the backlog.

**Draft vs Publish.** Two buttons. The status is applied to a **copy** (`{ ...data, status }`) rather than via `setValue` — `setValue` is async relative to the click handler, and clicking "Save as Draft" shouldn't silently rewrite the Status dropdown the admin can see. The `<form>`'s own submit is suppressed so pressing Enter can't save with an unintended status. `onInvalid` **jumps to the first tab with an error** — otherwise clicking Publish with a bad field on a hidden tab looks like the button doing nothing.

**Validation.** The **same `packageSchema`** runs in the browser and on the server. A form is a convenience, not a security boundary — `curl` doesn't run React.

**Verified end-to-end** against the live database: all 12 tables populated, every mapping correct, day images on the right days, duplicate slug → `409`, unauthenticated → `401`, missing fields → `400`, and the rollback leaves nothing behind.

---

# Architecture Changes

## New folder structure

```
app/api/admin/
  categories/           (existing)
  packages/route.ts     GET + POST          ← new
  subcategories/route.ts GET                ← new
  upload/route.ts       POST (generic)      ← new, replaces categories/upload

components/admin/PackageForm/    ← entirely new module
  PackageForm.tsx       the shell (one useForm, FormProvider)
  tabs.ts               the registry — add a tab here, nothing else changes
  *Tab.tsx              the nine tabs
  fields.ts             INPUT_CLASSES, numberField, emptyToUndefined
  FormSection.tsx, FieldError.tsx, CheckboxGroup.tsx, IconSelect.tsx
  useOrderedFieldArray.ts, useCollapsibleRows.ts
  ordering.ts, gallery.ts, itinerary.ts, inclusions.ts, stay.ts,
  additional.ts, seo.ts     ← pure logic, no React, unit-testable

components/ui/
  StarRating.tsx, DynamicIcon.tsx     ← reusable beyond packages

lib/
  storage/buckets.ts    upload allow-list (imports NOTHING, on purpose)
  icons.ts              closed icon registry
  api/fetchJson.ts      one place that checks res.ok
  api/uploadImage.ts    XHR upload with real progress
  hooks/                useAdminPackages, useAdminSubcategories,
                        useDebouncedValue, useLocalStorage
```


## API flow

```
Browser
  → proxy.ts            (logged in? refresh the token if it's expired)
  → API route           requireAdmin() → Zod validate → do the work → toApiError()
  → lib/api/*.ts        the only files that touch Supabase
  → Supabase (service-role key — bypasses RLS, hence the guards above)
  ← { data } or { error }
```

## Data flow (reads)

```
Page → React Query hook → fetchJson → API route → lib/api → Supabase
                ↑
      cache key includes the filters,
      which is what makes a filter change refetch
```

## Form flow

```
PackageForm  ── one useForm ──→ FormProvider
                                    │
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
  BasicInfo     Pricing        Categories        Gallery   … 9 tabs
     └── each calls useFormContext(); NO props, NO local copies ──┘
                                    │
                       "Save as Draft" / "Publish"
                                    │
                    handleSubmit → validate the WHOLE form
                                    │
                    { ...data, status } → POST
```

Tabs are mounted one at a time but the state lives in the shell, so **switching tabs never loses input**.

## Validation flow

```
lib/validations/package.schema.ts   ← ONE schema
        │                                   │
   zodResolver (browser)            safeParse (server)
   instant red field errors         400 + firstZodIssue()
```

## Image upload flow

```
Drop file → react-dropzone validates type & size locally
          → uploadImage() via XMLHttpRequest (real progress %)
          → POST /api/admin/upload
              requireAdmin → bucket allow-list → path check
              → MIME sniff → size cap → rename to UUID
              → write with the SERVICE-ROLE key
          → public URL back → into the form
```

## Package creation flow

```
POST /api/admin/packages
  requireAdmin()
  packageSchema.safeParse(body)          ← same schema the form used
  createPackageWithRelations()
      INSERT packages                    → returns the generated id
      Promise.all([                      ← 9 independent inserts, concurrent
        package_categories, package_subcategories, package_gallery,
        package_videos, package_inclusions (incl + excl), stay_details,
        travel_tips, best_time_to_visit, places_to_visit,
        insertItineraryDays()            ← the ONLY sequential branch:
      ])                                    days first, read back their ids,
                                            THEN itinerary_day_images
      on any failure → DELETE the package → cascades remove the children
  201 { data: { id } }
  → toast → invalidate the list cache → redirect to /admin/packages
```

---



