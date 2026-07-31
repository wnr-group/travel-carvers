import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/api/guard';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import {
  deleteVisaAttachment,
  replaceVisaAttachmentFile,
} from '@/lib/api/visaAttachments';
import { visaAttachmentFileSchema } from '@/lib/validations/visa.schema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = visaAttachmentFileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await replaceVisaAttachmentFile(id, validated.data);
    if (!data) {
      return NextResponse.json({ error: 'Visa attachment not found' }, { status: 404 });
    }

    revalidatePath('/visa');
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'visa attachment');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = await deleteVisaAttachment(id);
    if (!data) {
      return NextResponse.json({ error: 'Visa attachment not found' }, { status: 404 });
    }

    revalidatePath('/visa');
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'visa attachment');
    return NextResponse.json({ error: message }, { status });
  }
}
