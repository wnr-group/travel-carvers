import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toApiError } from '@/lib/api/errors';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { data, error } = await supabaseAdmin
      .from('homepage_sections')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data: data || null });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const {
      id,
      hero_title,
      hero_subtitle,
      hero_cta_text,
      featured_title,
      featured_description,
      trending_title,
      trending_description,
    } = body;

    let result;
    if (id) {
      // Update existing row
      const { data, error } = await supabaseAdmin
        .from('homepage_sections')
        .update({
          hero_title,
          hero_subtitle,
          hero_cta_text,
          featured_title,
          featured_description,
          trending_title,
          trending_description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Check if there is already a row to update
      const { data: existing } = await supabaseAdmin
        .from('homepage_sections')
        .select('id')
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await supabaseAdmin
          .from('homepage_sections')
          .update({
            hero_title,
            hero_subtitle,
            hero_cta_text,
            featured_title,
            featured_description,
            trending_title,
            trending_description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new row if none exists
        const { data, error } = await supabaseAdmin
          .from('homepage_sections')
          .insert({
            hero_title,
            hero_subtitle,
            hero_cta_text,
            featured_title,
            featured_description,
            trending_title,
            trending_description,
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }
    }

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
