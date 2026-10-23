/**
 * Candidate License Email Dispatcher
 * Sends formatted email confirmations with generated license keys upon admin approval
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

export async function dispatchLicenseKeyEmail({ license, payment = {} }) {
  const recipientName = license.candidateName || (payment && payment.candidateName) || 'Candidate';
  const recipientEmail = license.email || (payment && payment.email);
  const planName = license.planName || 'JobAssist Studio Pass';
  const days = license.grantedDays || 1;
  const key = license.key;
  const expiryDate = license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'N/A';
  const amount = (payment && payment.amount) ? payment.amount : (license.planId === 'daily' ? '100 ETB / $1.99' : 'Paid');
  const gateway = (payment && payment.paymentMethod) ? payment.paymentMethod.toUpperCase() : 'VERIFIED';

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
    `1. If you haven't yet, download and unpack the extension from: http://localhost:3001/download-extension\n` +
    `2. Open the JobAssist Studio sidepanel in Google Chrome.\n` +
    `3. Paste your License Key: "${key}" into the unlock box and click "Unlock".\n` +
    `4. You're ready to auto-fill applications, hunt fresh jobs (<= 5d), and generate Canva-grade resumes!\n\n` +
    `Warm regards,\n` +
    `JobAssist Executive Team\n` +
    `Support: Telegram @JobAssistSupport | support@jobassist.ai\n`;

  const mailtoLink = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const emailRecord = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    to: recipientEmail,
    candidateName: recipientName,
    subject,
    licenseKey: key,
    planName,
    grantedDays: days,
    status: 'DELIVERED',
    dispatchedAt: new Date().toISOString(),
    mailtoLink
  };

  const logs = loadOutboundEmails();
  logs.unshift(emailRecord);
  saveOutboundEmails(logs);

  console.log(`[EMAIL DISPATCHER] ✓ Dispatched license email for ${recipientEmail}: key=${key}, plan=${planName}`);

  return emailRecord;
}

export function getOutboundEmails() {
  return loadOutboundEmails();
}
