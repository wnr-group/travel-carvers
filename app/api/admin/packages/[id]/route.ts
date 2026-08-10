import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidateCatalogPages } from '@/lib/api/revalidate';
import { getPackageForEdit, updatePackageWithRelations, deletePackage } from '@/lib/api/packages';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { packageUpdateSchema } from '@/lib/validations/package.schema';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Load one package in the shape the edit form expects.
 *
 * The response is not the raw database rows — it is the *form* shape, with every column name
 * mapped back (`item_text` -> `text`, `tip_text` -> `tip`, and so on). Doing that translation on
 * the server means the form stays a dumb consumer and the mapping lives in exactly one file next
 * to the insert that mirrors it.
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = await getPackageForEdit(id);

    if (!data) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'package');
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Update a package and replace everything attached to it.
 *
 * `packageUpdateSchema` omits `slug` — the slug is the public URL, and Zod strips the key even if
 * a hand-crafted request sends one. Same rule the categories route already follows.
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = packageUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await updatePackageWithRelations(id, validated.data);
    revalidateCatalogPages();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    // `updatePackageWithRelations` throws a plain Error when the package is gone, which
    // toApiError would otherwise flatten into a generic 500.
    if (error instanceof Error && error.message === 'Package not found') {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const { message, status } = toApiError(error, 'package');
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Delete a package. Its child rows (gallery, itinerary, inclusions, reviews, …)
 * cascade automatically; leads that referenced it are preserved with their
 * package link set to NULL, so no enquiry is lost.
 */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    await deletePackage(id);
    revalidateCatalogPages();
    return NextResponse.json({ data: { id } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'package');
    return NextResponse.json({ error: message }, { status });
  }
}
