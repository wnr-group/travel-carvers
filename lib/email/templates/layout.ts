import { SITE, absoluteUrl } from '@/lib/seo';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Brand palette
 */
export const BRAND = {
  forestDark: '#1B4D1B',
  forest: '#2D5F2D',
  sage: '#5F7A5F',
  sageMedium: '#6B8E6B',
  sageSoft: '#9DB89D',
  mint: '#B8D4B8',
  pastel: '#C8E6C8',
  pageBg: '#F4F1EA',
  cardBg: '#FFFFFF',
  heading: '#1B4D1B',
  bodyText: '#374151',
  mutedText: '#6B7280',
  border: '#E5E7EB',
  rowAlt: '#FAFAF7',
  white: '#FFFFFF',
} as const;

/**
 * Company details
 */
export const COMPANY = {
  name: SITE.name,
  tagline: 'Crafting unforgettable journeys across India and the world.',
  url: SITE.url,
  logoUrl: absoluteUrl('/logo.png'),
  email: 'info@travelcarvers.com',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  address: 'MG Road, Bengaluru, Karnataka 560001, India',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  social: [
    { label: 'Facebook', url: 'https://facebook.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'YouTube', url: 'https://youtube.com' },
  ],
} as const;

const FONT_STACK = 'Arial, Helvetica, sans-serif';

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

export function orFallback(value: string | null | undefined, fallback = 'Not provided'): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function formatEmailDate(value: string | null | undefined, fallback = 'To be decided'): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return trimmed;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTravelDates(start?: string | null, end?: string | null): string {
  const startLabel = start?.trim() ? formatEmailDate(start) : '';
  const endLabel = end?.trim() ? formatEmailDate(end) : '';
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || 'Flexible / To be decided';
}

export function formatTravelers(
  adults?: number | null,
  children?: number | null,
  infants?: number | null,
): string {
  const parts: string[] = [];
  const add = (count: number | null | undefined, singular: string, plural: string) => {
    if (typeof count === 'number' && count > 0) {
      parts.push(`${count} ${count === 1 ? singular : plural}`);
    }
  };
  add(adults, 'Adult', 'Adults');
  add(children, 'Child', 'Children');
  add(infants, 'Infant', 'Infants');
  return parts.length ? parts.join(', ') : 'Not specified';
}

/* ----------------------------- Content blocks ------------------------------ */

/** Main body heading. */
export function h1(text: string): string {
  return `<h1 style="margin:0 0 18px;font-family:${FONT_STACK};font-size:24px;line-height:1.3;font-weight:bold;color:${BRAND.forestDark};">${escapeHtml(text)}</h1>`;
}

/**
 * Body paragraph. `html` is trusted markup (may contain <strong>/<br>); callers
 * are responsible for escaping any user data they interpolate into it.
 */
export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:${BRAND.bodyText};">${html}</p>`;
}

/** Pill-shaped status badge (e.g. the "New Enquiry" highlight). */
export function statusBadge(label: string, bg: string = BRAND.forest, color: string = BRAND.white): string {
  return `<span style="display:inline-block;padding:6px 14px;background-color:${bg};color:${color};font-family:${FONT_STACK};font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-radius:999px;">${escapeHtml(label)}</span>`;
}

/** Bulletproof, table-based CTA button that survives Outlook. */
export function button(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
      <tr>
        <td align="center" bgcolor="${BRAND.forest}" style="border-radius:8px;">
          <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:${FONT_STACK};font-size:15px;font-weight:bold;line-height:1;color:${BRAND.white};text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`;
}

export interface DetailRow {
  label: string;
  value: string;
  isHtml?: boolean;
}

/** Clean two-column key/value table with zebra striping. */
export function detailTable(rows: DetailRow[]): string {
  const body = rows
    .map((row, index) => {
      const bg = index % 2 === 0 ? BRAND.white : BRAND.rowAlt;
      const value = row.isHtml ? row.value : escapeHtml(row.value);
      return `
        <tr>
          <td style="padding:12px 16px;background-color:${bg};border-bottom:1px solid ${BRAND.border};font-family:${FONT_STACK};font-size:13px;font-weight:bold;color:${BRAND.forestDark};width:38%;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:12px 16px;background-color:${bg};border-bottom:1px solid ${BRAND.border};font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:${BRAND.bodyText};vertical-align:top;">${value}</td>
        </tr>`;
    })
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
      ${body}
    </table>`;
}

/* --------------------------------- Shell ----------------------------------- */

function header(): string {
  return `
    <tr>
      <td align="center" bgcolor="${BRAND.forestDark}" style="padding:26px 24px;">
        <img src="${COMPANY.logoUrl}" alt="${escapeHtml(COMPANY.name)}" width="44" height="44" style="display:inline-block;vertical-align:middle;border:0;height:44px;width:auto;" />
        <span style="display:inline-block;vertical-align:middle;margin-left:12px;font-family:${FONT_STACK};font-size:22px;font-weight:bold;color:${BRAND.white};letter-spacing:0.3px;">${escapeHtml(COMPANY.name)}</span>
      </td>
    </tr>`;
}

function footer(unsubscribeUrl?: string): string {
  const year = new Date().getFullYear();

  const social = COMPANY.social
    .map(
      (item) =>
        `<a href="${item.url}" target="_blank" style="color:${BRAND.forest};text-decoration:none;font-weight:bold;">${escapeHtml(item.label)}</a>`,
    )
    .join(`<span style="color:${BRAND.mutedText};">&nbsp;&bull;&nbsp;</span>`);

  const unsubscribe = unsubscribeUrl
    ? `<p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:${BRAND.mutedText};">
         You are receiving this because you subscribed to Travel Carvers updates.
         <a href="${escapeHtml(unsubscribeUrl)}" target="_blank" style="color:${BRAND.forest};text-decoration:underline;">Unsubscribe</a>.
       </p>`
    : '';

  return `
    <tr>
      <td style="padding:28px 32px;background-color:${BRAND.pageBg};border-top:1px solid ${BRAND.border};">
        <p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:14px;font-weight:bold;color:${BRAND.forestDark};">${escapeHtml(COMPANY.name)}</p>
        <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${BRAND.mutedText};">
          ${escapeHtml(COMPANY.address)}<br />
          <a href="${COMPANY.phoneHref}" style="color:${BRAND.forest};text-decoration:none;">${escapeHtml(COMPANY.phone)}</a>
          <span style="color:${BRAND.mutedText};">&nbsp;&bull;&nbsp;</span>
          <a href="mailto:${COMPANY.email}" style="color:${BRAND.forest};text-decoration:none;">${escapeHtml(COMPANY.email)}</a>
        </p>
        <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:13px;color:${BRAND.bodyText};">${social}</p>
        ${unsubscribe}
        <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${BRAND.mutedText};">
          &copy; ${year} ${escapeHtml(COMPANY.name)}. All Rights Reserved.
        </p>
      </td>
    </tr>`;
}

export interface LayoutOptions {
  title: string;
  preheader?: string;
  contentHtml: string;
  unsubscribeUrl?: string;
}

/** Wrap composed body content in the branded, responsive email shell. */
export function renderLayout({ title, preheader, contentHtml, unsubscribeUrl }: LayoutOptions): string {
  const preview = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BRAND.pageBg};">${escapeHtml(preheader)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.pageBg};">
  ${preview}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.pageBg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${BRAND.cardBg};border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(27,77,27,0.08);">
          ${header()}
          <tr>
            <td style="padding:32px;">
              ${contentHtml}
            </td>
          </tr>
          ${footer(unsubscribeUrl)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
