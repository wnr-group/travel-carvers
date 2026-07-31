import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidateCatalogPages } from '@/lib/api/revalidate';
import { updateDestination, deleteDestination } from '@/lib/api/destinations';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { destinationUpdateSchema } from '@/lib/validations/destination.schema';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = destinationUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await updateDestination(id, validated.data);
    if (!data) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    revalidateCatalogPages();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const deleted = await deleteDestination(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    revalidateCatalogPages();
    return NextResponse.json({ data: deleted });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}
