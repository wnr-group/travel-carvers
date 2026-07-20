/**
 * Enquiry acknowledgement (sent to the customer who submitted the lead).
 */

import {
  BRAND,
  COMPANY,
  button,
  detailTable,
  escapeHtml,
  formatTravelDates,
  formatTravelers,
  h1,
  multiline,
  orFallback,
  paragraph,
  renderLayout,
  type DetailRow,
  type EmailContent,
} from './layout';

export interface LeadReceivedData {
  name: string;
  packageTitle?: string | null;
  destination?: string | null;
  travelStartDate?: string | null;
  travelEndDate?: string | null;
  numberOfAdults?: number | null;
  numberOfChildren?: number | null;
  numberOfInfants?: number | null;
  message?: string | null;
}

/** Only include summary rows the customer actually provided, to avoid noise. */
function summaryRows(data: LeadReceivedData): DetailRow[] {
  const rows: DetailRow[] = [];

  if (data.packageTitle?.trim()) rows.push({ label: 'Package', value: data.packageTitle.trim() });
  if (data.destination?.trim()) rows.push({ label: 'Destination', value: data.destination.trim() });

  if (data.travelStartDate?.trim() || data.travelEndDate?.trim()) {
    rows.push({ label: 'Travel Date', value: formatTravelDates(data.travelStartDate, data.travelEndDate) });
  }

  const travelers = formatTravelers(data.numberOfAdults, data.numberOfChildren, data.numberOfInfants);
  if (travelers !== 'Not specified') rows.push({ label: 'Travelers', value: travelers });

  if (data.message?.trim()) rows.push({ label: 'Your Message', value: multiline(data.message), isHtml: true });

  return rows;
}

export function leadReceivedEmail(data: LeadReceivedData): EmailContent {
  const packagesUrl = `${COMPANY.url}/packages`;
  const firstName = orFallback(data.name?.split(' ')[0], 'there');
  const rows = summaryRows(data);

  const summarySection = rows.length
    ? `${paragraph('<strong>Here is a summary of your enquiry:</strong>')}${detailTable(rows)}<div style="height:24px;"></div>`
    : '';

  const content = `
    ${h1(`Thank you, ${escapeHtml(firstName)}! ✈️`)}
    ${paragraph('We have received your enquiry and our travel team is already on it. Someone will reach out to you shortly to help plan your trip.')}
    ${summarySection}
    ${paragraph('While you wait, feel free to keep exploring more of our handpicked packages.')}
    ${button(packagesUrl, 'Browse More Packages')}
    ${paragraph(
      `Need to reach us sooner? Call <a href="${COMPANY.phoneHref}" style="color:${BRAND.forest};text-decoration:none;">${escapeHtml(
        COMPANY.phone,
      )}</a> or email <a href="mailto:${COMPANY.email}" style="color:${BRAND.forest};text-decoration:none;">${escapeHtml(
        COMPANY.email,
      )}</a> (${escapeHtml(COMPANY.workingHours)}).`,
    )}
    ${paragraph('Warm regards,<br />The Travel Carvers Team')}
  `;

  const html = renderLayout({
    title: 'We received your enquiry',
    preheader: 'Thanks for reaching out — our team will contact you shortly.',
    contentHtml: content,
  });

  const textRows = rows.map((row) => {
    // Strip the <br> markup we added for HTML so the plain-text stays clean.
    const value = row.isHtml ? row.value.replace(/<br\s*\/?>/g, ' ') : row.value;
    return `${row.label}: ${value}`;
  });

  const text = [
    `Thank you, ${firstName}!`,
    '',
    'We have received your enquiry and our travel team is already on it. Someone will reach out to you shortly.',
    ...(textRows.length ? ['', 'Your enquiry summary:', ...textRows] : []),
    '',
    `Browse more packages: ${packagesUrl}`,
    '',
    `Need us sooner? Call ${COMPANY.phone} or email ${COMPANY.email} (${COMPANY.workingHours}).`,
    '',
    'Warm regards,',
    'The Travel Carvers Team',
    `© ${new Date().getFullYear()} ${COMPANY.name}. All Rights Reserved.`,
  ].join('\n');

  return {
    subject: 'We’ve received your enquiry — Travel Carvers',
    html,
    text,
  };
}
