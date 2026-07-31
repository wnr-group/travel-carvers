import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/api/guard';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { createVisaAttachment, getVisaAttachments } from '@/lib/api/visaAttachments';
import { visaAttachmentSchema } from '@/lib/validations/visa.schema';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getVisaAttachments();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'visa attachment');
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body: unknown = await req.json().catch(() => null);
    const validated = visaAttachmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const data = await createVisaAttachment(validated.data);

    // The public /visa page is ISR-cached (`revalidate = 3600`); refresh it so
    // the new country/document appears on the next visit instead of up to an
    // hour later.
    revalidatePath('/visa');

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error, 'country');
    return NextResponse.json({ error: message }, { status });
  }
}
