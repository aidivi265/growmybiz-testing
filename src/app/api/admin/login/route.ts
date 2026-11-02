import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Content-Length Limit (Max 5KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 5120) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    }

    // 2. Defense-in-depth IP Rate Limiting (6 attempts per 15 mins)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`admin_login_${ip}`, {
      limit: 6,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please wait 15 minutes.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString(),
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Please enter both username/email and password.' },
        { status: 400 }
      );
    }

    // Anti-timing analysis artificial delay (200-300ms)
    await new Promise((r) => setTimeout(r, 250));

    // Normalize email (if "admin" is passed, map to "admin@growmybiz24.com")
    const loginEmail = username.includes('@')
      ? username.trim().toLowerCase()
      : `${username.trim().toLowerCase()}@growmybiz24.com`;

    let authenticated = false;
    let authUser: { email?: string; id?: string; role?: string } | null = null;
    let authProvider = 'env';

    // 3. Attempt Supabase Auth Server-Side Verification
    try {
      const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password.trim(),
      });

      if (!supaError && supaData?.user) {
        authenticated = true;
        authProvider = 'supabase';
        authUser = {
          id: supaData.user.id,
          email: supaData.user.email,
          role: (supaData.user.user_metadata?.role as string) || 'admin',
        };
      }
    } catch {
      // Fall through to fallback
    }

    // 4. Timing-Safe Fallback Verification
    if (!authenticated) {
      const isEnvValid =
        verifyAdminCredentials(username, password) ||
        verifyAdminCredentials(loginEmail, password);

      if (isEnvValid) {
        authenticated = true;
        authProvider = 'environment';
        authUser = {
          email: loginEmail,
          role: 'admin',
        };
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email/username and password.' },
        {
          status: 401,
          headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
        }
      );
    }

    // 5. Issue Cryptographic HMAC Session Cookie
    const token = createSessionToken(loginEmail);
    const cookieStore = await cookies();

    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isHttps = request.url.startsWith('https://') || forwardedProto === 'https';

    const cookieOptions = {
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'strict' as const, // Strict CSRF protection
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    cookieStore.set(cookieOptions);

    const response = NextResponse.json(
      {
        success: true,
        provider: authProvider,
        user: authUser,
      },
      {
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );

    response.cookies.set(cookieOptions);
    return response;
  } catch (err) {
    console.error('Login route unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
