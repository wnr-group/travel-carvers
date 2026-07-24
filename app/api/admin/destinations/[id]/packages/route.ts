import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api/guard';
import {
  getDestinationPackages,
  linkPackageToDestination,
  unlinkPackageFromDestination,
} from '@/lib/api/destinations';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';

type RouteParams = { params: Promise<{ id: string }> };

const linkSchema = z.object({
  package_id: z.guid({ error: 'Package must be a valid id' }),
});

export async function GET(_req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = await getDestinationPackages(id);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = linkSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    // Idempotent: re-linking an existing pair is a no-op, not a duplicate-key error.
    await linkPackageToDestination(id, validated.data.package_id);
    return NextResponse.json({ data: { destination_id: id, ...validated.data } }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = linkSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    await unlinkPackageFromDestination(id, validated.data.package_id);
    return NextResponse.json({ data: { destination_id: id, ...validated.data } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'destination');
    return NextResponse.json({ error: message }, { status });
  }
}
