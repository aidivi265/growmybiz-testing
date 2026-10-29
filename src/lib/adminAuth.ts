import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'gmb_admin_session';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  'growmybizz_super_secret_session_key_2025_prod_secure';

if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_SESSION_SECRET) {
  console.warn('[SECURITY WARNING] ADMIN_SESSION_SECRET is missing. Set a secure 32+ character random secret in production.');
}

/**
 * Single Master Admin ID and Password verification.
 * Uses timing-safe string comparison to prevent side-channel timing attacks.
 * Configured via ADMIN_USERNAME and ADMIN_PASSWORD environment variables.
 */
export function verifyAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const configuredUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const configuredPass = (process.env.ADMIN_PASSWORD || 'growmybizz2025').trim();

  const userClean = username.trim().toLowerCase();
  const passClean = password.trim();

  // Match either exact username or handle (e.g. "admin" or "admin@growmybizz.com")
  const isUserValid =
    userClean === configuredUser ||
    userClean === `${configuredUser}@growmybizz.com` ||
    (userClean.includes('@') && userClean.split('@')[0] === configuredUser);

  if (!isUserValid) return false;

  const bPassInput = Buffer.from(passClean);
  const bExpected = Buffer.from(configuredPass);
  if (bPassInput.length !== bExpected.length) return false;

  return crypto.timingSafeEqual(bPassInput, bExpected);
}

interface SessionPayload {
  username: string;
  exp: number; // Expiration epoch in ms
}

/**
 * Generate a cryptographically signed HMAC token for the session cookie
 */
export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Validate an incoming session token and check signature & expiration
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || !token.includes('.')) return false;

  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedSigBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
  ) {
    return false;
  }

  try {
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(payloadJson);
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
