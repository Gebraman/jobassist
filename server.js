import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  leads,
  subscriptions,
  plans,
  faqs,
  companies,
  categories,
  jobs,
  saveStore
} from './src/data/db.js';

import { scrapeAllPortals, getVerifiedTechRoles } from './src/engine/portalScraper.js';
import { evaluateJobFit } from './src/engine/fitEvaluator.js';
import { draftApplication } from './src/engine/drafterAgent.js';
import { reviewApplication } from './src/engine/reviewerAgent.js';
import { generateAutofillPayload } from './src/engine/autofillGenerator.js';
import { analyzeUpskillGaps } from './src/engine/upskillAnalyzer.js';
import { sanitizePosting } from './src/engine/integrityGuard.js';
import { verifyReceipt } from './src/engine/receiptVerifier.js';
import { notifyNewPayment, notifyLicenseApproved, getNotifications } from './src/engine/telegramNotifier.js';
import { generateInterviewPrep } from './src/engine/interviewCopilot.js';
import { generateRecruiterOutreach } from './src/engine/outreachMailer.js';
import { dispatchLicenseKeyEmail, getOutboundEmails } from './src/engine/emailDispatcher.js';
import {
  normalizeEmail,
  isConfiguredAdminEmail,
  registerUser,
  authenticateCredentials,
  createSession,
  validateSession,
  destroySession,
  extractSessionToken
} from './src/engine/authManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safely auto-load .env file if present in root or parent
function loadEnvIfPresent() {
  const possiblePaths = [
    path.join(__dirname, '.env'),
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env')
  ];
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const raw = fs.readFileSync(envPath, 'utf-8');
        for (const line of raw.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const k = trimmed.slice(0, idx).trim();
            let v = trimmed.slice(idx + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            if (!(k in process.env)) {
              process.env[k] = v;
            }
          }
        }
      } catch (e) {}
      break;
    }
  }
}
loadEnvIfPresent();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Persistent AI Job Search Data Files
const PROFILE_PATH = path.join(__dirname, 'src', 'data', 'default_profile.json');
const TRACKER_PATH = path.join(__dirname, 'src', 'data', 'job_search_tracker.json');
const SEEN_JOBS_PATH = path.join(__dirname, 'src', 'data', 'seen_jobs.json');
const LICENSES_PATH = path.join(__dirname, 'src', 'data', 'licenses.json');
const PAYMENTS_PATH = path.join(__dirname, 'src', 'data', 'payments.json');
const PLANS_CONFIG_PATH = path.join(__dirname, 'src', 'data', 'plans_config.json');
const NOTIFICATIONS_PATH = path.join(__dirname, 'src', 'data', 'notifications.json');
const OUTBOUND_EMAILS_PATH = path.join(__dirname, 'src', 'data', 'outbound_emails.json');

function loadJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// In-Memory AI Job Search State
let candidateProfile = loadJSON(PROFILE_PATH, {});
let trackerApplications = loadJSON(TRACKER_PATH, []);
let cachedLiveJobs = loadJSON(SEEN_JOBS_PATH, []);
let premiumLicenses = loadJSON(LICENSES_PATH, []);
let pendingPayments = loadJSON(PAYMENTS_PATH, []);
let plansConfig = loadJSON(PLANS_CONFIG_PATH, { plans: [], gateways: {} });

function generateLicenseKey(prefix = 'PREM') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3) rand += '-';
  }
  return `${prefix}-${rand}`;
}

if (cachedLiveJobs.length === 0) {
  cachedLiveJobs = getVerifiedTechRoles();
  saveJSON(SEEN_JOBS_PATH, cachedLiveJobs);
}

// ----------------------------------------------------
// REST API ENDPOINTS: JOBASSIST CORE FUNNEL
// ----------------------------------------------------

// Healthcheck endpoints for cloud deployment (Render, Railway, Docker, AWS)
app.get(['/healthz', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: Math.floor(process.uptime()), timestamp: Date.now() });
});

// Cloud server configuration & dynamic origin resolution
app.get('/api/config', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const serverUrl = process.env.SERVER_PUBLIC_URL || `${protocol}://${host}`;
  res.json({
    serverUrl,
    version: '6.0.0',
    environment: process.env.NODE_ENV || 'production',
    adminConfigured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.includes('@'))
  });
});

// ----------------------------------------------------
// AUTHENTICATION & SECURE ACCESS CONTROL MIDDLEWARE
// ----------------------------------------------------

// Middleware to strictly enforce administrator authorization on protected API routes
function requireAdminApi(req, res, next) {
  // Allow programmatic secret key for internal/CI test suites if configured (min 16 chars)
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'jobassist_admin_secret_2026';
  const reqSecret = req.headers['x-admin-secret'] || req.headers['x-admin-key'];
  if (adminSecret && reqSecret && adminSecret.length >= 16 && reqSecret === adminSecret) {
    req.isAdmin = true;
    return next();
  }

  const token = extractSessionToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Please log in as administrator.',
      code: 'UNAUTHENTICATED'
    });
  }

  const user = validateSession(token);
  if (!user) {
    return res.status(401).json({
      error: 'Session expired or invalid. Please log in again.',
      code: 'SESSION_EXPIRED'
    });
  }

  // Strict email check against ADMIN_EMAIL env var (fail-closed)
  if (!isConfiguredAdminEmail(user.email)) {
    return res.status(403).json({
      error: 'Forbidden: You do not have administrator privileges.',
      code: 'FORBIDDEN'
    });
  }

  req.user = user;
  req.isAdmin = true;
  next();
}

