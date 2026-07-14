'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Public: Submit a lead form
 */
export async function createLead(leadData: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  package_id?: string | null;
  number_of_adults?: number;
  number_of_children?: number;
  number_of_infants?: number;
  travel_start_date?: string;
  travel_end_date?: string | null;
}) {
  let actualPackageId: string | null = null;
  if (leadData.package_id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(leadData.package_id)) {
      actualPackageId = leadData.package_id;
    } else {
      // Find package by slug
      const { data: pkg } = await supabaseAdmin
        .from('packages')
        .select('id')
        .eq('slug', leadData.package_id)
        .single();
      if (pkg) {
        actualPackageId = pkg.id;
      }
    }
  }

  // Insert lead
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      ...leadData,
      package_id: actualPackageId || null,
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
