import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sanitizeString, escapeHtml, isValidEmail, sanitizePhone } from '@/lib/sanitizer';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    // 1. Content-Length Limit (Max 25KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 25600) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum 25KB allowed.' },
        { status: 413 }
      );
    }

    // 2. IP Rate Limiting (5 requests per 10 minutes)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`inquiry_api_${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a few minutes before submitting another inquiry.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, service, message, _hp, turnstileToken } = body;

    // 3. Cloudflare Turnstile Bot Verification
    const clientToken = turnstileToken || request.headers.get('cf-turnstile-response');
    const botCheck = await verifyTurnstileToken(clientToken, ip);
    if (!botCheck.success) {
      return NextResponse.json(
        { error: botCheck.error || 'Bot verification failed. Please complete the security check.' },
        { status: 403 }
      );
    }

    // 3. Silent Honeypot Trap
    if (_hp && _hp.trim().length > 0) {
      console.warn('[SECURITY] Bot honeypot triggered on inquiry from IP:', ip);
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    const cleanName = sanitizeString(name, 100);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = sanitizePhone(phone);
    const cleanService = sanitizeString(service, 100) || 'General Inquiry';
    const cleanMessage = sanitizeString(message, 3000) || 'Interested in discussing a project.';

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please enter your name (at least 2 characters).' }, { status: 400 });
    }
    if (!isValidEmail(cleanEmail) && !cleanPhone) {
      return NextResponse.json(
        { error: 'Please provide either a valid email address or phone/WhatsApp number.' },
        { status: 400 }
      );
    }

    // Persist to Supabase inquiries table
    try {
      await supabaseAdmin.from('inquiries').insert([
        {
          name: cleanName,
          email: cleanEmail || 'not-provided@client.com',
          phone: cleanPhone || '',
          company: 'Quick Web Inquiry',
          service: cleanService,
          budget: 'Undisclosed',
          timeline: 'Immediate Discussion',
          message: cleanMessage,
          status: 'new',
        },
      ]);
    } catch (dbErr) {
      console.warn('Inquiries Supabase insert notice:', dbErr);
    }

    // WhatsApp direct action link
    const adminWhatsApp = (process.env.ADMIN_WHATSAPP_NUMBER || '917290884480').replace(/[^0-9]/g, '');
    const clientText = encodeURIComponent(
      `Hi Growmybiz24 team! I have a quick inquiry.\n\n👤 Name: ${cleanName}\n🛠️ Service: ${cleanService}\n💬 Message: ${cleanMessage.slice(0, 150)}`
    );
    const whatsappActionUrl = `https://wa.me/${adminWhatsApp.length === 10 ? '91' + adminWhatsApp : adminWhatsApp}?text=${clientText}`;

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. Our team will connect with you right away.',
      whatsappActionUrl,
    });
  } catch (error: any) {
    console.error('Quick inquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
