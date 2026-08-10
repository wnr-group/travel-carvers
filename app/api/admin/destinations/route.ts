import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { revalidateCatalogPages } from '@/lib/api/revalidate';
import { getDestinations, createDestination } from '@/lib/api/destinations';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { destinationSchema } from '@/lib/validations/destination.schema';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getDestinations();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = destinationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await createDestination(validated.data);
    revalidateCatalogPages();
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}
