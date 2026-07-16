import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Admin-only lead operations.
 */

/**
 * Admin: Get all leads
 */
export async function getAllLeads() {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      packages (
        title,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Admin: Update lead status
 */
export async function updateLeadStatus(leadId: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select(`
      *,
      packages (
        title,
        slug
      )
    `)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Admin: Delete lead
 */
export async function deleteLead(leadId: string) {
  const { error } = await supabaseAdmin
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) throw error;
}
