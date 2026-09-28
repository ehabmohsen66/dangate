export interface EmailNotificationPayload {
  reference: string;
  name: string;
  company?: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  country: string;
  service: string;
  challenge: string;
  createdAt: number;
}

export const RECIPIENT_EMAILS = ['info@digitology.co', 'ehabmohsen66@gmail.com'];

export async function sendConsultationNotification(data: EmailNotificationPayload): Promise<{ success: boolean; provider?: string; error?: string }> {
  const dateFormatted = new Date(data.createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Dubai',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `[Dan Gate] New Consultation Request: ${data.name} (${data.company || data.country})`;

  const textContent = `
New Consultation Request Received
==================================

Reference: ${data.reference}
Submitted: ${dateFormatted} (Dubai Time)

Client Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Company: ${data.company || 'Not provided'}
- Job Title: ${data.jobTitle || 'Not provided'}
- Country: ${data.country}

Requested Service:
${data.service}

Challenge & Objectives:
----------------------------------
${data.challenge}
----------------------------------

Dan Gate Consultancy
Dubai, United Arab Emirates
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e1d24; background-color: #f7f9fa; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e6eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #034da9; color: #ffffff; padding: 24px 30px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #cbe0f8; }
    .body { padding: 30px; }
    .badge { display: inline-block; background: #eaf2fc; color: #034da9; font-weight: 600; font-size: 13px; padding: 4px 10px; border-radius: 4px; margin-bottom: 20px; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .grid td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f0f2f5; vertical-align: top; }
    .grid td.label { width: 130px; color: #697386; font-weight: 600; }
    .grid td.val { color: #1e1d24; font-weight: 500; }
    .challenge-box { background: #f8fafc; border-left: 4px solid #034da9; padding: 16px 20px; border-radius: 0 4px 4px 0; margin-top: 10px; font-size: 15px; color: #2d3748; white-space: pre-wrap; line-height: 1.6; }
    .footer { background: #f8fafc; padding: 16px 30px; font-size: 12px; color: #8792a2; border-top: 1px solid #e1e6eb; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Consultation Request</h1>
      <p>Dan Gate Consultancy &bull; Dubai, UAE</p>
    </div>
    <div class="body">
      <div class="badge">Reference: ${data.reference}</div>
      <table class="grid">
        <tr><td class="label">Client Name</td><td class="val"><strong>${data.name}</strong></td></tr>
        <tr><td class="label">Business Email</td><td class="val"><a href="mailto:${data.email}" style="color:#034da9;text-decoration:none;">${data.email}</a></td></tr>
        <tr><td class="label">Phone / WhatsApp</td><td class="val">${data.phone ? `<a href="tel:${data.phone}" style="color:#034da9;text-decoration:none;">${data.phone}</a>` : '<span style="color:#a0aec0;">Not provided</span>'}</td></tr>
        <tr><td class="label">Company</td><td class="val">${data.company || '<span style="color:#a0aec0;">Not provided</span>'}</td></tr>
        <tr><td class="label">Job Title</td><td class="val">${data.jobTitle || '<span style="color:#a0aec0;">Not provided</span>'}</td></tr>
        <tr><td class="label">Country</td><td class="val">${data.country}</td></tr>
        <tr><td class="label">Interest Area</td><td class="val"><strong style="color:#034da9;">${data.service}</strong></td></tr>
      </table>

      <div style="font-size:13px; font-weight:700; color:#697386; letter-spacing:0.05em; text-transform:uppercase; margin-top:16px;">Client Challenge &amp; Objectives:</div>
      <div class="challenge-box">${data.challenge}</div>
    </div>
    <div class="footer">
      Sent automatically from Dan Gate website consultation engine.<br>
      Timestamp: ${dateFormatted}
    </div>
  </div>
</body>
</html>
`.trim();

  // Method 1: Resend HTTP API (if RESEND_API_KEY is configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'Dan Gate <enquiries@dangate.com>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: RECIPIENT_EMAILS,
          reply_to: data.email,
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        console.log('[EmailService] Successfully dispatched notification via Resend.');
        return { success: true, provider: 'resend' };
      }
      const errBody = await res.text();
      console.warn('[EmailService] Resend returned non-200:', res.status, errBody);
    } catch (e) {
      console.error('[EmailService] Resend request error:', e);
    }
  }

  // Method 2: SendGrid HTTP API (if SENDGRID_API_KEY is configured)
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (sendgridApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'consultation@dangate.com';
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: RECIPIENT_EMAILS.map((email) => ({ email })),
            },
          ],
          from: { email: fromEmail, name: 'Dan Gate Consultancy' },
          reply_to: { email: data.email, name: data.name },
          subject,
          content: [
            { type: 'text/plain', value: textContent },
            { type: 'text/html', value: htmlContent },
          ],
        }),
      });

      if (res.ok || res.status === 202) {
        console.log('[EmailService] Successfully dispatched notification via SendGrid.');
        return { success: true, provider: 'sendgrid' };
      }
      const errBody = await res.text();
      console.warn('[EmailService] SendGrid returned non-200:', res.status, errBody);
    } catch (e) {
      console.error('[EmailService] SendGrid request error:', e);
    }
  }

  // Method 3: Generic Webhook / Formspree / Email Relay (if NOTIFICATION_WEBHOOK_URL is configured)
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: RECIPIENT_EMAILS,
          subject,
          ...data,
          dateFormatted,
        }),
      });
      if (res.ok) {
        console.log('[EmailService] Successfully dispatched notification via Webhook.');
        return { success: true, provider: 'webhook' };
      }
    } catch (e) {
      console.error('[EmailService] Webhook notification error:', e);
    }
  }

  // Fallback / Development Log
  console.log('----------------------------------------------------');
  console.log(`[EmailService] Consultation Notification Prepared for: ${RECIPIENT_EMAILS.join(', ')}`);
  console.log(`Subject: ${subject}`);
  console.log(`Reference: ${data.reference}`);
  console.log(`Client: ${data.name} <${data.email}> | Phone: ${data.phone || 'N/A'}`);
  console.log(`Service: ${data.service}`);
  console.log('----------------------------------------------------');
  console.log('(To send real external emails, set RESEND_API_KEY, SENDGRID_API_KEY, or NOTIFICATION_WEBHOOK_URL in your environment / Vercel dashboard)');

  return { success: true, provider: 'mock' };
}