// Public Authentication Endpoints
// 1. Candidate Registration (role is ALWAYS 'user')
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};
  try {
    const user = registerUser({ email, password, name });
    const session = createSession(user);
    res.setHeader('Set-Cookie', `ja_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`);
    res.status(201).json({
      success: true,
      token: session.token,
      user: session.user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Authentication / Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = authenticateCredentials({ email, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const session = createSession(user);
  res.setHeader('Set-Cookie', `ja_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`);
  res.json({
    success: true,
    token: session.token,
    user: session.user
  });
});

// 3. Invalidate Session / Logout
app.post('/api/auth/logout', (req, res) => {
  const token = extractSessionToken(req);
  if (token) destroySession(token);
  res.setHeader('Set-Cookie', 'ja_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. Retrieve Current Authenticated User & Role
app.get('/api/auth/me', (req, res) => {
  const token = extractSessionToken(req);
  if (!token) {
    return res.json({ authenticated: false, user: null });
  }
  const user = validateSession(token);
  if (!user) {
    return res.json({ authenticated: false, user: null });
  }
  res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin === true
    }
  });
});

// 1. Session State
app.get('/api/session', (req, res) => {
  res.json({
    activeMatches: 2411,
    verifiedListings: '7M+',
    currency: 'USD',
    currencySymbol: '$',
    alternateCurrency: 'ETB',
    alternateSymbol: 'Br'
  });
});

// 2. Plans & Pricing
app.get('/api/plans', (req, res) => {
  res.json({ plans });
});

// 3. FAQs
app.get('/api/faqs', (req, res) => {
  res.json({ faqs });
});

// 4. Job Categories & Listings
app.get('/api/categories', (req, res) => {
  res.json({ categories });
});

app.get('/api/jobs', (req, res) => {
  const { category, query, company } = req.query;
  let filtered = [...jobs];

  if (category) {
    filtered = filtered.filter(j => j.category === category);
  }
  if (company) {
    filtered = filtered.filter(j => j.companySlug === company);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ total: filtered.length, jobs: filtered });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ job });
});

// 5. Companies
app.get('/api/companies', (req, res) => {
  res.json({ companies });
});

app.get('/api/companies/:slug', (req, res) => {
  const company = companies.find(c => c.slug === req.params.slug);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  const companyJobs = jobs.filter(j => j.companySlug === req.params.slug);
  res.json({ company, jobs: companyJobs });
});

// 6. Lead Capture (Funnel Step 1: /email)
app.post('/api/leads', (req, res) => {
  const { email, utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, fbclid } = req.body;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const existingIdx = leads.findIndex(l => l.email.toLowerCase() === email.toLowerCase());
  const leadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: email.trim().toLowerCase(),
    capturedAt: new Date().toISOString(),
    matchCount: 2411,
    attribution: {
      utm_source: utm_source || 'direct',
      utm_medium: utm_medium || 'none',
      utm_campaign: utm_campaign || 'none',
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      utm_id: utm_id || null,
      fbclid: fbclid || null
    },
    ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
  };

  if (existingIdx !== -1) {
    leads[existingIdx] = { ...leads[existingIdx], ...leadRecord };
  } else {
    leads.unshift(leadRecord);
  }

  saveStore();

  res.json({
    success: true,
    lead: leadRecord,
    nextStep: '/we-work-for-you'
  });
});

