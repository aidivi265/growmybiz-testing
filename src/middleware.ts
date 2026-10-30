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

export function middleware(request: NextRequest) {
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
    if (isRateLimited(`contact_${ip}`, 5, 10 * 60 * 1000)) {
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
    if (isRateLimited(`admin_login_${ip}`, 6, 15 * 60 * 1000)) {
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
  if (pathname.startsWith('/admin/dashboard')) {
    const sessionCookie = request.cookies.get('gmb_admin_session')?.value;
    if (!sessionCookie || !sessionCookie.includes('.')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 6. Inject Security Headers on All Outgoing Responses ───────────────────
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
