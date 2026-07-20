import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toApiError } from '@/lib/api/errors';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
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
      company_name,
      contact_email,
      contact_phone,
      address,
      show_prices_globally,
      facebook_url,
      instagram_url,
      twitter_url,
      linkedin_url,
    } = body;

    let result;
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .update({
          company_name,
          contact_email,
          contact_phone,
          address,
          show_prices_globally,
          facebook_url,
          instagram_url,
          twitter_url,
          linkedin_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data: existing } = await supabaseAdmin
        .from('site_settings')
        .select('id')
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await supabaseAdmin
          .from('site_settings')
          .update({
            company_name,
            contact_email,
            contact_phone,
            address,
            show_prices_globally,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('site_settings')
          .insert({
            company_name,
            contact_email,
            contact_phone,
            address,
            show_prices_globally,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url,
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
