// JobAssist AI Studio - Telegram & Webhook Notification Dispatcher
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTIFICATIONS_PATH = path.join(__dirname, '..', 'data', 'notifications.json');

function loadNotifications() {
  try {
    if (fs.existsSync(NOTIFICATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_PATH, 'utf8'));
    }
  } catch(e) {}
  return [];
}

function saveNotifications(notifs) {
  try {
    fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify(notifs.slice(0, 100), null, 2), 'utf8');
  } catch(e) {}
}

export async function notifyNewPayment(payment, verificationResult) {
  const notif = {
    id: `notif_${Date.now()}`,
    type: 'NEW_PAYMENT',
    title: `Payment Received: ${payment.amount} (${payment.paymentMethod.toUpperCase()})`,
    message: `${payment.candidateName} (${payment.email}) submitted proof for ${payment.planName}. Ref: ${payment.reference}`,
    timestamp: new Date().toISOString(),
    status: 'unread',
    data: {
      paymentId: payment.id,
      email: payment.email,
      amount: payment.amount,
      plan: payment.planName,
      reference: payment.reference,
      confidence: verificationResult.confidence,
      fraudRisk: verificationResult.fraudRisk
    }
  };

  const list = loadNotifications();
  list.unshift(notif);
  saveNotifications(list);

  // If Telegram Bot configured, send live message
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const baseUrl = process.env.SERVER_PUBLIC_URL || 'https://jobassist-mu47.onrender.com';
      const text = `*JobAssist Alert: New Payment Submitted*\n\n` +
        `*Candidate:* ${payment.candidateName}\n` +
        `*Email:* \`${payment.email}\`\n` +
        `*Plan:* ${payment.planName}\n` +
        `*Amount:* *${payment.amount}*\n` +
        `*Gateway:* ${payment.paymentMethod.toUpperCase()}\n` +
        `*Reference:* \`${payment.reference}\`\n` +
        `*Fraud Risk:* ${verificationResult.fraudRisk} (${verificationResult.confidence}% confidence)\n\n` +
        `[Review in Admin Portal](${baseUrl}/admin)`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown'
        })
      });
    } catch(err) {
      console.warn('Telegram dispatch notice:', err.message);
    }
  }

  return notif;
}

export async function notifyLicenseApproved(license) {
  const notif = {
    id: `notif_${Date.now()}`,
    type: 'LICENSE_ISSUED',
    title: `License Issued: ${license.key}`,
    message: `Granted ${license.grantedDays} days of ${license.planName} to ${license.candidateName} (${license.email}).`,
    timestamp: new Date().toISOString(),
    status: 'unread',
    data: {
      key: license.key,
      email: license.email,
      plan: license.planName,
      expiresAt: license.expiresAt
    }
  };

  const list = loadNotifications();
  list.unshift(notif);
  saveNotifications(list);

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const text = `*JobAssist: License Key Activated*\n\n` +
        `*Candidate:* ${license.candidateName}\n` +
        `*Key:* \`${license.key}\`\n` +
        `*Plan:* ${license.planName}\n` +
        `*Duration:* ${license.grantedDays} Days\n` +
        `*Expires:* ${new Date(license.expiresAt).toLocaleDateString()}\n\n` +
        `User is now authorized to run unlimited ATS AutoFill!`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown'
        })
      });
    } catch(e) {}
  }

  return notif;
}

export function getNotifications() {
  return loadNotifications();
}
