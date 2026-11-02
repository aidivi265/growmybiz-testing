import { NextResponse } from 'next/server';
import { requestProjectOtp, verifyProjectOtp, getProjectByReceiptId, verifyProjectAuthorization } from '@/lib/projectStore';
import { checkRateLimit } from '@/lib/rateLimit';
import { isValidEmail, sanitizeString } from '@/lib/sanitizer';

export async function POST(
  request: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await context.params;
    if (!receiptId) {
      return NextResponse.json({ error: 'Receipt ID is required.' }, { status: 400 });
    }

    // IP Rate Limiting (10 authentication requests per 15 minutes)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`project_auth_${ip}_${receiptId}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const action = sanitizeString(body.action, 50);

    // ─── ACTION 1: Request 6-digit OTP code ─────────────────────────────
    if (action === 'request_otp') {
      const email = sanitizeString(body.email, 250).toLowerCase();
      if (!email || !isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid client work email address.' },
          { status: 400 }
        );
      }

      const result = await requestProjectOtp(receiptId, email);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to request verification code.' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'A 6-digit security code has been generated for your project.',
        expiresAt: result.expiresAt,
        devOtp: result.devOtp, // Returned only in development for effortless testing
      });
    }

    // ─── ACTION 2: Verify 6-digit OTP code ──────────────────────────────
    if (action === 'verify_otp') {
      const email = sanitizeString(body.email, 250).toLowerCase();
      const code = sanitizeString(body.code, 10);

      if (!email || !code || code.length !== 6) {
        return NextResponse.json(
          { error: 'Please provide your client email and the 6-digit verification code.' },
          { status: 400 }
        );
      }

      const result = await verifyProjectOtp(receiptId, email, code);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Invalid verification code.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        token: result.token,
        message: 'Client authenticated successfully.',
      });
    }

    // ─── ACTION 3: Verify direct secret token ───────────────────────────
    if (action === 'verify_token') {
      const token = sanitizeString(body.token, 100);
      if (!token) {
        return NextResponse.json({ error: 'Secret token is required.' }, { status: 400 });
      }

      const project = await getProjectByReceiptId(receiptId);
      if (!project) {
        return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
      }

      const isAuthorized = verifyProjectAuthorization(project, token);
      if (!isAuthorized) {
        return NextResponse.json({ error: 'Invalid secret access token.' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        token,
        message: 'Token verified.',
      });
    }

    return NextResponse.json({ error: 'Invalid authentication action specified.' }, { status: 400 });
  } catch (err: any) {
    console.error('[PROJECT AUTH ROUTE ERROR]', err);
    return NextResponse.json({ error: 'Server error processing authentication.' }, { status: 500 });
  }
}
