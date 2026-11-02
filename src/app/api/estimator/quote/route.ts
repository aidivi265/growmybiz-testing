import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sanitizeString, isValidEmail, sanitizePhone } from '@/lib/sanitizer';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    // 1. Payload size check (Max 25KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 25600) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    }

    // 2. IP Rate Limiting (5 quotes per 10 minutes)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`estimator_quote_${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a few minutes before submitting another quote request.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      notes,
      turnstileToken,
      estimateDetails,
    } = body;

    // 3. Bot Protection via Cloudflare Turnstile
    const clientToken = turnstileToken || request.headers.get('cf-turnstile-response');
    const botCheck = await verifyTurnstileToken(clientToken, ip);
    if (!botCheck.success) {
      return NextResponse.json(
        { error: botCheck.error || 'Security verification failed. Please check the captcha.' },
        { status: 403 }
      );
    }

    // 4. Validate & Sanitize Client Contact Info
    const cleanName = sanitizeString(name, 100);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = sanitizePhone(phone);
    const cleanCompany = sanitizeString(company, 120);
    const cleanNotes = sanitizeString(notes, 1500);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!isValidEmail(cleanEmail) && !cleanPhone) {
      return NextResponse.json(
        { error: 'Please provide either a valid email address or phone/WhatsApp number.' },
        { status: 400 }
      );
    }

    if (!estimateDetails || typeof estimateDetails !== 'object') {
      return NextResponse.json({ error: 'Estimate breakdown details are required.' }, { status: 400 });
    }

    // 5. Generate Official Quotation ID
    const quoteId = `EST-${Math.floor(100000 + Math.random() * 900000)}`;

    const {
      categoryTitle = 'Digital Project',
      platformTitle = 'Custom Solution',
      tierTitle = 'Custom UI/UX',
      selectedFeatureTitles = [],
      timelineTitle = 'Standard Cadence',
      estimatedMin = 0,
      estimatedMax = 0,
      currency = 'INR',
      currencySymbol = '₹',
    } = estimateDetails;

    const budgetFormatted = `${currencySymbol}${Number(estimatedMin).toLocaleString()} - ${currencySymbol}${Number(estimatedMax).toLocaleString()} ${currency}`;

    // Construct structured specification memo for admin lead tracking
    const featureListFormatted = Array.isArray(selectedFeatureTitles) && selectedFeatureTitles.length > 0
      ? selectedFeatureTitles.map((f: string) => `  • ${f}`).join('\n')
      : '  • Core Base Deliverables';

    const fullMessage = [
      `=== OFFICIAL SCOPE & INVESTMENT ESTIMATE ===`,
      `Quote ID: ${quoteId}`,
      `Category: ${categoryTitle}`,
      `Platform: ${platformTitle}`,
      `Design Tier: ${tierTitle}`,
      `Delivery Timeline: ${timelineTitle}`,
      `Investment Range: ${budgetFormatted}`,
      ``,
      `Selected Modules (${selectedFeatureTitles.length}):`,
      featureListFormatted,
      ``,
      `Client Project Notes:`,
      cleanNotes || 'No special requirements specified.',
    ].join('\n');

    // 6. Save to Supabase inquiries
    try {
      await supabaseAdmin.from('inquiries').insert([
        {
          name: cleanName,
          email: cleanEmail || 'not-provided@client.com',
          phone: cleanPhone || '',
          company: cleanCompany || 'Individual / Startup',
          service: `[${quoteId}] ${platformTitle} (${tierTitle})`,
          budget: budgetFormatted,
          timeline: timelineTitle,
          message: fullMessage,
          status: 'new',
          notes: JSON.stringify({
            quoteId,
            source: 'interactive_estimator',
            estimateDetails,
            submittedAt: new Date().toISOString(),
          }),
        },
      ]);
    } catch (dbErr) {
      console.warn('[Estimator DB Warning]: Failed to insert inquiry record:', dbErr);
    }

    // 7. Generate instant WhatsApp pre-filled action link
    const adminWhatsApp = (process.env.ADMIN_WHATSAPP_NUMBER || '917290884480').replace(/[^0-9]/g, '');
    const clientWaNumber = adminWhatsApp.length === 10 ? `91${adminWhatsApp}` : adminWhatsApp;

    const waText = encodeURIComponent(
      `Hi Growmybiz24! I just locked in a project estimate on your website.\n\n` +
      `📄 Quote Ref: ${quoteId}\n` +
      `🛠️ Project: ${platformTitle} (${tierTitle})\n` +
      `💰 Investment: ${budgetFormatted}\n` +
      `⏱️ Timeline: ${timelineTitle}\n` +
      `👤 Name: ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ''}\n\n` +
      `Can we review this scope together?`
    );

    const whatsappUrl = `https://wa.me/${clientWaNumber}?text=${waText}`;

    return NextResponse.json({
      success: true,
      quoteId,
      message: 'Estimate locked in successfully! Our leadership team will review your scope.',
      whatsappUrl,
      estimateDetails: {
        ...estimateDetails,
        quoteId,
        budgetFormatted,
      },
    });
  } catch (error: any) {
    console.error('Estimator quote submission error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit estimate. Please try again.' },
      { status: 500 }
    );
  }
}
