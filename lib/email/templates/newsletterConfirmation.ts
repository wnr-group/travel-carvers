/**
 * Newsletter subscription confirmation (sent to the subscriber).
 */

import {
  BRAND,
  COMPANY,
  button,
  escapeHtml,
  h1,
  paragraph,
  renderLayout,
  type EmailContent,
} from './layout';

export interface NewsletterConfirmationData {
  email?: string | null;
  unsubscribeUrl?: string | null;
}

function resolveUnsubscribeUrl({ email, unsubscribeUrl }: NewsletterConfirmationData): string {
  if (unsubscribeUrl?.trim()) return unsubscribeUrl.trim();
  const query = email?.trim() ? `?email=${encodeURIComponent(email.trim())}` : '';
  return `${COMPANY.url}/unsubscribe${query}`;
}

export function newsletterConfirmationEmail(data: NewsletterConfirmationData = {}): EmailContent {
  const packagesUrl = `${COMPANY.url}/packages`;
  const unsubscribeUrl = resolveUnsubscribeUrl(data);

  const content = `
    ${h1('Welcome aboard! 🌏')}
    ${paragraph('Thank you for subscribing to <strong>Travel Carvers</strong>. You are now on the list for handpicked destinations, seasonal offers, and travel inspiration delivered straight to your inbox.')}
    ${paragraph('Ready to start dreaming about your next trip? Explore our curated packages across India and around the world.')}
    ${button(packagesUrl, 'Explore Packages')}
    ${paragraph(`In the meantime, reach us any time at <a href="mailto:${COMPANY.email}" style="color:${BRAND.forest};text-decoration:none;">${escapeHtml(COMPANY.email)}</a>. Happy travels!`)}
  `;

  const html = renderLayout({
    title: 'Welcome to Travel Carvers',
    preheader: 'Thanks for subscribing — here is where the journey begins.',
    contentHtml: content,
    unsubscribeUrl,
  });

  const text = [
    'Welcome aboard!',
    '',
    'Thank you for subscribing to Travel Carvers. You are now on the list for handpicked destinations, seasonal offers, and travel inspiration.',
    '',
    `Explore our packages: ${packagesUrl}`,
    '',
    `Questions? Email us at ${COMPANY.email}.`,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
    `© ${new Date().getFullYear()} ${COMPANY.name}. All Rights Reserved.`,
  ].join('\n');

  return {
    subject: 'Welcome to Travel Carvers — you’re subscribed! 🌏',
    html,
    text,
  };
}
