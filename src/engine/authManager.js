/**
 * JobAssist Authentication & Administrator Authorization Engine
 * Enforces email-based administrator access control, secure PBKDF2 password hashing,
 * and cryptographically random session tokens.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_PATH = path.join(__dirname, '..', 'data', 'users.json');
const SESSIONS_PATH = path.join(__dirname, '..', 'data', 'sessions.json');

function loadJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`[AUTH] Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[AUTH] Error writing ${filePath}:`, err.message);
    return false;
  }
}

// In-Memory User & Session Stores
let usersStore = loadJSON(USERS_PATH, []);
let sessionsStore = loadJSON(SESSIONS_PATH, []);

/**
 * Safely normalize email addresses (lowercase, trim whitespace)
 */
export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Verify whether an email matches the configured administrator email.
 * Fails closed if ADMIN_EMAIL is missing, empty, or not a valid email address.
 */
export function isConfiguredAdminEmail(email) {
  const adminEmailEnv = process.env.ADMIN_EMAIL;
  if (!adminEmailEnv || typeof adminEmailEnv !== 'string') {
    return false; // Fail closed if missing
  }
  const cleanConfigured = normalizeEmail(adminEmailEnv);
  if (!cleanConfigured || !cleanConfigured.includes('@')) {
    return false; // Fail closed if invalid email format
  }
  const cleanUser = normalizeEmail(email);
  if (!cleanUser) return false;
  return cleanUser === cleanConfigured;
}

/**
 * Hash password with PBKDF2 and a random salt
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify password against stored hash using timing-safe comparison
 */
function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalDerived] = parts;
  const testDerived = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const bufOriginal = Buffer.from(originalDerived, 'hex');
  const bufTest = Buffer.from(testDerived, 'hex');
  if (bufOriginal.length !== bufTest.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufTest);
}

/**
 * Find user by normalized email
 */
export function findUserByEmail(email) {
  const clean = normalizeEmail(email);
  if (!clean) return null;
  usersStore = loadJSON(USERS_PATH, usersStore);
  return usersStore.find(u => normalizeEmail(u.email) === clean) || null;
}

/**
 * Find user by ID
 */
export function findUserById(id) {
  if (!id) return null;
  usersStore = loadJSON(USERS_PATH, usersStore);
  return usersStore.find(u => u.id === id) || null;
}

/**
 * Register a new candidate user.
 * Note: Role is ALWAYS 'user'. Public registration CANNOT grant administrator roles.
 */
export function registerUser({ email, password, name }) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('A valid email address is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    email: cleanEmail,
    name: (name && typeof name === 'string' && name.trim()) ? name.trim() : 'Candidate',
    passwordHash: hashPassword(password),
    role: 'user', // Invariant: Public registration never assigns admin role
    createdAt: new Date().toISOString()
  };

  usersStore.push(user);
  saveJSON(USERS_PATH, usersStore);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: isConfiguredAdminEmail(user.email),
    createdAt: user.createdAt
  };
}

/**
 * Authenticate credentials and return user details (never returning password hash)
 */
export function authenticateCredentials({ email, password }) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !password) return null;

  const user = findUserByEmail(cleanEmail);
  if (!user) return null;

  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: isConfiguredAdminEmail(user.email),
    createdAt: user.createdAt
  };
}

/**
 * Create a secure session token
 */
export function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const session = {
    token,
    userId: user.id,
    email: user.email,
    createdAt: new Date(now).toISOString(),
    expiresAt
  };

  sessionsStore = loadJSON(SESSIONS_PATH, sessionsStore);
  // Keep active sessions bounded
  sessionsStore = sessionsStore.filter(s => new Date(s.expiresAt) > new Date());
  sessionsStore.push(session);
  saveJSON(SESSIONS_PATH, sessionsStore);

  return {
    token,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: isConfiguredAdminEmail(user.email)
    }
  };
}

/**
 * Validate a session token and return the associated user
 */
export function validateSession(token) {
  if (!token || typeof token !== 'string') return null;

  sessionsStore = loadJSON(SESSIONS_PATH, sessionsStore);
  const session = sessionsStore.find(s => s.token === token);
  if (!session) return null;

  // Check expiration
  if (new Date(session.expiresAt) <= new Date()) {
    destroySession(token);
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: isConfiguredAdminEmail(user.email)
  };
}

/**
 * Destroy a session on logout
 */
export function destroySession(token) {
  if (!token) return;
  sessionsStore = loadJSON(SESSIONS_PATH, sessionsStore);
  sessionsStore = sessionsStore.filter(s => s.token !== token);
  saveJSON(SESSIONS_PATH, sessionsStore);
}

/**
 * Helper to parse cookies from request headers
 */
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader || typeof cookieHeader !== 'string') return cookies;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

/**
 * Extract session token from request (Bearer header, Cookie, or query)
 */
export function extractSessionToken(req) {
  // 1. Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  // 2. Cookie ja_session=<token>
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.ja_session) {
    return cookies.ja_session;
  }
  // 3. Header x-session-token
  if (req.headers['x-session-token']) {
    return req.headers['x-session-token'];
  }
  return null;
}
