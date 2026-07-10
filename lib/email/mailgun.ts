/**
 * Mailgun Email Service
 *
 * Setup Instructions:
 * 1. Sign up at https://www.mailgun.com/
 * 2. Verify your domain
 * 3. Get your API key from Settings → API Keys
 * 4. Add to .env.local:
 *    MAILGUN_API_KEY=your-api-key
 *    MAILGUN_DOMAIN=your-domain.com
 *    MAILGUN_FROM_EMAIL=noreply@your-domain.com
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL || `Travel Carvers <noreply@${domain}>`;

  if (!apiKey || !domain) {
    console.error('Mailgun not configured. Add MAILGUN_API_KEY and MAILGUN_DOMAIN to .env.local');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', html);
    if (text) formData.append('text', text);

    const response = await fetch(
      `https://api.mailgun.net/v3/${domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Mailgun error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// Email Templates
export const emailTemplates = {
  leadNotification: (lead: {
    name: string;
    email: string;
    phone: string;
    packageTitle: string;
    message?: string;
  }) => ({
    subject: `New Lead: ${lead.name} interested in ${lead.packageTitle}`,
    html: `
      <h2>New Lead Submission</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Package:</strong> ${lead.packageTitle}</p>
      ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">
        Respond to this lead as soon as possible for best conversion rates.
      </p>
    `,
    text: `
New Lead Submission

Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Package: ${lead.packageTitle}
${lead.message ? `Message: ${lead.message}` : ''}
    `,
  }),

  leadConfirmation: (name: string, packageTitle: string) => ({
    subject: `Thank you for your interest in ${packageTitle}`,
    html: `
      <h2>Thank You for Contacting Travel Carvers!</h2>
      <p>Dear ${name},</p>
      <p>We've received your inquiry about <strong>${packageTitle}</strong>.</p>
      <p>Our team will get back to you within 24 hours with more details and to discuss your travel plans.</p>
      <br>
      <p>Best regards,<br>Travel Carvers Team</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated confirmation. Please do not reply to this email.
      </p>
    `,
    text: `
Thank You for Contacting Travel Carvers!

Dear ${name},

We've received your inquiry about ${packageTitle}.

Our team will get back to you within 24 hours with more details and to discuss your travel plans.

Best regards,
Travel Carvers Team
    `,
  }),
};
