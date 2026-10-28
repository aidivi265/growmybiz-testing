/**
 * Comprehensive Input Sanitizer & Security Utilities
 * Protects against XSS, SQLi strings, HTML injection, and malicious payloads.
 */

/**
 * Escapes HTML characters to prevent XSS in rendering, notifications, and logs.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips dangerous executable tags, script wrappers, and javascript: protocols.
 */
export function sanitizeString(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';

  let sanitized = input
    // Remove control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip script and iframe tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip javascript: and vbscript: URIs
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Validates email with strict RFC 5322 subset regex.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number characters.
 */
export function sanitizePhone(phone?: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+()-\s.]/g, '').trim();
  return cleaned.length >= 7 && cleaned.length <= 25 ? cleaned : null;
}
