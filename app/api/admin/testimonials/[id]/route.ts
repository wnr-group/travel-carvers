import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toApiError } from '@/lib/api/errors';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      customer_name,
      customer_role,
      review_text,
      rating,
      photo_url,
      is_featured,
      display_order,
    } = body;

    const updateFields: Record<string, any> = {};
    if (customer_name !== undefined) updateFields.customer_name = customer_name;
    if (customer_role !== undefined) updateFields.customer_role = customer_role;
    if (review_text !== undefined) updateFields.review_text = review_text;
    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating must be an integer between 1 and 5.' }, { status: 400 });
      }
      updateFields.rating = rating;
    }
    if (photo_url !== undefined) updateFields.photo_url = photo_url;
    if (is_featured !== undefined) updateFields.is_featured = !!is_featured;
    if (display_order !== undefined) {
      updateFields.display_order = typeof display_order === 'number' ? display_order : 0;
    }
    
    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ data: { success: true } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
