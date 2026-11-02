/**
 * Cloudflare Turnstile Server-Side Bot Verification
 * 
 * Validates the Turnstile challenge response token against Cloudflare's
 * siteverify API endpoint. Blocks automated scrapers, headless spam bots,
 * and form spammers with zero friction or puzzle solving for real humans.
 */

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(
  token?: string | null,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY ||
    // Official Cloudflare testing secret (always passes in development)
    (process.env.NODE_ENV !== 'production'
      ? '1x0000000000000000000000000000000AA'
      : '');

  // If Turnstile is unconfigured in production environment, log notice and permit fallback
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[SECURITY NOTICE] TURNSTILE_SECRET_KEY is not configured in environment. Skipping Turnstile gate.'
      );
    }
    return { success: true };
  }

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    // If running in development without a token, allow test pass
    if (process.env.NODE_ENV !== 'production') {
      return { success: true };
    }
    return {
      success: false,
      error: 'Security verification token is missing. Please complete the verification.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (remoteIp && remoteIp !== '127.0.0.1') {
      formData.append('remoteip', remoteIp);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout budget

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('[SECURITY] Turnstile siteverify responded with HTTP status:', res.status);
      return { success: false, error: 'Verification service error. Please try again.' };
    }

    const data: TurnstileVerifyResponse = await res.json();

    if (data.success) {
      return { success: true };
    }

    console.warn('[SECURITY] Turnstile verification failed. Error codes:', data['error-codes']);
    return {
      success: false,
      error: 'Bot verification failed. Please reload the page and try again.',
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      console.warn('[SECURITY] Turnstile siteverify timed out after 4s.');
    } else {
      console.error('[SECURITY] Error contacting Turnstile siteverify:', err);
    }

    // Fail open in case of network anomaly so legitimate clients are never blocked
    return { success: true };
  }
}
