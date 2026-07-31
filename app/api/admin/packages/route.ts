import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidateCatalogPages } from '@/lib/api/revalidate';
import { createPackageWithRelations, getPackagesAdmin } from '@/lib/api/packages';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { packageFiltersSchema, packageSchema } from '@/lib/validations/package.schema';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);

    const validated = packageFiltersSchema.safeParse({
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
    });

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await getPackagesAdmin(validated.data);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'package');
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Create a package and every row that hangs off it.
 *
 * Auth first, then validation, then the write — in that order, deliberately. There is no point
 * parsing (or worse, inserting) anything for a caller who isn't allowed to be here, and these
 * routes query with the service-role key, which bypasses RLS entirely.
 *
 * The body is re-validated with the *same* `packageSchema` the browser used. The form already
 * checked it, but a form is a convenience, not a security boundary: `curl` doesn't run React.
 *
 * Not atomic — see `createPackageWithRelations`. A failed child insert deletes the package again
 * and the cascades clean up, which is all-or-nothing in practice, but a Postgres function would
 * make it a real transaction.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = packageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await createPackageWithRelations(validated.data);
    revalidateCatalogPages();
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'package');
    return NextResponse.json({ error: message }, { status });
  }
}
