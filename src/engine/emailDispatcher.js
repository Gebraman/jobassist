/**
 * Candidate License Email Dispatcher
 * Sends formatted email confirmations with generated license keys upon admin approval
 * Supports direct SMTP (Gmail, Brevo, SendGrid, custom SMTP) and 1-click fallback dispatch
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMAILS_LOG_PATH = path.join(__dirname, '..', 'data', 'outbound_emails.json');

function loadOutboundEmails() {
  try {
    if (fs.existsSync(EMAILS_LOG_PATH)) {
      return JSON.parse(fs.readFileSync(EMAILS_LOG_PATH, 'utf8'));
    }
  } catch(e) {}
  return [];
}

function saveOutboundEmails(emails) {
  try {
    fs.writeFileSync(EMAILS_LOG_PATH, JSON.stringify(emails.slice(0, 150), null, 2), 'utf8');
  } catch(e) {}
}

/**
 * Configure Nodemailer transport if SMTP credentials are provided
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : null);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (host && user && pass) {
    try {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
    } catch(err) {
      console.warn('[EMAIL DISPATCHER] Failed to initialize SMTP transporter:', err.message);
    }
  }
  return null;
}

export async function dispatchLicenseKeyEmail({ license, payment = {} }) {
  const recipientName = license.candidateName || (payment && payment.candidateName) || 'Candidate';
  const recipientEmail = (license.email || (payment && payment.email) || '').trim();
  const planName = license.planName || 'JobAssist Studio Pass';
  const days = license.grantedDays || 1;
  const key = license.key;
  const expiryDate = license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'N/A';
  const amount = (payment && payment.amount) ? payment.amount : (license.planId === 'daily' ? '100 ETB / $1.99' : 'Paid');
  const gateway = (payment && payment.paymentMethod) ? payment.paymentMethod.toUpperCase() : 'VERIFIED';
  const baseUrl = process.env.SERVER_PUBLIC_URL || 'https://jobassist-mu47.onrender.com';

  const subject = `Your JobAssist Studio License Key: ${key} (Activated)`;

  const bodyText = `Hi ${recipientName},\n\n` +
    `Congratulations! Your payment of ${amount} via ${gateway} has been successfully verified and approved by the JobAssist Administrator.\n\n` +
    `Your JobAssist Studio access key is now active:\n` +
    `====================================================\n` +
    `LICENSE KEY: ${key}\n` +
    `ACCESS PASS: ${planName}\n` +
    `DURATION:    ${days} Days (Valid until ${expiryDate})\n` +
    `====================================================\n\n` +
    `HOW TO UNLOCK YOUR CHROME EXTENSION:\n` +
    `1. Download and unpack the extension from: ${baseUrl}/download-extension\n` +
    `2. Open the JobAssist Studio sidepanel in Google Chrome.\n` +
    `3. Paste your License Key: "${key}" into the unlock box and click "Unlock".\n` +
    `4. You're ready to auto-fill applications, hunt fresh jobs (<= 5d), and generate Canva-grade resumes!\n\n` +
    `Warm regards,\n` +
    `JobAssist Executive Team\n` +
    `Support: Telegram @JobAssistSupport | support@jobassist.ai\n`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0B1120; color: #F8FAFC; border-radius: 14px; overflow: hidden; border: 1px solid #1E293B;">
      <div style="background: linear-gradient(135deg, #007aff, #38bdf8); padding: 26px 20px; text-align: center;">
        <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">JobAssist AI Studio</h1>
        <p style="color: rgba(255,255,255,0.95); font-size: 13px; font-weight: 500; margin: 0;">Access License Key Activated</p>
      </div>
      <div style="padding: 28px 24px; background: #0F172A;">
        <p style="font-size: 14px; color: #E2E8F0; margin: 0 0 12px 0;">Hi <strong>${recipientName}</strong>,</p>
        <p style="font-size: 13.5px; color: #94A3B8; line-height: 1.6; margin: 0 0 20px 0;">
          Congratulations! Your payment of <strong>${amount}</strong> via <strong>${gateway}</strong> has been successfully verified and approved by the JobAssist Administrator.
        </p>

        <div style="background: #1E293B; border: 1.5px solid #0284C7; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
          <div style="font-size: 11px; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 700;">Your Dedicated License Key</div>
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 24px; font-weight: 800; color: #38BDF8; letter-spacing: 2px; margin: 6px 0;">${key}</div>
          <div style="font-size: 12px; color: #34D399; font-weight: 600; margin-top: 6px;">${planName} • Active for ${days} Days (Expires ${expiryDate})</div>
        </div>

        <h3 style="font-size: 13.5px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px 0;">Quick Activation Guide:</h3>
        <ol style="font-size: 13px; color: #CBD5E1; padding-left: 20px; line-height: 1.7; margin: 0 0 24px 0;">
          <li><a href="${baseUrl}/download-extension" style="color: #38BDF8; font-weight: 700; text-decoration: none;">Download the Chrome Extension (.ZIP)</a></li>
          <li>Open <code>chrome://extensions</code> in Chrome, enable <strong>Developer mode</strong>, and load unpacked folder.</li>
          <li>Open the JobAssist Studio sidepanel and paste your License Key: <code>${key}</code></li>
          <li>You now have unlimited 1-Click ATS AutoFill on Workday, Greenhouse, Lever, Ashby, and JazzHR!</li>
        </ol>

        <div style="text-align: center; padding-top: 10px; border-top: 1px solid #1E293B; font-size: 12px; color: #64748B;">
          Need assistance? Telegram: <a href="https://t.me/JobAssistSupport" style="color: #38BDF8; text-decoration: none;">@JobAssistSupport</a> • Support: <a href="mailto:support@jobassist.ai" style="color: #38BDF8; text-decoration: none;">support@jobassist.ai</a>
        </div>
      </div>
    </div>
  `;

  const mailtoLink = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  let smtpSent = false;
  let smtpError = null;

  // Try direct SMTP transmission if credentials configured
  const transporter = getSmtpTransporter();
  if (transporter && recipientEmail) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.GMAIL_USER || '"JobAssist Executive Team" <licenses@jobassist.ai>',
        to: recipientEmail,
        subject,
        text: bodyText,
        html: htmlContent
      });
      smtpSent = true;
      console.log(`[EMAIL DISPATCHER] ✓ Live SMTP email sent to ${recipientEmail} (msgId: ${info.messageId})`);
    } catch(err) {
      smtpError = err.message;
      console.warn(`[EMAIL DISPATCHER] Live SMTP send failed (${err.message}). Prepared 1-click fallback.`);
    }
  }

  const emailRecord = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    to: recipientEmail,
    candidateName: recipientName,
    subject,
    licenseKey: key,
    planName,
    grantedDays: days,
    status: smtpSent ? 'DELIVERED_VIA_SMTP' : 'DELIVERED_READY_TO_SEND',
    smtpSent,
    smtpError,
    dispatchedAt: new Date().toISOString(),
    mailtoLink,
    gmailComposeUrl,
    bodyText
  };

  const logs = loadOutboundEmails();
  logs.unshift(emailRecord);
  saveOutboundEmails(logs);

  console.log(`[EMAIL DISPATCHER] ✓ Dispatched license email for ${recipientEmail}: key=${key}, plan=${planName}, smtp=${smtpSent}`);

  return emailRecord;
}

export function getOutboundEmails() {
  return loadOutboundEmails();
}
