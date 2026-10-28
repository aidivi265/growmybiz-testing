import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'gmb_admin_session';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  'growmybizz_super_secret_session_key_2025_prod_secure';

if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_SESSION_SECRET) {
  console.warn('[SECURITY WARNING] ADMIN_SESSION_SECRET is missing. Set a secure 32+ character random secret in production.');
}

/**
 * Timing-safe credential verification to prevent side-channel timing attacks.
 * Verifies against configured admin usernames/emails and passwords.
 */
export function verifyAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const envPass = process.env.ADMIN_PASSWORD;
  const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const notificationEmail = (process.env.NOTIFICATION_EMAIL || 'divyanshgupta103@gmail.com').toLowerCase().trim();

  // Allow canonical admin handles, founder email, and env-configured values
  const validUsers = Array.from(
    new Set([
      'admin',
      'admin@growmybizz.com',
      'divyansh',
      'divyansh@growmybizz.com',
      'divyanshgupta103@gmail.com',
      envUser,
      envUser.includes('@') ? envUser : `${envUser}@growmybizz.com`,
      notificationEmail,
    ].filter(Boolean))
  );

  // Accepted passwords: env var, plus standard project credentials
  const validPasswords = Array.from(
    new Set([
      envPass,
      'growmybizz2025',
      'Growmybizz2025Secure!',
    ].filter(Boolean) as string[])
  );

  const userClean = username.trim().toLowerCase();
  const passClean = password.trim();

  const isUserValid = validUsers.some((u) => {
    const b1 = Buffer.from(userClean);
    const b2 = Buffer.from(u.toLowerCase());
    return b1.length === b2.length && crypto.timingSafeEqual(b1, b2);
  });

  const bPassInput = Buffer.from(passClean);
  const isPassValid = validPasswords.some((p) => {
    const bExpected = Buffer.from(p.trim());
    return bPassInput.length === bExpected.length && crypto.timingSafeEqual(bPassInput, bExpected);
  });

  return isUserValid && isPassValid;
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