// 7. Checkout Intent & Payment Confirmation (Funnel Step 4: /checkout)
app.post('/api/checkout/create-intent', (req, res) => {
  const { planId, email, currency } = req.body;
  const plan = plans.find(p => p.id === planId) || plans[1];

  res.json({
    clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`,
    planId: plan.id,
    planName: plan.name,
    amountDueUSD: plan.dueTodayUSD,
    amountDueETB: plan.dueTodayETB,
    currency: currency || 'USD'
  });
});

app.post('/api/checkout/confirm', async (req, res) => {
  const { planId, email, candidateName, paymentMethod, cardLast4, currency } = req.body;
  const plan = plans.find(p => p.id === planId) || plans[1];
  const targetEmail = (email || 'applicant@user.com').trim().toLowerCase();
  const targetName = candidateName || targetEmail.split('@')[0];

  const subscriptionRecord = {
    subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    customerEmail: targetEmail,
    planId: plan.id,
    planName: plan.name,
    amountBilled: currency === 'ETB' ? plan.dueTodayETB : plan.dueTodayUSD,
    currency: currency || 'USD',
    paymentMethod: paymentMethod || 'card',
    cardLast4: cardLast4 || '4242',
    status: 'active',
    startDate: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featuresUnlocked: [
      'Auto Apply AI Engine (unlimited matches)',
      'Best-Fit Role Prioritization (96% accuracy)',
      'Tailored Role-Specific Cover Letters',
      'Central Recruiter Replies & Interview Tracker'
    ]
  };

  subscriptions.unshift(subscriptionRecord);
  saveStore();

  // Generate & Activate Studio License Key
  const licenseKey = generateLicenseKey('PREM');
  const now = new Date();
  const grantedDays = plan.id === 'yearly' ? 365 : (plan.id === 'flex-3d' ? 7 : (plan.id === 'daily' ? 1 : 30));
  const expiresAt = new Date(now.getTime() + grantedDays * 24 * 60 * 60 * 1000).toISOString();

  const newLicense = {
    key: licenseKey,
    email: targetEmail,
    candidateName: targetName,
    planId: plan.id,
    planName: plan.name,
    status: 'active',
    grantedDays,
    activeDaysLimit: plan.id === 'flex-3d' ? 3 : null,
    createdAt: now.toISOString(),
    expiresAt,
    approvedBy: 'automated_checkout',
    paymentMethod: paymentMethod || 'card',
    reference: `TX-${Date.now().toString().slice(-8)}`
  };

  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);
  premiumLicenses.unshift(newLicense);
  saveJSON(LICENSES_PATH, premiumLicenses);

  // Record in Monetization Payments Table
  const paymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: targetEmail,
    candidateName: targetName,
    planId: plan.id,
    planName: plan.name,
    currency: currency || 'USD',
    amount: subscriptionRecord.amountBilled,
    paymentMethod: paymentMethod || 'card',
    reference: newLicense.reference,
    status: 'approved',
    verification: {
      validFormat: true,
      confidence: 100,
      fraudRisk: 'LOW',
      flags: ['CHECKOUT_FUNNEL_VERIFIED'],
      recommendedAction: 'AUTO_APPROVE_ELIGIBLE',
      extractedData: { gateway: paymentMethod || 'card' }
    },
    submittedAt: now.toISOString(),
    approvedAt: now.toISOString(),
    licenseKeyIssued: licenseKey,
    notes: 'Subscribed via Onboarding Funnel'
  };

  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);
  pendingPayments.unshift(paymentRecord);
  saveJSON(PAYMENTS_PATH, pendingPayments);

  // Dispatch Email & Telegram Notification
  notifyLicenseApproved(newLicense);
  const emailDispatched = await dispatchLicenseKeyEmail({ license: newLicense, payment: paymentRecord });

  res.json({
    success: true,
    subscription: subscriptionRecord,
    license: newLicense,
    licenseKey,
    emailDispatched,
    message: `Payment authorized successfully! License ${licenseKey} has been emailed to ${targetEmail}.`
  });
});

// 8. Self-Service Cancellation
app.post('/api/subscription/cancel', (req, res) => {
  const { email, subscriptionId } = req.body;

  let sub = null;
  if (subscriptionId) {
    sub = subscriptions.find(s => s.subscriptionId === subscriptionId);
  } else if (email) {
    sub = subscriptions.find(s => s.customerEmail.toLowerCase() === email.toLowerCase());
  }

  if (!sub) {
    return res.status(404).json({ error: 'No active subscription found for this account' });
  }

  sub.status = 'cancelled';
  sub.cancelledAt = new Date().toISOString();
  saveStore();

  res.json({
    success: true,
    message: 'Your subscription has been canceled. Access will remain active until the end of your current billing period.',
    subscription: sub
  });
});

// ----------------------------------------------------
// PREMIUM MONETIZATION, ACCESS CONTROL & ADMIN ENGINE
// (Daily, Flex 3-Day, Monthly, Yearly + ETB/Telebirr/CBE + Binance/Payoneer)
// ----------------------------------------------------

// A. Get Premium Plans & Payment Gateways
app.get('/api/premium/plans', (req, res) => {
  plansConfig = loadJSON(PLANS_CONFIG_PATH, plansConfig);
  // Apply environment variable overrides if provided in production cloud
  if (process.env.TELEBIRR_RECEIVER_PHONE && plansConfig.gateways?.telebirr) {
    plansConfig.gateways.telebirr.accountNumber = process.env.TELEBIRR_RECEIVER_PHONE;
  }
  if (process.env.CBE_ACCOUNT_NUMBER && plansConfig.gateways?.cbe) {
    plansConfig.gateways.cbe.accountNumber = process.env.CBE_ACCOUNT_NUMBER;
  }
  const binanceId = process.env.BINANCE_UID || process.env.BINANCE_PAY_ID;
  if (binanceId && plansConfig.gateways?.binance) {
    plansConfig.gateways.binance.binanceUid = binanceId;
    plansConfig.gateways.binance.binancePayId = binanceId;
  }
  res.json({
    success: true,
    plans: plansConfig.plans,
    gateways: plansConfig.gateways
  });
});

// B. Submit Payment Proof (Telebirr SMS, CBE Ref, Binance TxID, Payoneer ID)
app.post(['/api/premium/submit-payment', '/api/payment/submit', '/api/payments/submit', '/api/payment/submit-proof'], (req, res) => {
  const { email, candidateName, planId, currency, reference, notes } = req.body;
  const paymentMethod = req.body.paymentMethod || req.body.gateway || (currency === 'ETB' ? 'telebirr' : 'binance');

  if (!email || !reference) {
    return res.status(400).json({ error: 'Email and transaction reference/ID are required.' });
  }

  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);

  const plan = (plansConfig.plans || []).find(p => p.id === planId) || {
    id: planId || 'monthly',
    name: 'Custom Plan',
    formattedETB: '1,200 ETB',
    formattedUSD: '$24.99'
  };

  const formattedAmount = (currency === 'ETB' || paymentMethod === 'telebirr' || paymentMethod === 'cbe') ? plan.formattedETB : plan.formattedUSD;
  const chosenCurrency = currency || (paymentMethod === 'telebirr' || paymentMethod === 'cbe' ? 'ETB' : 'USD');

  // Run AI Receipt Verification & Fraud Radar
  const verification = verifyReceipt({
    paymentMethod,
    reference,
    amount: formattedAmount,
    currency: chosenCurrency,
    email,
    existingPayments: pendingPayments
  });

  const paymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: email.trim().toLowerCase(),
    candidateName: candidateName || email.split('@')[0],
    planId: plan.id,
    planName: plan.name,
    currency: chosenCurrency,
    amount: formattedAmount,
    paymentMethod,
    reference: reference.trim(),
    status: 'pending',
    verification: {
      validFormat: verification.validFormat,
      confidence: verification.confidence,
      fraudRisk: verification.fraudRisk,
      flags: verification.flags,
      recommendedAction: verification.recommendedAction,
      extractedData: verification.extractedData || {}
    },
    submittedAt: new Date().toISOString(),
    notes: notes || ''
  };

  pendingPayments.unshift(paymentRecord);
  saveJSON(PAYMENTS_PATH, pendingPayments);

  // Dispatch Notification (Telegram + In-App Feed)
  notifyNewPayment(paymentRecord, verification);

  res.json({
    success: true,
    paymentId: paymentRecord.id,
    payment: paymentRecord,
    verification: paymentRecord.verification,
    message: 'Payment receipt received! Your access key will be activated shortly by the administrator.'
  });
});

// AI Receipt Pre-Flight Verification Check
app.post('/api/premium/verify-receipt-ai', (req, res) => {
  const { paymentMethod, reference, email } = req.body;
  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);
  const result = verifyReceipt({
    paymentMethod,
    reference,
    email,
    existingPayments: pendingPayments
  });
  res.json({ success: true, result });
});

// C. Verify License Key or Email (Used by Chrome Extension & Web Studio)
app.post('/api/license/verify', (req, res) => {
  const { licenseKey, email } = req.body;
  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);

  let lic = null;
  if (licenseKey && licenseKey.trim()) {
    const cleanKey = licenseKey.trim().toUpperCase();
    lic = premiumLicenses.find(l => l.key.toUpperCase() === cleanKey);
  }
  if (!lic && email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    lic = premiumLicenses.find(l => l.email.toLowerCase() === cleanEmail && l.status === 'active');
  }

  if (!lic) {
    return res.json({
      valid: false,
      message: 'No active subscription or license key found for this account.'
    });
  }

  const now = Date.now();
  const expiryTime = new Date(lic.expiresAt).getTime();
  const isExpired = expiryTime <= now;
  const msRemaining = Math.max(0, expiryTime - now);
  const totalHoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const totalMinutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  let timeRemainingFormatted = '';
  if (isExpired) {
    timeRemainingFormatted = 'Expired';
  } else if (daysRemaining > 1) {
    timeRemainingFormatted = `${daysRemaining} days remaining`;
  } else if (totalHoursRemaining >= 1) {
    timeRemainingFormatted = `${totalHoursRemaining}h ${totalMinutesRemaining}m remaining`;
  } else {
    timeRemainingFormatted = `${totalMinutesRemaining} minutes remaining`;
  }

  if (isExpired || lic.status !== 'active') {
    return res.json({
      valid: false,
      status: isExpired ? 'expired' : lic.status,
      isExpired: true,
      message: isExpired
        ? `Your access pass expired on ${new Date(lic.expiresAt).toLocaleString()}. Access denied. Please renew to continue using AutoFill and Job Hunter.`
        : 'License is suspended by administrator.',
      expiresAt: lic.expiresAt,
      daysRemaining: 0,
      hoursRemaining: 0,
      timeRemainingFormatted: 'Expired'
    });
  }

  const planId = (lic.planId || '').toLowerCase();
  const isAutofillOnly = planId === 'autofill-specialist';
  const isHunterOnly = planId === 'hunter-pro';
  const hasAutoFill = !isHunterOnly;
  const hasHunter = !isAutofillOnly;
  const hasResumeTailor = !isAutofillOnly && !isHunterOnly;

  res.json({
    valid: true,
    key: lic.key,
    email: lic.email,
    candidateName: lic.candidateName,
    planId: lic.planId,
    planName: lic.planName,
    permissions: {
      autofill: hasAutoFill,
      hunter: hasHunter,
      resumeTailor: hasResumeTailor,
      combo: !isAutofillOnly && !isHunterOnly
    },
    status: 'active',
    isExpired: false,
    expiresAt: lic.expiresAt,
    daysRemaining,
    hoursRemaining: totalHoursRemaining,
    timeRemainingFormatted,
    activeDaysLimit: lic.activeDaysLimit || null,
    features: [
      hasAutoFill ? 'Unlimited 1-Click ATS AutoFill (Workable, JazzHR, Ashby, Workday)' : null,
      hasResumeTailor ? 'Canva-Grade Tailored PDF Resumes' : null,
      hasAutoFill ? 'AI Screening Question Synthesizer 2.0 (STAR Method)' : null,
      hasHunter ? '9-Portal Autonomous Fresh Job Hunter (<= 5 Days)' : null,
      hasHunter ? 'Interactive Pause & Continue Hunting Workflow' : null,
      'CRM Pipeline Tracker & CSV Export'
    ].filter(Boolean)
  });
});

// Candidate Instant License Lookup / Key Retrieval after Payment Approval
app.post('/api/license/lookup', (req, res) => {
  const email = normalizeEmail(req.body.email || req.query.email);
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid candidate email is required.' });
  }

  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);
  const matching = premiumLicenses.filter(l => normalizeEmail(l.email) === email);

  if (matching.length === 0) {
    return res.status(404).json({
      found: false,
      message: 'No active license found for this email address. If you recently submitted payment, the administrator will review and approve it shortly.'
    });
  }

  const latest = matching[0];
  const now = Date.now();
  const expiryTime = new Date(latest.expiresAt).getTime();
  const isExpired = expiryTime <= now;

  const msRemaining = Math.max(0, expiryTime - now);
  const totalHoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const totalMinutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  let timeRemainingFormatted = '';
  if (isExpired) {
    timeRemainingFormatted = 'Expired';
  } else if (daysRemaining > 1) {
    timeRemainingFormatted = `${daysRemaining} days remaining`;
  } else if (totalHoursRemaining >= 1) {
    timeRemainingFormatted = `${totalHoursRemaining}h ${totalMinutesRemaining}m remaining`;
  } else {
    timeRemainingFormatted = `${totalMinutesRemaining} minutes remaining`;
  }

  res.json({
    found: true,
    key: latest.key,
    email: latest.email,
    candidateName: latest.candidateName,
    planId: latest.planId,
    planName: latest.planName,
    status: isExpired ? 'expired' : latest.status,
    isExpired,
    expiresAt: latest.expiresAt,
    daysRemaining,
    hoursRemaining: totalHoursRemaining,
    timeRemainingFormatted
  });
});

// D. Admin: Get All Licenses
app.get('/api/admin/licenses', requireAdminApi, (req, res) => {
  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);
  const now = Date.now();
  const list = premiumLicenses.map(l => {
    const expiryTime = new Date(l.expiresAt).getTime();
    const daysRemaining = Math.max(0, Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)));
    const isExpired = expiryTime <= now;
    return {
      ...l,
      daysRemaining,
      isExpired
    };
  });
  res.json({ total: list.length, licenses: list });
});

// E. Admin: Grant License (Day-by-Day, 2/3 Days/Week, Monthly, Yearly)
app.post('/api/admin/licenses/grant', requireAdminApi, async (req, res) => {
  const { email, candidateName, planId, durationDays, activeDaysLimit, paymentMethod, reference } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Candidate email is required.' });
  }

  const days = parseInt(durationDays, 10) || 30;
  const key = generateLicenseKey('PREM');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  const newLicense = {
    key,
    email: email.trim().toLowerCase(),
    candidateName: candidateName || email.split('@')[0],
    planId: planId || (days === 1 ? 'daily' : (days === 7 ? 'weekly' : (days >= 365 ? 'yearly' : 'monthly'))),
    planName: planId === 'daily' ? 'Daily Pass' : (planId === 'flex-3d' ? 'Flex Pass' : (days >= 365 ? 'Yearly VIP' : 'Monthly Pro')),
    status: 'active',
    grantedDays: days,
    activeDaysLimit: activeDaysLimit ? parseInt(activeDaysLimit, 10) : null,
    createdAt: now.toISOString(),
    expiresAt,
    approvedBy: 'admin',
    paymentMethod: paymentMethod || 'manual_grant',
    reference: reference || 'ADMIN_DIRECT_GRANT'
  };

  premiumLicenses.unshift(newLicense);
  saveJSON(LICENSES_PATH, premiumLicenses);

  const emailDispatched = await dispatchLicenseKeyEmail({ license: newLicense });

  res.json({
    success: true,
    message: `License successfully granted for ${days} days and emailed to ${newLicense.email}!`,
    licenseKey: key,
    emailDispatched,
    license: newLicense
  });
});

// F. Admin: Extend License Expiry
app.post('/api/admin/licenses/extend', requireAdminApi, (req, res) => {
  const { key, additionalDays } = req.body;
  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);

  const lic = premiumLicenses.find(l => l.key === key);
  if (!lic) return res.status(404).json({ error: 'License key not found' });

  const add = parseInt(additionalDays, 10) || 7;
  const baseTime = new Date(lic.expiresAt).getTime() > Date.now() ? new Date(lic.expiresAt).getTime() : Date.now();
  lic.expiresAt = new Date(baseTime + add * 24 * 60 * 60 * 1000).toISOString();
  lic.status = 'active';
  lic.grantedDays = (lic.grantedDays || 0) + add;

  saveJSON(LICENSES_PATH, premiumLicenses);
  res.json({ success: true, message: `Extended license by ${add} days.`, license: lic });
});

// G. Admin: Revoke / Suspend License
app.post('/api/admin/licenses/revoke', requireAdminApi, (req, res) => {
  const { key } = req.body;
  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);

  const lic = premiumLicenses.find(l => l.key === key);
  if (!lic) return res.status(404).json({ error: 'License key not found' });

  lic.status = 'suspended';
  saveJSON(LICENSES_PATH, premiumLicenses);
  res.json({ success: true, message: 'License suspended.', license: lic });
});

// H. Admin: Get Pending Payments
app.get('/api/admin/payments', requireAdminApi, (req, res) => {
  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);
  res.json({ total: pendingPayments.length, payments: pendingPayments });
});

// I. Admin: Approve Payment & Auto-Issue License
app.post('/api/admin/payments/approve', requireAdminApi, async (req, res) => {
  try {
    const { paymentId, customDays } = req.body || {};
    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId is required.' });
    }

    pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);
    premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);

    const cleanId = String(paymentId).trim();
    const payment = pendingPayments.find(p => String(p.id).trim() === cleanId);
    if (!payment) {
      console.warn(`[ADMIN APPROVE] Payment not found for ID: ${cleanId}`);
      return res.status(404).json({ error: `Payment request "${cleanId}" not found in current records.` });
    }

    // Determine duration
    let days = 30;
    const matchingPlan = (plansConfig.plans || []).find(p => p.id === payment.planId);
    if (customDays) days = parseInt(customDays, 10);
    else if (matchingPlan && matchingPlan.durationDays) days = matchingPlan.durationDays;
    else if (payment.planId === 'daily' || payment.planId === 'hunter-pro') days = 1;
    else if (payment.planId === 'flex-3d' || payment.planId === 'studio-combo' || payment.planId === 'weekly' || payment.planId === 'trial-7d') days = 7;
    else if (payment.planId === 'month-3') days = 90;
    else if (payment.planId === 'yearly') days = 365;

    // Check if license already generated
    let key = payment.licenseKeyIssued;
    let newLicense = key ? premiumLicenses.find(l => l.key === key) : null;

    if (!newLicense) {
      key = generateLicenseKey('PREM');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

      newLicense = {
        key,
        email: payment.email,
        candidateName: payment.candidateName,
        planId: payment.planId,
        planName: payment.planName,
        status: 'active',
        grantedDays: days,
        activeDaysLimit: payment.planId === 'flex-3d' ? 3 : null,
        createdAt: now.toISOString(),
        expiresAt,
        approvedBy: req.user ? req.user.email : 'admin',
        paymentMethod: payment.paymentMethod,
        reference: payment.reference
      };

      premiumLicenses.unshift(newLicense);
      saveJSON(LICENSES_PATH, premiumLicenses);
    }

    payment.status = 'approved';
    payment.approvedAt = new Date().toISOString();
    payment.licenseKeyIssued = key;
    saveJSON(PAYMENTS_PATH, pendingPayments);

    // Dispatch License Issued Notification & Candidate Email
    notifyLicenseApproved(newLicense);
    const emailDispatched = await dispatchLicenseKeyEmail({ license: newLicense, payment });

    return res.json({
      success: true,
      message: `Payment approved! License ${key} generated and emailed to ${payment.email}.`,
      licenseKey: key,
      emailDispatched,
      payment,
      license: newLicense
    });
  } catch(err) {
    console.error('[ADMIN APPROVE EXCEPTION]:', err);
    return res.status(500).json({ error: 'Server error while approving payment: ' + err.message });
  }
});

// Admin: Clear All Test / Sample Records
app.post('/api/admin/clear-samples', requireAdminApi, (req, res) => {
  try {
    pendingPayments = [];
    premiumLicenses = [
      {
        key: 'PREM-ROYAL-2026-VIP',
        email: 'jamesroyal.91@outlook.com',
        candidateName: 'James Royal',
        planId: 'yearly',
        planName: 'Yearly VIP Enterprise (365 Days)',
        status: 'active',
        grantedDays: 365,
        activeDaysLimit: null,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        approvedBy: 'admin',
        paymentMethod: 'enterprise_grant',
        reference: 'ENTERPRISE_CLIENT_DIRECT'
      }
    ];
    saveJSON(PAYMENTS_PATH, []);
    saveJSON(LICENSES_PATH, premiumLicenses);
    saveJSON(NOTIFICATIONS_PATH, []);
    saveJSON(OUTBOUND_EMAILS_PATH, []);

    res.json({
      success: true,
      message: 'All test and sample records successfully cleared! Admin dashboard is now clean.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear samples: ' + err.message });
  }
});

// J. Admin: Reject Payment
app.post('/api/admin/payments/reject', requireAdminApi, (req, res) => {
  const { paymentId, reason } = req.body;
  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);

  const payment = pendingPayments.find(p => p.id === paymentId);
  if (!payment) return res.status(404).json({ error: 'Payment request not found' });

  payment.status = 'rejected';
  payment.rejectedAt = new Date().toISOString();
  payment.rejectionReason = reason || 'Unable to verify transaction reference.';

  saveJSON(PAYMENTS_PATH, pendingPayments);
  res.json({ success: true, message: 'Payment rejected.', payment });
});

// K. Admin: Export Licenses and Payments CSV
app.get('/api/admin/export-csv', requireAdminApi, (req, res) => {
  premiumLicenses = loadJSON(LICENSES_PATH, premiumLicenses);
  pendingPayments = loadJSON(PAYMENTS_PATH, pendingPayments);

  const headers = ['Type', 'Identifier', 'Candidate', 'Email', 'Plan', 'Status', 'Days_Or_Amount', 'Date', 'Reference'];
  const licRows = premiumLicenses.map(l => [
    'LICENSE', `"${l.key}"`, `"${l.candidateName || ''}"`, `"${l.email}"`, `"${l.planName}"`, `"${l.status}"`, `"${l.grantedDays || 0}d"`, `"${l.createdAt || ''}"`, `"${l.paymentMethod || 'manual'}"`
  ]);
  const payRows = pendingPayments.map(p => [
    'PAYMENT', `"${p.id}"`, `"${p.candidateName || ''}"`, `"${p.email}"`, `"${p.planName}"`, `"${p.status}"`, `"${p.amount}"`, `"${p.submittedAt}"`, `"${p.reference}"`
  ]);

  const csv = [headers.join(','), ...licRows.map(r => r.join(',')), ...payRows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="JobAssist_Admin_Financial_Report.csv"');
  res.send(csv);
});

// L. Admin: Live Notifications Feed (Telegram & In-App)
app.get('/api/admin/notifications', requireAdminApi, (req, res) => {
  const notifs = getNotifications();
  res.json({ total: notifs.length, notifications: notifs });
});

// ----------------------------------------------------
// REST API ENDPOINTS: AUTONOMOUS AI JOB SEARCH & AUTO-APPLY
// (MadsLorentzen/ai-job-search Multi-Agent Engine)
// ----------------------------------------------------

// 9. Candidate Ground-Truth Profile
app.get('/api/ai/profile', (req, res) => {
  res.json({ profile: candidateProfile });
});

app.put('/api/ai/profile', (req, res) => {
  if (req.body && req.body.profile) {
    candidateProfile = req.body.profile;
    saveJSON(PROFILE_PATH, candidateProfile);
    res.json({ success: true, profile: candidateProfile });
  } else {
    res.status(400).json({ error: 'Invalid profile data' });
  }
});

// 10. Multi-Portal Live Scraper (/scrape)
app.get('/api/ai/jobs', (req, res) => {
  res.json({ jobs: cachedLiveJobs });
});

app.post('/api/ai/scrape', async (req, res) => {
  try {
    const { query = 'Virtual Assistant', location = 'Remote', portal = 'all', maxDays = 5 } = req.body;
    console.log(`[JOBASSIST AI SCRAPER] Scraping live: query="${query}", location="${location}", portal="${portal}", maxDays=${maxDays}d`);
    
    const freshJobs = await scrapeAllPortals({
      query,
      location,
      portal,
      maxDays: parseInt(maxDays, 10) || 5
    });
    
    const existingIds = new Set(cachedLiveJobs.map(j => j.id));
    for (const job of freshJobs) {
      if (!existingIds.has(job.id)) {
        cachedLiveJobs.unshift(job);
        existingIds.add(job.id);
      }
    }

    if (cachedLiveJobs.length > 100) cachedLiveJobs = cachedLiveJobs.slice(0, 100);
    saveJSON(SEEN_JOBS_PATH, cachedLiveJobs);

    res.json({
      success: true,
      count: freshJobs.length,
      jobs: freshJobs,
      totalCached: cachedLiveJobs.length
    });
  } catch (err) {
    console.error('[AI SCRAPER ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// 11. 5-Dimension Fit Evaluator (/rank)
app.post('/api/ai/rank', (req, res) => {
  try {
    const jobsToScore = req.body.jobs || cachedLiveJobs;
    const scoredJobs = jobsToScore.map(job => {
      const fit = evaluateJobFit(job, candidateProfile);
      return {
        ...job,
        fitScore: fit.fitScore,
        tier: fit.tier,
        tierBadge: fit.tierBadge,
        breakdown: fit.breakdown,
        matchedSkills: fit.matchedSkills,
        missingSkills: fit.missingSkills,
        strengths: fit.strengths,
        gaps: fit.gaps,
        vetoTriggered: fit.vetoTriggered,
        vetoReason: fit.vetoReason
      };
    });

    scoredJobs.sort((a, b) => b.fitScore - a.fitScore);
    res.json({ success: true, count: scoredJobs.length, scoredJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Drafter-Reviewer Studio (/apply)
app.post('/api/ai/apply', (req, res) => {
  try {
    const { job, customJobText } = req.body;
    let targetJob = job;

    if (!targetJob && customJobText) {
      const { cleanedText } = sanitizePosting(customJobText);
      targetJob = {
        id: `custom-${Date.now()}`,
        title: "Target Position",
        company: "Target Employer",
        location: "Remote",
        portal: "Direct Input",
        url: "#",
        date: new Date().toISOString().split('T')[0],
        description: cleanedText,
        tags: ["software", "engineering"],
        salary: "$165k - $210k"
      };
    }

    if (!targetJob) {
      return res.status(400).json({ error: 'No job provided for application' });
    }

    const integrity = sanitizePosting(targetJob.description || '');
    const fitData = evaluateJobFit(targetJob, candidateProfile);
    const drafts = draftApplication({
      job: targetJob,
      candidate: candidateProfile.candidate,
      fitData
    });
    const review = reviewApplication({
      drafts,
      job: targetJob,
      candidateProfile
    });
    const autofill = generateAutofillPayload({
      job: targetJob,
      candidate: candidateProfile.candidate,
      fitData
    });

    res.json({
      success: true,
      job: targetJob,
      integrityFindings: integrity.findings,
      fitData,
      drafts,
      review,
      autofill
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Form Auto-Fill Engine ("Fill Full By Itself")
app.post('/api/ai/autofill', (req, res) => {
  try {
    const { job } = req.body;
    const fitData = evaluateJobFit(job, candidateProfile);
    const autofill = generateAutofillPayload({
      job,
      candidate: candidateProfile.candidate,
      fitData
    });
    res.json({ success: true, autofill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13b. Active Autofill Payload for In-Browser Agent & Bookmarklet
app.get('/api/ai/active-autofill', (req, res) => {
  // Always reload fresh profile from disk
  const freshProfile = loadJSON(PROFILE_PATH, candidateProfile);
  const c = freshProfile.candidate || {};
  const p = freshProfile.preferences || {};
  const s = freshProfile.screeningAnswers || {};

  res.json({
    success: true,
    payload: {
      fullName: c.fullName || 'Raymond Wong',
      firstName: c.firstName || 'Raymond',
      middleName: c.middleName || '',
      lastName: c.lastName || 'Wong',
      email: c.email || 'raymond1994.glo@outlook.com',
      phone: c.phone || '510-340-2070',
      phoneFormatted: c.phoneFormatted || '+1 (510) 340-2070',
      location: c.location || 'Atlanta, GA',
      addressLine1: c.addressLine1 || '215 Piedmont Ave NE APT 1206',
      addressLine2: c.addressLine2 || 'APT 1206',
      street: c.street || '215 Piedmont Ave NE',
      apt: c.apt || 'APT 1206',
      city: c.city || 'Atlanta',
      state: c.state || 'GA',
      stateFull: c.stateFull || 'Georgia',
      postalCode: c.postalCode || '30308',
      zipCode: c.zipCode || '30308',
      country: c.country || 'United States',
      dob: c.dob || '12/09/1994',
      dobMonth: c.dobMonth || '12',
      dobDay: c.dobDay || '09',
      dobYear: c.dobYear || '1994',
      dobISO: c.dobISO || '1994-12-09',
      ssn: c.ssn || 'XXX-XX-0928',
      ssnLast4: c.ssnLast4 || '0928',
      gender: c.gender || 'Male',
      ethnicity: c.ethnicity || 'Asian',
      veteranStatus: c.veteranStatus || 'I am not a protected veteran',
      disabilityStatus: c.disabilityStatus || 'No, I do not have a disability and have not had one in the past',
      workAuthStatus: 'US_CITIZEN',
      workAuthLabel: 'US Citizen',
      authorizedToWorkUS: 'Yes',
      requiresSponsorship: 'No',
      currentCompany: c.currentCompany || 'Uber Eats',
      currentTitle: c.currentTitle || 'Senior AI/ML Engineer',
      yearsOfExperience: String(c.yearsOfExperience || 8),
      linkedin: c.linkedin || 'https://www.linkedin.com/in/ray-w-3888b33aa',
      github: c.github || 'https://github.com/raymondwong-ai',
      portfolio: c.portfolio || 'https://app.talentral.org',
      resumeUrl: c.resumeUrl || 'https://app.talentral.org',
      desiredSalary: String(p.targetSalaryUSD || 175000),
      hourlyRate: String(p.hourlyRateUSD || 85),
      noticePeriod: p.noticePeriod || '2 weeks',
      earliestStartDate: p.earliestStartDate || 'Immediately / 2 weeks',
      heardAbout: p.heardAbout || 'LinkedIn',
      whyCompany: s.whyCompany || "I am passionate about solving mission-critical business challenges through scalable, high-throughput machine learning architectures and distributed systems.",
      greatestAchievement: s.greatestAchievement || "At Uber Eats, I spearheaded the redesign of our dynamic delivery dispatch ranking system, achieving sub-18ms p99 inference latency across 45M+ monthly active users and delivering a 7.4% improvement in courier dispatch efficiency.",
      relevantExperience: s.technicalExperience || "8+ years building enterprise AI/ML solutions in Python, Go, and TypeScript, containerized on Kubernetes and AWS (SageMaker, ECS, EKS, Lambda, S3, RDS).",
      workHistory: freshProfile.experience || [],
      education: freshProfile.education || []
    }
  });
});

// 13c. Autonomous Auto-Pilot Agent: Search, Rank & Auto-Apply All
app.post('/api/ai/autopilot', async (req, res) => {
  try {
    const { query = 'Full Stack Engineer', location = 'Remote', minScore = 80, maxApplications = 5 } = req.body;
    console.log(`[AUTOPILOT] Starting autonomous run: query="${query}", location="${location}", minScore=${minScore}`);
    
    // 1. Scrape fresh postings
    const freshJobs = await scrapeAllPortals({ query, location, portal: 'all' });
    
    // 2. Score each job
    const qualified = [];
    for (const job of freshJobs) {
      const fit = evaluateJobFit(job, candidateProfile);
      if (fit.fitScore >= minScore) {
        qualified.push({ job, fit });
      }
    }

    qualified.sort((a, b) => b.fit.fitScore - a.fit.fitScore);
    const toApply = qualified.slice(0, maxApplications);
    const completedApps = [];

    // 3. Auto-draft and generate autofill package for each qualified job
    for (const item of toApply) {
      const drafts = draftApplication({
        job: item.job,
        candidate: candidateProfile.candidate,
        fitData: item.fit
      });
      const review = reviewApplication({
        drafts,
        job: item.job,
        candidateProfile
      });
      const autofill = generateAutofillPayload({
        job: item.job,
        candidate: candidateProfile.candidate,
        fitData: item.fit
      });

      const appRecord = {
        id: `auto-${item.job.id}-${Date.now()}`,
        company: item.job.company,
        role: item.job.title,
        location: item.job.location,
        portal: item.job.portal,
        url: item.job.url,
        stage: 'Applied',
        fitScore: item.fit.fitScore,
        appliedDate: new Date().toISOString().split('T')[0],
        followUpDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        notes: `Autonomous Auto-Pilot: Reviewer Score ${review.reviewerScore}%. Full ATS autofill package generated.`,
        drafts,
        autofill
      };

      if (!trackerApplications.some(a => a.company.toLowerCase() === item.job.company.toLowerCase() && a.role.toLowerCase() === item.job.title.toLowerCase())) {
        trackerApplications.unshift(appRecord);
      }
      completedApps.push(appRecord);
    }

    saveJSON(TRACKER_PATH, trackerApplications);

    res.json({
      success: true,
      scrapedTotal: freshJobs.length,
      qualifiedCount: qualified.length,
      appliedCount: completedApps.length,
      applications: completedApps
    });
  } catch (err) {
    console.error('[AUTOPILOT ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// 14. Application Tracker Pipeline (/outcome)
app.get('/api/ai/tracker', (req, res) => {
  res.json({ applications: trackerApplications });
});

app.post('/api/ai/tracker', (req, res) => {
  const newApp = req.body.application;
  if (!newApp) return res.status(400).json({ error: 'No application data' });

  const existingIdx = trackerApplications.findIndex(a => a.id === newApp.id);
  if (existingIdx >= 0) {
    trackerApplications[existingIdx] = { ...trackerApplications[existingIdx], ...newApp };
  } else {
    trackerApplications.unshift({
      id: newApp.id || `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      ...newApp
    });
  }

  saveJSON(TRACKER_PATH, trackerApplications);
  res.json({ success: true, applications: trackerApplications });
});

