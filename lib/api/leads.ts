'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { leadSchema, type LeadFormData } from '@/lib/validations/lead.schema';
import { sendEmail } from '@/lib/email/mailgun';
import { leadNotificationEmail } from '@/lib/email/templates/leadNotification';
import { leadReceivedEmail } from '@/lib/email/templates/leadReceived';

/** The lead row we read back after insert (with the joined package title). */
interface InsertedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  number_of_adults: number | null;
  number_of_children: number | null;
  number_of_infants: number | null;
  travel_start_date: string | null;
  travel_end_date: string | null;
  packages?: { title: string | null } | null;
}

/**
 * Public: Submit a lead form.
 *
 * The lead is persisted first; notification/confirmation emails are then sent
 * best-effort and can never fail the submission (a saved lead is the source of
 * truth — email is a side channel, and new leads are also surfaced in-app via
 * the admin notifications bell).
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
      source: leadData.source,
    })
    .select(`
      *,
      packages (
        title
      )
    `)
    .single();

  if (error) throw error;

  // Best-effort: notify the sales inbox and confirm to the customer. Never throws.
  await sendLeadEmails(data as unknown as InsertedLead);

  return data;
}

/**
 * Send the new-lead notification (to the sales inbox) and the confirmation
 * (to the customer). Both are wrapped so a mail failure only logs — the lead
 * has already been saved. If Mailgun isn't configured, `sendEmail` no-ops.
 */
async function sendLeadEmails(lead: InsertedLead): Promise<void> {
  try {
    const packageTitle = lead.packages?.title ?? null;
    const shared = {
      name: lead.name,
      packageTitle,
      travelStartDate: lead.travel_start_date,
      travelEndDate: lead.travel_end_date,
      numberOfAdults: lead.number_of_adults,
      numberOfChildren: lead.number_of_children,
      numberOfInfants: lead.number_of_infants,
      message: lead.message,
    };

    const tasks: Promise<{ success: boolean; error?: unknown }>[] = [];

    // 1) Confirmation to the customer.
    if (lead.email) {
      const mail = leadReceivedEmail(shared);
      tasks.push(sendEmail({ to: lead.email, subject: mail.subject, html: mail.html, text: mail.text }));
    }

    // 2) Notification to the sales/admin inbox.
    const recipient = process.env.LEAD_NOTIFICATION_EMAIL || process.env.MAILGUN_FROM_EMAIL;
    if (recipient) {
      const mail = leadNotificationEmail({
        ...shared,
        email: lead.email,
        phone: lead.phone,
        leadId: lead.id,
      });
      tasks.push(sendEmail({ to: recipient, subject: mail.subject, html: mail.html, text: mail.text }));
    } else {
      console.warn('[createLead] No LEAD_NOTIFICATION_EMAIL / MAILGUN_FROM_EMAIL set — skipping sales notification.');
    }

    const results = await Promise.allSettled(tasks);
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('[createLead] Lead email threw:', result.reason);
      } else if (!result.value.success) {
        console.error('[createLead] Lead email not sent:', result.value.error);
      }
    }
  } catch (err) {
    // Absolutely never let email breakage surface to the customer.
    console.error('[createLead] sendLeadEmails failed:', err);
  }
}
