import { NextResponse } from 'next/server';
import { generateReceiptId, generateClientAccessToken, saveProject, generateDefaultQuotation } from '@/lib/projectStore';
import type { ProjectRecord } from '@/types/project';
import { sanitizeString, escapeHtml, isValidEmail, sanitizePhone } from '@/lib/sanitizer';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    // 1. Content-Length Protection (Max 50KB to block payload flooding)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 51200) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum 50KB allowed.' },
        { status: 413 }
      );
    }

    // 2. IP Rate Limiting (5 project submissions per 10 minutes)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`project_submit_${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a few minutes before submitting another project.' },
        {
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString() },
        }
      );
    }

    const body = await request.json();

    // 3. Cloudflare Turnstile Bot Verification
    const clientToken = body.turnstileToken || request.headers.get('cf-turnstile-response');
    const botCheck = await verifyTurnstileToken(clientToken, ip);
    if (!botCheck.success) {
      return NextResponse.json(
        { error: botCheck.error || 'Bot verification failed. Please complete the security check.' },
        { status: 403 }
      );
    }

    // 3. Silent Honeypot Bot Trap
    if (body._hp && body._hp.trim().length > 0) {
      console.warn('[SECURITY] Bot honeypot triggered on project intake from IP:', ip);
      return NextResponse.json({
        success: true,
        receiptId: 'GMB-PRJ-2026-0000',
        message: 'Project requirement received.',
      });
    }

    // 4. Strict Server-Side Validation & Sanitization
    const cleanName = sanitizeString(body.clientName, 100);
    const cleanEmail = (body.clientEmail || '').trim().toLowerCase();
    const cleanPhone = sanitizePhone(body.clientPhone);
    const cleanCompany = sanitizeString(body.companyName, 100) || cleanName;

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please provide your full name (at least 2 characters).' }, { status: 400 });
    }
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Please provide a valid work email address.' }, { status: 400 });
    }

    const receiptId = generateReceiptId();
    const clientAccessToken = generateClientAccessToken();
    const now = new Date().toISOString();

    const newProject: ProjectRecord = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      receiptId,
      clientAccessToken,
      createdAt: now,
      updatedAt: now,
      clientName: cleanName,
      clientEmail: cleanEmail,
      clientPhone: cleanPhone || 'Not provided',
      companyName: cleanCompany,
      city: sanitizeString(body.city, 50) || 'Not specified',
      country: sanitizeString(body.country, 50) || 'India',
      serviceCategory: sanitizeString(body.serviceCategory, 50) || 'web-app-development',
      serviceTitle: sanitizeString(body.serviceTitle, 100) || 'Web Application & Software Development',
      primaryGoal: sanitizeString(body.primaryGoal, 1000) || 'Digital business growth and modernization',
      inspirationUrls: Array.isArray(body.inspirationUrls)
        ? body.inspirationUrls.map((u: string) => sanitizeString(u, 255)).filter(Boolean)
        : [],
      projectScale: sanitizeString(body.projectScale, 100) || 'Standard Scope',
      featureWishlist: Array.isArray(body.featureWishlist)
        ? body.featureWishlist.map((f: string) => sanitizeString(f, 100)).filter(Boolean)
        : [],
      integrations: Array.isArray(body.integrations)
        ? body.integrations.map((i: string) => sanitizeString(i, 100)).filter(Boolean)
        : [],
      technicalNotes: sanitizeString(body.technicalNotes, 2000) || '',
      budgetRange: sanitizeString(body.budgetRange, 100) || '₹50,000 – ₹1,50,000',
      currency: 'INR',
      targetTimeline: sanitizeString(body.targetTimeline, 100) || 'Standard (3–5 weeks)',
      urgencyLevel: sanitizeString(body.urgencyLevel, 50) || 'Standard',
      assetsReady: {
        logo: !!body.assetsReady?.logo,
        copy: !!body.assetsReady?.copy,
        photos: !!body.assetsReady?.photos,
        domain: !!body.assetsReady?.domain,
        otherNotes: sanitizeString(body.assetsReady?.otherNotes, 500) || '',
      },
      status: 'under_review',
    };

    // Auto-generate AI/smart quotation draft
    newProject.quotation = generateDefaultQuotation(newProject);

    await saveProject(newProject);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 [NEW PROJECT INTAKE SAVED TO SUPABASE]`);
    console.log(`📋 Receipt ID: ${receiptId}`);
    console.log(`👤 Client:     ${newProject.clientName} (${newProject.companyName})`);
    console.log(`✉️ Email:      ${newProject.clientEmail}`);
    console.log(`🔑 Access Token: [PROTECTED]`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return NextResponse.json({
      success: true,
      receiptId,
      token: clientAccessToken,
      message: 'Project requirement successfully submitted. Review in progress.',
    });
  } catch (error: any) {
    console.error('Error submitting project:', error);
    return NextResponse.json(
      { error: 'Failed to record project requirement. Please try again.' },
      { status: 500 }
    );
  }
}
