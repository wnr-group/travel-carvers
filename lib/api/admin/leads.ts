import { supabaseAdmin } from '@/lib/supabase/server';
import type { AdminLeadOutput } from '@/lib/validations/lead.schema';

/**
 * Admin-only lead operations.
 */

/**
 * Admin: record a lead that came in off-site — a phone call, a walk-in, an email.
 *
 * Unlike the public server action this trusts the caller (the route has already checked
 * they are an admin), so there is no rate limiting and the travel dates may be blank.
 */
export async function createLeadAsAdmin(input: AdminLeadOutput) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message ?? null,
      package_id: input.package_id ?? null,
      number_of_adults: input.number_of_adults,
      number_of_children: input.number_of_children,
      number_of_infants: input.number_of_infants,
      travel_start_date: input.travel_start_date ?? null,
      travel_end_date: input.travel_end_date ?? null,
      status: input.status,
    })
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
