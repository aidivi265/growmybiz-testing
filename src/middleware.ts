import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── 1. Known Aggressive Scrapers & Bad Bots ──────────────────────────────────
const BANNED_SCRAPER_USER_AGENTS = [
  'bytespider',
  'gptbot',
  'chatgpt-user',
  'ccbot',
  'anthropic-ai',
  'claude-web',
  'claudebot',
  'diffbot',
  'cohere-ai',
  'omgili',
  'scrapy',
  'python-requests',
  'python-urllib',
  'beautifulsoup',
  'aiohttp',
  'httpx',
  'libwww-perl',
  'phantomjs',
  'selenium',
  'puppeteer',
  'playwright',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'dotbot',
  'zoominfobot',
  'megaindex',
  'seekport',
  'petalbot',
  'curl/',
  'wget/',
  'go-http-client',
  'apache-httpclient',
];

// In-Memory sliding-window rate limit store for edge requests
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

/**
 * Multi-Tier Edge Rate Limiter
 * Queries Supabase atomic PostgreSQL check_rate_limit RPC with a strict 1200ms edge timeout budget,
 * falling back seamlessly to in-memory sliding window cache if unconfigured, offline, or timed out.
 */
async function isRateLimitedEdge(key: string, limit: number, windowMs: number): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/check_rate_limit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          p_key: key,
          p_limit: limit,
          p_window_ms: windowMs,
        }),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.success === 'boolean') {
          return !data.success;
        }
      }
    } catch {
      // Supabase RPC unavailable or timed out; fall back to in-memory tier
    }
  }

  return isRateLimited(key, limit, windowMs);
}

// ── Web Crypto HMAC Session Verifier for Edge Middleware ──────────────────────
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  'growmybizz_super_secret_session_key_2025_prod_secure';

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function verifyAdminSessionEdge(token?: string | null): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return false;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToUint8Array(signature);
    const dataBytes = enc.encode(payloadBase64);

    const isSigValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as BufferSource,
      dataBytes as BufferSource
    );
    if (!isSigValid) return false;

    // Verify expiration timestamp
    const payloadBytes = base64UrlToUint8Array(payloadBase64);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson);

    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // ── 2. Anti-Scraping Bot Firewall ──────────────────────────────────────────
  const isScraper = BANNED_SCRAPER_USER_AGENTS.some((bot) => userAgent.includes(bot));
  if (isScraper) {
    // If it's an API route or unauthorized automated scraper, block with 403
    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden: Automated data scraping and unauthorized bot harvesting is prohibited on this domain.',
        code: 'BOT_SCRAPER_BLOCKED',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        },
      }
    );
  }

  // ── 3. CSRF & Origin Validation for Mutating API Requests ──────────────────
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin') || '';
    const host = request.headers.get('host') || '';

    // Allow requests from same host, vercel preview deployments, or local development
    const isAllowedOrigin =
      !origin ||
      origin.includes(host) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('growmybiz24') ||
      origin.includes('.vercel.app') ||
      origin.includes('growmybizz.com');

    if (!isAllowedOrigin) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Cross-site request forgery verification failed.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  // ── 4. Edge Rate Limiting ──────────────────────────────────────────────────
  // Contact Form: 5 requests per 10 minutes per IP
  if (pathname === '/api/contact' && request.method === 'POST') {
    if (await isRateLimitedEdge(`contact_${ip}`, 5, 10 * 60 * 1000)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many submissions from this IP. Please wait a few minutes before submitting another inquiry.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '600',
          },
        }
      );
    }
  }

  // Admin Login: 6 attempts per 15 minutes per IP
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    if (await isRateLimitedEdge(`admin_login_${ip}`, 6, 15 * 60 * 1000)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many failed login attempts. Account temporarily throttled for 15 minutes.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900',
          },
        }
      );
    }
  }

  // ── 5. Admin Dashboard Edge Route Gate ─────────────────────────────────────
  if (pathname.startsWith('/admin/dashboard') || pathname === '/admin') {
    const sessionCookie = request.cookies.get('gmb_admin_session')?.value;
    const isValid = await verifyAdminSessionEdge(sessionCookie);
    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname.startsWith('/admin/dashboard')) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      const redirectResponse = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        redirectResponse.cookies.delete('gmb_admin_session');
      }
      return redirectResponse;
    }
  }

  // If already authenticated and visiting login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('gmb_admin_session')?.value;
    if (sessionCookie && (await verifyAdminSessionEdge(sessionCookie))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // ── 6. Protected Admin APIs Edge Gate ──────────────────────────────────────
  if (
    pathname.startsWith('/api/admin/') &&
    pathname !== '/api/admin/login' &&
    pathname !== '/api/admin/logout'
  ) {
    const sessionCookie = request.cookies.get('gmb_admin_session')?.value;
    const isValid = await verifyAdminSessionEdge(sessionCookie);
    if (!isValid) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired admin session token.' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      );
    }
  }

  // ── 7. Inject Security Headers on All Outgoing Responses ───────────────────
  const response = NextResponse.next();

  // Anti-indexing & scraping protection for sensitive paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon, icons, images
     */
    '/((?!_next/static|_next/image|favicon.ico|brand-logo.*|icon.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
