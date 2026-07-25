import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toApiError } from '@/lib/api/errors';
import { firstZodIssue } from '@/lib/utils';
import { siteSettingsSchema } from '@/lib/validations/site-settings.schema';

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
    const body: unknown = await req.json().catch(() => null);

    const validated = siteSettingsSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    }

    const values = { ...validated.data, updated_at: new Date().toISOString() };

    // Settings is a single row: reuse the provided id, else the existing row,
    // else insert the first one.
    const bodyId = (body as { id?: string } | null)?.id;
    const { data: existing } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .maybeSingle();
    const targetId = bodyId ?? existing?.id;

    let result;
    if (targetId) {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .update(values)
        .eq('id', targetId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
