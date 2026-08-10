import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidateCatalogPages } from '@/lib/api/revalidate';
import { createSubcategory, getSubcategoriesAdmin } from '@/lib/api/categories';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { subcategorySchema } from '@/lib/validations/category.schema';

/**
 * Lists every subcategory with the categories it belongs to.
 */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getSubcategoriesAdmin();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Create a subcategory together with its parent-category links..
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = subcategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await createSubcategory(validated.data);
    revalidateCatalogPages();
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'subcategory');
    return NextResponse.json({ error: message }, { status });
  }
}
