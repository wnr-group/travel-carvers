'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { leadSchema, type LeadFormData } from '@/lib/validations/lead.schema';

/**
 * Public: Submit a lead form.
 */
export async function createLead(input: LeadFormData) {
  const leadData = leadSchema.parse(input);

  // `package_id` may arrive as a real UUID or as a slug; resolve slugs to the actual id.
  let actualPackageId: string | null = null;
  const rawPackageId = leadData.package_id;
  if (rawPackageId) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(rawPackageId)) {
      actualPackageId = rawPackageId;
    } else {
      const { data: pkg } = await supabaseAdmin
        .from('packages')
        .select('id')
        .eq('slug', rawPackageId)
        .maybeSingle();
      if (pkg) actualPackageId = pkg.id;
    }
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      message: leadData.message || null,
      number_of_adults: leadData.number_of_adults,
      number_of_children: leadData.number_of_children,
      number_of_infants: leadData.number_of_infants,
      travel_start_date: leadData.travel_start_date,
      travel_end_date: leadData.travel_end_date || null,
      package_id: actualPackageId,
    })
    .select(`
      *,
      packages (
        title
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
