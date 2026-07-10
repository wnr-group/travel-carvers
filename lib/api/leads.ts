import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail, emailTemplates } from '@/lib/email/mailgun';

/**
 * Public: Submit a lead form
 */
export async function createLead(leadData: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  package_id?: string;
}) {
  // Insert lead
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      ...leadData,
      status: 'new',
    })
    .select(`
      *,
      packages (
        title
      )
    `)
    .single();

  if (error) throw error;

  // Send notification emails (if Mailgun is configured)
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    try {
      const packageTitle = data.packages?.title || 'General Inquiry';

      // Email to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@travelcarvers.com',
        ...emailTemplates.leadNotification({
          name: data.name,
          email: data.email,
          phone: data.phone,
          packageTitle,
          message: data.message,
        }),
      });

      // Email to customer (confirmation)
      await sendEmail({
        to: data.email,
        ...emailTemplates.leadConfirmation(data.name, packageTitle),
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Don't throw - lead was saved successfully
    }
  }

  return data;
}

/**
 * Admin: Get all leads (requires server-side)
 */
export async function getAllLeads() {

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      packages (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Admin: Get leads by status (requires server-side)
 */
export async function getLeadsByStatus(status: string) {

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      packages (
        title
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Admin: Update lead status (requires server-side)
 */
export async function updateLeadStatus(id: string, status: string) {

  const { data, error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete lead (requires server-side)
 */
export async function deleteLead(id: string) {

  const { error } = await supabaseAdmin
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
