import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api/guard';
import { updateSubcategory, deleteSubcategory } from '@/lib/api/categories';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { subcategoryUpdateSchema } from '@/lib/validations/category.schema';

type RouteParams = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
const isUuid = (value: string) => z.uuid().safeParse(value).success;

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isUuid(id)) return notFound();

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = subcategoryUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await updateSubcategory(id, validated.data);
    if (!data) return notFound();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'subcategory');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isUuid(id)) return notFound();

  try {
    const deleted = await deleteSubcategory(id);
    if (!deleted) return notFound();
    return NextResponse.json({ data: deleted });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'subcategory');
    return NextResponse.json({ error: message }, { status });
  }
}
