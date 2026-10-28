import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Please enter both username/email and password.' },
        { status: 400 }
      );
    }

    // Slight throttling against brute-force
    await new Promise((r) => setTimeout(r, 200));

    // Normalize email (if "admin" is passed, map to "admin@growmybizz.com")
    const loginEmail = username.includes('@')
      ? username.trim().toLowerCase()
      : `${username.trim().toLowerCase()}@growmybizz.com`;

    let authenticated = false;
    let authUser: { email?: string; id?: string; role?: string } | null = null;
    let authProvider = 'env';

    // 1. Attempt Supabase Auth Server-Side Verification
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

    // 2. Timing-Safe Fallback Verification
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
        { status: 401 }
      );
    }

    // 3. Issue Cryptographic HMAC Session Cookie
    const token = createSessionToken(loginEmail);
    const cookieStore = await cookies();

    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isHttps = request.url.startsWith('https://') || forwardedProto === 'https';

    const cookieOptions = {
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    cookieStore.set(cookieOptions);

    const response = NextResponse.json({
      success: true,
      provider: authProvider,
      user: authUser,
    });

    response.cookies.set(cookieOptions);

    return response;
  } catch (err) {
    console.error('Admin authentication error:', err);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
