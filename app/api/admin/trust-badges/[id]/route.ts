import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { supabaseAdmin } from '@/lib/supabase/server';
import { toApiError } from '@/lib/api/errors';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('trust_badges')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Wrap in the { data } envelope that fetchJson expects — a bare
    // { success: true } trips its "Malformed response from server" guard.
    return NextResponse.json({ data: { success: true } });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
