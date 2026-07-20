/**
 * New-lead notification (sent to the Travel Carvers admin/sales inbox).
 */

import {
  COMPANY,
  button,
  detailTable,
  formatTravelDates,
  formatTravelers,
  h1,
  multiline,
  orFallback,
  paragraph,
  renderLayout,
  statusBadge,
  type DetailRow,
  type EmailContent,
} from './layout';

export interface LeadNotificationData {
  name: string;
  email: string;
  phone: string;
  packageTitle?: string | null;
  destination?: string | null;
  travelStartDate?: string | null;
  travelEndDate?: string | null;
  numberOfAdults?: number | null;
  numberOfChildren?: number | null;
  numberOfInfants?: number | null;
  message?: string | null;
  leadId?: string | null;
}

function adminLeadUrl(leadId?: string | null): string {
  const base = `${COMPANY.url}/admin/leads`;
  return leadId?.trim() ? `${base}?lead=${encodeURIComponent(leadId.trim())}` : base;
}

export function leadNotificationEmail(data: LeadNotificationData): EmailContent {
  const rows: DetailRow[] = [
    { label: 'Name', value: orFallback(data.name, 'Unknown') },
    { label: 'Email', value: orFallback(data.email) },
    { label: 'Phone', value: orFallback(data.phone) },
    { label: 'Package', value: orFallback(data.packageTitle, 'General enquiry') },
    { label: 'Destination', value: orFallback(data.destination, 'Not specified') },
    {
      label: 'Travel Date',
      value: formatTravelDates(data.travelStartDate, data.travelEndDate),
    },
    {
      label: 'Travelers',
      value: formatTravelers(data.numberOfAdults, data.numberOfChildren, data.numberOfInfants),
    },
    {
      label: 'Message',
      value: data.message?.trim() ? multiline(data.message) : '—',
      isHtml: true,
    },
  ];

  const content = `
    <div style="margin:0 0 18px;">${statusBadge('New Enquiry')}</div>
    ${h1('New enquiry received')}
    ${paragraph('A customer just submitted an enquiry through the website. Details are below — respond promptly for the best conversion.')}
    ${detailTable(rows)}
    <div style="height:24px;"></div>
    ${button(adminLeadUrl(data.leadId), 'View Lead in Dashboard')}
  `;

  const html = renderLayout({
    title: 'New enquiry received',
    preheader: `New enquiry from ${orFallback(data.name, 'a customer')} — ${orFallback(
      data.packageTitle,
      'general enquiry',
    )}`,
    contentHtml: content,
  });

  const text = [
    'NEW ENQUIRY RECEIVED',
    '',
    `Name: ${orFallback(data.name, 'Unknown')}`,
    `Email: ${orFallback(data.email)}`,
    `Phone: ${orFallback(data.phone)}`,
    `Package: ${orFallback(data.packageTitle, 'General enquiry')}`,
    `Destination: ${orFallback(data.destination, 'Not specified')}`,
    `Travel Date: ${formatTravelDates(data.travelStartDate, data.travelEndDate)}`,
    `Travelers: ${formatTravelers(data.numberOfAdults, data.numberOfChildren, data.numberOfInfants)}`,
    `Message: ${orFallback(data.message, '—')}`,
    '',
    `View in dashboard: ${adminLeadUrl(data.leadId)}`,
    '',
    `© ${new Date().getFullYear()} ${COMPANY.name}`,
  ].join('\n');

  // Highlight the customer in the subject so the sales team can triage at a glance.
  const subject = `New Lead: ${orFallback(data.name, 'Customer')}${
    data.packageTitle?.trim() ? ` — ${data.packageTitle.trim()}` : ''
  }`;

  return { subject, html, text };
}