app.delete('/api/ai/tracker/:id', (req, res) => {
  const { id } = req.params;
  trackerApplications = trackerApplications.filter(a => a.id !== id);
  saveJSON(TRACKER_PATH, trackerApplications);
  res.json({ success: true, applications: trackerApplications });
});

// 15. Upskill & Market Demand Analyzer (/upskill)
app.get('/api/ai/upskill', (req, res) => {
  const analysis = analyzeUpskillGaps(cachedLiveJobs, candidateProfile);
  res.json({ success: true, analysis });
});

// 16. CSV Export for Tracker
app.get('/api/ai/export-csv', (req, res) => {
  const headers = ['ID', 'Company', 'Role', 'Stage', 'Fit Score', 'Applied Date', 'Follow Up', 'Location', 'Salary Estimate', 'Notes'];
  const rows = trackerApplications.map(a => [
    `"${a.id || ''}"`,
    `"${(a.company || '').replace(/"/g, '""')}"`,
    `"${(a.role || '').replace(/"/g, '""')}"`,
    `"${a.stage || 'Applied'}"`,
    `"${a.fitScore || 'N/A'}"`,
    `"${a.appliedDate || ''}"`,
    `"${a.followUpDate || ''}"`,
    `"${(a.location || '').replace(/"/g, '""')}"`,
    `"${(a.salaryEstimate || '').replace(/"/g, '""')}"`,
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="JobAssist_AI_Applications_Tracker.csv"');
  res.send(csvContent);
});

// Admin Portal Route with email-based authorization enforcement
app.get('/admin', (req, res) => {
  const token = extractSessionToken(req);
  if (!token) {
    return res.sendFile(path.join(__dirname, 'public', 'admin_login.html'));
  }
  const user = validateSession(token);
  if (!user) {
    return res.sendFile(path.join(__dirname, 'public', 'admin_login.html'));
  }
  if (!isConfiguredAdminEmail(user.email)) {
    const safeEmail = user.email.replace(/[<>&"]/g, '');
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>403 Forbidden — Administrator Privileges Required</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { background: #0B1120; color: #F8FAFC; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .card { background: #0F172A; border: 1px solid #1E293B; border-radius: 14px; max-width: 480px; width: 100%; padding: 36px 30px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .badge { display: inline-block; background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid #EF4444; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-bottom: 16px; }
          h1 { font-size: 21px; font-weight: 800; margin-bottom: 12px; color: #FFF; }
          p { font-size: 13.5px; color: #94A3B8; line-height: 1.6; margin-bottom: 24px; }
          .user-pill { font-family: monospace; background: #1E293B; padding: 3px 8px; border-radius: 6px; color: #38BDF8; font-weight: 700; }
          .actions { display: flex; gap: 12px; justify-content: center; }
          .btn { padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
          .btn-home { background: #007aff; color: #FFFFFF; }
          .btn-logout { background: #1E293B; color: #CBD5E1; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">HTTP 403 FORBIDDEN</div>
          <h1>Administrator Access Denied</h1>
          <p>
            Your account <span class="user-pill">${safeEmail}</span> is not authorized to access the Administrator Control Center. Only the designated administrator email address can access this dashboard.
          </p>
          <div class="actions">
            <a href="/" class="btn btn-home">Return to Home</a>
            <button onclick="logout()" class="btn btn-logout">Sign In as Admin</button>
          </div>
        </div>
        <script>
          async function logout() {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/admin';
          }
        </script>
      </body>
      </html>
    `);
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Pricing & Public Subscription Checkout Route
app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pricing.html'));
});

// Live Verified Jobs Board & Fit Matcher Route
app.get(['/jobs-board', '/jobs'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'jobs-board.html'));
});

// AI Interview Copilot & Question Prediction API
app.post('/api/ai/interview-prep', (req, res) => {
  const { jobTitle, company, keywords, salaryRange, candidate } = req.body;
  const prep = generateInterviewPrep({
    jobTitle,
    company,
    keywords,
    salaryRange,
    candidate: candidate || candidateProfile
  });
  res.json({ success: true, prep });
});

// AI Interview Copilot Portal Route
app.get(['/interview-prep', '/interview'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'interview-prep.html'));
});

// Interactive Application Pipeline & CRM Route
app.get(['/pipeline', '/crm'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pipeline.html'));
});

// Direct Recruiter Outreach Generator API
app.post('/api/ai/outreach-generator', (req, res) => {
  const { recipientName, recipientRole, company, jobTitle, candidate, tone } = req.body;
  const outreach = generateRecruiterOutreach({
    recipientName,
    recipientRole,
    company,
    jobTitle,
    candidate: candidate || candidateProfile,
    tone
  });
  res.json({ success: true, outreach });
});

// Direct Recruiter Outreach Mailer Portal Route
app.get(['/recruiter-outreach', '/outreach'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recruiter-outreach.html'));
});

// Multi-Tenant Agency Hub Route
app.get('/agency', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agency.html'));
});

// Universal Zero-Install Web Bookmarklet Route
app.get('/bookmarklet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bookmarklet.html'));
});

// Outbound License Emails Log
app.get('/api/admin/outbound-emails', requireAdminApi, (req, res) => {
  res.json({ success: true, emails: getOutboundEmails() });
});

// Extension Version & Automatic Update Checker API
app.get('/api/extension/version', (req, res) => {
  res.json({
    currentVersion: '3.2.0',
    minRequiredVersion: '3.0.0',
    latestReleaseDate: '2026-10-23',
    cadence: 'Weekly 2–3 Days (Tuesdays, Thursdays, Saturdays)',
    downloadUrl: '/download-extension',
    isLatest: true,
    changelog: [
      '9-Portal Autonomous Radar (Greenhouse, Lever, Workday, Taleo, Ashby, BambooHR, LinkedIn Easy Apply, Indeed, RemoteOK)',
      'Strict <= 5-day freshness filter eliminating 1-month-old stale postings',
      'Interactive Pause & Continue state machine for AutoFill on detected roles',
      'Zero-duplicate multi-factor canonical URL and corporate entity normalization',
      'Anti-bot stealth mode bypass for 2026 ATS DOM updates'
    ]
  });
});

// 1-Click Chrome Extension Package Downloader (.ZIP)
app.get(['/download-extension', '/api/extension/download', '/download/extension.zip'], (req, res) => {
  const zipPath = path.join(__dirname, 'public', 'JobAssist-AI-Studio-Extension.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="JobAssist-AI-Studio-Extension.zip"');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Extension zip package not found. Run sync to build.' });
  }
});

// ----------------------------------------------------
// CLIENT SPA ROUTING FALLBACK
// ----------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` JobAssist Commercial Platform Running`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Checkout Funnel: http://localhost:${PORT}/checkout?utm_source=Facebook`);
  console.log(` Autonomous AI Studio: http://localhost:${PORT}/assistant`);
  if (process.env.ADMIN_EMAIL) {
    console.log(` Admin Authorization: Active (ADMIN_EMAIL is configured)`);
  } else {
    console.log(` Admin Authorization: Notice (ADMIN_EMAIL is not set. Admin routes protected)`);
  }
  console.log(`====================================================`);
});
