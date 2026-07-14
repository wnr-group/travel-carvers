import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { updateCategory, deleteCategory } from '@/lib/api/categories';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { categoryUpdateSchema } from '@/lib/validations/category.schema';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = categoryUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await updateCategory(id, validated.data);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const deleted = await deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ data: deleted });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
