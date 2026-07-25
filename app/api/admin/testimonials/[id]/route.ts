import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { cleanupTestimonialImages } from '@/lib/api/testimonialImages';
import { toApiError } from '@/lib/api/errors';
import { testimonialUpdateSchema } from '@/lib/validations/testimonial.schema';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = testimonialUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid testimonial data.' },
        { status: 400 }
      );
    }

    // Only persist fields the client actually sent (a reorder must not reset
    // is_featured, etc.), plus the updated_at bump.
    const updateFields: Record<string, string | number | boolean | null> = {
      updated_at: new Date().toISOString(),
    };
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined) updateFields[key] = value;
    }

    const { data: prev } = await supabaseAdmin
      .from('testimonials')
      .select('photo_url')
      .eq('id', id)
      .maybeSingle();

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Drop the previous photo if this update replaced or cleared it.
    await cleanupTestimonialImages([prev?.photo_url]);

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
    const { data: prev } = await supabaseAdmin
      .from('testimonials')
      .select('photo_url')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await cleanupTestimonialImages([prev?.photo_url]);

    return NextResponse.json({ data: { success: true } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
