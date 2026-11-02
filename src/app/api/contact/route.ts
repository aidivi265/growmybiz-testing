import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sanitizeString, escapeHtml, isValidEmail, sanitizePhone } from '@/lib/sanitizer';
import { checkRateLimit } from '@/lib/rateLimit';

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  _hp?: string; // Honeypot field for bot suppression
}

export async function POST(request: Request) {
  try {
    // 1. Content-Length Limit (Max 50KB to block payload flooding attacks)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 51200) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum 50KB allowed.' },
        { status: 413 }
      );
    }

    // 2. Defense-in-depth IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(`contact_api_${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000, // 5 requests per 10 minutes
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a few minutes before submitting another inquiry.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        }
      );
    }

    const body: ContactPayload = await request.json();
    const { name, email, phone, company, service, budget, timeline, message, _hp } = body;

    // 3. Silent Honeypot Bot Trap: If honeypot is filled, simulate success but drop payload
    if (_hp && _hp.trim().length > 0) {
      console.warn('[SECURITY] Bot honeypot triggered from IP:', ip);
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // 4. Strict Server-Side Validation & Sanitization
    const cleanName = sanitizeString(name, 100);
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail) || cleanEmail.endsWith('@phone.growmybiz24.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanMessage = sanitizeString(message, 5000);
    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json(
        { error: 'Please provide a brief message describing your project (at least 5 characters).' },
        { status: 400 }
      );
    }

    const cleanPhone = sanitizePhone(phone);
    const cleanCompany = company ? sanitizeString(company, 100) : null;
    const cleanService = service ? sanitizeString(service, 50) : 'General Inquiry';
    const cleanBudget = budget ? sanitizeString(budget, 50) : 'Not specified';
    const cleanTimeline = timeline ? sanitizeString(timeline, 50) : 'Not specified';

    const sanitizedLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      receivedAt: new Date().toISOString(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      company: cleanCompany,
      service: cleanService,
      budget: cleanBudget,
      timeline: cleanTimeline,
      message: cleanMessage,
    };

    let adminWhatsAppNumber = (process.env.ADMIN_WHATSAPP_NUMBER || '917290884480').replace(/[^0-9]/g, '');
    if (adminWhatsAppNumber.length === 10) {
      adminWhatsAppNumber = `91${adminWhatsAppNumber}`;
    }
    const cleanClientPhone = sanitizedLead.phone ? sanitizedLead.phone.replace(/[^0-9]/g, '') : '';

    // Direct WhatsApp URLs
    const clientToAgencyWhatsAppText = encodeURIComponent(
      `Hi Growmybiz24 team, I just submitted an inquiry on your website!\n\n` +
      `👤 Name: ${sanitizedLead.name}\n` +
      `🛠️ Service: ${sanitizedLead.service}\n` +
      `💰 Budget: ${sanitizedLead.budget}\n` +
      `💬 Message: ${sanitizedLead.message.slice(0, 140)}${sanitizedLead.message.length > 140 ? '...' : ''}`
    );
    const clientToAgencyWhatsAppUrl = `https://wa.me/${adminWhatsAppNumber}?text=${clientToAgencyWhatsAppText}`;

    const agencyToClientWhatsAppUrl = cleanClientPhone.length >= 10
      ? `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(`Hi ${sanitizedLead.name}, thank you for reaching out to Growmybiz24 regarding ${sanitizedLead.service}! We received your project brief and would love to assist you.`)}`
      : clientToAgencyWhatsAppUrl;

    // 5. Structured Server Logging (safe strings)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 [NEW CLIENT INQUIRY CAPTURED]');
    console.log(`👤 Name:       ${sanitizedLead.name}`);
    console.log(`✉️ Email:      ${sanitizedLead.email}`);
    console.log(`📞 Phone:      ${sanitizedLead.phone ?? 'N/A'}`);
    console.log(`🏢 Company:    ${sanitizedLead.company ?? 'N/A'}`);
    console.log(`🛠️ Service:    ${sanitizedLead.service}`);
    console.log(`💰 Budget:     ${sanitizedLead.budget}`);
    console.log(`⏱️ Timeline:   ${sanitizedLead.timeline}`);
    console.log(`💬 Message:    ${sanitizedLead.message.slice(0, 80)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 6. Persistent Database Storage in Supabase
    let supabasePersisted = false;
    try {
      const { data: supaLead, error: dbError } = await supabaseAdmin
        .from('inquiries')
        .insert([
          {
            name: sanitizedLead.name,
            email: sanitizedLead.email,
            phone: sanitizedLead.phone,
            company: sanitizedLead.company,
            service: sanitizedLead.service,
            budget: sanitizedLead.budget,
            timeline: sanitizedLead.timeline,
            message: sanitizedLead.message,
            status: 'new',
          },
        ])
        .select('id')
        .single();

      if (dbError) {
        console.warn('Supabase inquiries insert notice:', dbError.message);
      } else if (supaLead?.id) {
        supabasePersisted = true;
        console.log(`✅ Lead persisted to Supabase inquiries table (ID: ${supaLead.id})`);
      }
    } catch (dbErr) {
      console.warn('Supabase DB insertion exception:', dbErr);
    }

    // 7. Multi-Tier Persistence Fallback: Cloud KV Backup in Supabase page_content
    if (!supabasePersisted) {
      try {
        const backupKey = `inquiry_backup_${sanitizedLead.id}`;
        const { error: kvError } = await supabaseAdmin
          .from('page_content')
          .upsert({
            id: backupKey,
            data: {
              ...sanitizedLead,
              status: 'new',
              created_at: sanitizedLead.receivedAt,
            },
            updated_at: new Date().toISOString(),
          });

        if (!kvError) {
          supabasePersisted = true;
          console.log(`✅ Lead persisted to Supabase cloud KV backup (Key: ${backupKey})`);
        } else {
          console.warn('Cloud KV backup insert notice:', kvError.message);
        }
      } catch (kvErr) {
        console.warn('Cloud KV backup exception:', kvErr);
      }
    }

    // Local Disk Fallback (Only in local development, safely skipped on Vercel serverless)
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      try {
        const storageDir = path.join(process.cwd(), '.leads');
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        }
        const leadsFile = path.join(storageDir, 'inquiries.jsonl');
        fs.appendFileSync(leadsFile, JSON.stringify(sanitizedLead) + '\n', 'utf-8');
      } catch (fsErr) {
        console.warn('Local leads file append notice:', fsErr);
      }
    }

    // 8. Instant Email Delivery via Resend (with full HTML escaping and clean ASCII sanitization)
    const cleanHeaderString = (str?: string) => (str || '').replace(/[^\x20-\x7E]/g, '').trim();
    const resendApiKey = cleanHeaderString(process.env.RESEND_API_KEY);
    const notificationEmail = cleanHeaderString(process.env.NOTIFICATION_EMAIL) || 'growmybiz24@gmail.com';
    const fromEmail = (process.env.RESEND_FROM_EMAIL || 'Growmybiz24 <hello@growmybiz24.com>').replace(/[\uFEFF]/g, '').trim();

    let emailDelivered = false;
    let emailDeliveryId: string | null = null;

    if (resendApiKey && notificationEmail) {
      try {
        const formattedDate = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        const escapedName = escapeHtml(sanitizedLead.name);
        const escapedEmail = escapeHtml(sanitizedLead.email);
        const escapedPhone = sanitizedLead.phone ? escapeHtml(sanitizedLead.phone) : '';
        const escapedCompany = sanitizedLead.company ? escapeHtml(sanitizedLead.company) : '';
        const escapedService = escapeHtml(sanitizedLead.service);
        const escapedBudget = escapeHtml(sanitizedLead.budget);
        const escapedTimeline = escapeHtml(sanitizedLead.timeline);
        const escapedMessage = escapeHtml(sanitizedLead.message);

        const htmlEmailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Lead: ${escapedName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 28, 49, 0.08); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1A2B4A 0%, #243B66 100%); padding: 32px 30px; text-align: left;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: rgba(71, 123, 219, 0.25); color: #8cb5f5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px;">New Inbound Lead</span>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.02em;">Growmybiz24 Inquiry</h1>
                    <p style="color: rgba(255, 255, 255, 0.65); font-size: 13px; margin: 6px 0 0 0;">Received on ${formattedDate} (IST)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 30px;">
              
              <!-- Quick Action Callouts -->
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                <tr>
                  ${cleanClientPhone.length >= 10 ? `
                  <td style="padding-right: 8px;" width="50%">
                    <a href="${agencyToClientWhatsAppUrl}" target="_blank" style="display: block; text-align: center; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);">
                      💬 Instant WhatsApp Chat
                    </a>
                  </td>
                  ` : ''}
                  <td ${cleanClientPhone.length >= 10 ? 'style="padding-left: 8px;" width="50%"' : 'width="100%"'}>
                    <a href="mailto:${escapedEmail}?subject=Re:%20Growmybiz24%20Inquiry%20-%20${encodeURIComponent(sanitizedLead.service)}" style="display: block; text-align: center; background-color: #477BDB; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(71, 123, 219, 0.25);">
                      ✉️ Reply via Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Lead Details Table -->
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500; width: 140px;">Client Name</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 700;">${escapedName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Email Address</td>
                  <td style="padding: 11px 0; font-size: 14px; font-weight: 600;">
                    <a href="mailto:${escapedEmail}" style="color: #477BDB; text-decoration: none;">${escapedEmail}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Phone / WhatsApp</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 600;">
                    ${escapedPhone ? `<a href="tel:${escapedPhone}" style="color: #0F1C31; text-decoration: none;">${escapedPhone}</a>` : '<span style="color: #94A3B8;">Not provided</span>'}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Company</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 500;">${escapedCompany || '<span style="color: #94A3B8;">Independent / Not specified</span>'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Service Required</td>
                  <td style="padding: 11px 0; color: #477BDB; font-size: 14px; font-weight: 700;">${escapedService}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Budget Estimate</td>
                  <td style="padding: 11px 0; color: #059669; font-size: 14px; font-weight: 700;">${escapedBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Expected Timeline</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 600;">${escapedTimeline}</td>
                </tr>
              </table>

              <!-- Project Brief Message Box -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-top: 10px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 8px;">Project Scope & Brief:</div>
                <div style="font-size: 14px; line-height: 1.65; color: #1E293B; white-space: pre-wrap;">${escapedMessage}</div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 18px 30px; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0; color: #94A3B8; font-size: 12px;">Growmybiz24 Automated Lead Capture · <a href="https://growmybiz24.com/admin" style="color: #477BDB; text-decoration: none;">Open Admin CMS</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [notificationEmail],
            reply_to: sanitizedLead.email,
            subject: `⚡ New Project Inquiry: ${sanitizedLead.name} (${sanitizedLead.service})`,
            html: htmlEmailContent,
          }),
        });

        if (resendResponse.ok) {
          const resendData = await resendResponse.json();
          emailDelivered = true;
          emailDeliveryId = resendData.id || null;
          console.log(`✉️ Notification email dispatched via Resend (ID: ${emailDeliveryId})`);
        } else {
          const resendErr = await resendResponse.text();
          console.warn('Resend API delivery notice:', resendErr);
        }

        // 9. Automated Confirmation Receipt to Client
        if (sanitizedLead.email && isValidEmail(sanitizedLead.email)) {
          try {
            const htmlClientConfirmation = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Application Received — Growmybiz24</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 28, 49, 0.08); border: 1px solid #E2E8F0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0F1C31 0%, #1A2B4A 50%, #243B66 100%); padding: 36px 30px; text-align: left;">
              <span style="display: inline-block; background: rgba(50, 168, 138, 0.2); color: #52D9B8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(50, 168, 138, 0.3);">
                Application Received
              </span>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.02em;">
                We're reviewing your project brief.
              </h1>
              <p style="color: rgba(255, 255, 255, 0.7); font-size: 13px; margin: 8px 0 0 0;">
                Growmybiz24 Digital Growth Partner
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 30px;">
              <p style="color: #0F1C31; font-size: 15px; font-weight: 600; margin: 0 0 16px 0;">
                Hi ${escapedName},
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for reaching out to <strong>Growmybiz24</strong>! We have successfully received your project brief and our team is actively reviewing your requirements.
              </p>
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0;">
                  Summary of Your Submission
                </p>
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748B; width: 140px;">Service:</td>
                    <td style="padding: 6px 0; color: #0F1C31; font-weight: 600;">${escapedService}</td>
                  </tr>
                  ${sanitizedLead.company ? `
                  <tr>
                    <td style="padding: 6px 0; color: #64748B;">Company / Brand:</td>
                    <td style="padding: 6px 0; color: #0F1C31; font-weight: 600;">${escapedCompany}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 6px 0; color: #64748B;">Budget Range:</td>
                    <td style="padding: 6px 0; color: #0F1C31; font-weight: 600;">${escapedBudget}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748B;">Target Timeline:</td>
                    <td style="padding: 6px 0; color: #0F1C31; font-weight: 600;">${escapedTimeline}</td>
                  </tr>
                </table>
              </div>
              <h3 style="color: #0F1C31; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">
                What Happens Next?
              </h3>
              <ol style="color: #475569; font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0 0 24px 0;">
                <li><strong>Initial Assessment:</strong> We analyze your brief, scope, and technical requirements within 24 hours.</li>
                <li><strong>Discovery & Proposal:</strong> We will reply to this thread with clarifying questions or a clear, milestone-based proposal.</li>
                <li><strong>Execution:</strong> Once agreed, we start immediately with transparent communication throughout.</li>
              </ol>
              <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 18px 20px; text-align: center; margin-bottom: 24px;">
                <p style="color: #166534; font-size: 13px; font-weight: 600; margin: 0 0 10px 0;">
                  Prefer an instant answer or want to chat directly with our founders?
                </p>
                <a href="${clientToAgencyWhatsAppUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);">
                  💬 Chat on WhatsApp (+91 7290884480)
                </a>
              </div>
              <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
                Warm regards,<br>
                <strong style="color: #0F1C31;">Divyansh Gupta & The Growmybiz24 Team</strong><br>
                <a href="https://growmybiz24.com" style="color: #477BDB; text-decoration: none; font-size: 12px;">growmybiz24.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #94A3B8; font-size: 11px;">
                Growmybiz24 · New Delhi, India · Global Digital Delivery
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [sanitizedLead.email],
                reply_to: notificationEmail,
                subject: `Application Received — We're reviewing your project brief [Growmybiz24]`,
                html: htmlClientConfirmation,
              }),
            });
            console.log(`✉️ Client confirmation email dispatched to ${sanitizedLead.email}`);
          } catch (clientErr) {
            console.warn('Client confirmation email notice:', clientErr);
          }
        }
      } catch (emailErr) {
        console.warn('Resend email dispatch exception:', emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for reaching out! We have received your inquiry and will contact you within 24 hours.',
        leadId: sanitizedLead.id,
        persisted: supabasePersisted,
        emailDelivered,
        whatsappActionUrl: clientToAgencyWhatsAppUrl,
        whatsappConnectUrl: clientToAgencyWhatsAppUrl,
      },
      {
        status: 201,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request. Please try again or reach out on WhatsApp.' },
      { status: 500 }
    );
  }
}
