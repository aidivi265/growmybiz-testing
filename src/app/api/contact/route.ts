import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabaseServer';

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
    const body: ContactPayload = await request.json();
    const { name, email, phone, company, service, budget, timeline, message, _hp } = body;

    // 1. Silent Honeypot Bot Trap: If honeypot is filled, simulate success but do not process
    if (_hp && _hp.trim().length > 0) {
      console.warn('[SPAM BLOCKED] Honeypot field filled by bot:', { email, name });
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // 2. Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a brief message describing your project (at least 5 characters).' },
        { status: 400 }
      );
    }

    const sanitizedLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      receivedAt: new Date().toISOString(),
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      phone: phone ? phone.trim().slice(0, 30) : null,
      company: company ? company.trim().slice(0, 100) : null,
      service: service ? service.trim().slice(0, 50) : 'General Inquiry',
      budget: budget ? budget.trim().slice(0, 50) : 'Not specified',
      timeline: timeline ? timeline.trim().slice(0, 50) : 'Not specified',
      message: message.trim().slice(0, 5000),
    };

    const adminWhatsAppNumber = (process.env.ADMIN_WHATSAPP_NUMBER || '917290884480').replace(/[^0-9]/g, '');
    const cleanClientPhone = sanitizedLead.phone ? sanitizedLead.phone.replace(/[^0-9]/g, '') : '';

    // Direct WhatsApp URLs
    const clientToAgencyWhatsAppText = encodeURIComponent(
      `Hi Growmybizz team, I just submitted an inquiry on your website!\n\n` +
      `👤 Name: ${sanitizedLead.name}\n` +
      `🛠️ Service: ${sanitizedLead.service}\n` +
      `💰 Budget: ${sanitizedLead.budget}\n` +
      `💬 Message: ${sanitizedLead.message.slice(0, 140)}${sanitizedLead.message.length > 140 ? '...' : ''}`
    );
    const clientToAgencyWhatsAppUrl = `https://wa.me/${adminWhatsAppNumber}?text=${clientToAgencyWhatsAppText}`;

    const agencyToClientWhatsAppUrl = cleanClientPhone.length >= 10
      ? `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(`Hi ${sanitizedLead.name}, thank you for reaching out to Growmybizz regarding ${sanitizedLead.service}! We received your project brief and would love to assist you.`)}`
      : clientToAgencyWhatsAppUrl;

    // 3. Structured Server Logging
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 [NEW CLIENT INQUIRY CAPTURED]');
    console.log(`👤 Name:       ${sanitizedLead.name}`);
    console.log(`✉️ Email:      ${sanitizedLead.email}`);
    console.log(`📞 Phone:      ${sanitizedLead.phone ?? 'N/A'}`);
    console.log(`🏢 Company:    ${sanitizedLead.company ?? 'N/A'}`);
    console.log(`🛠️ Service:    ${sanitizedLead.service}`);
    console.log(`💰 Budget:     ${sanitizedLead.budget}`);
    console.log(`⏱️ Timeline:   ${sanitizedLead.timeline}`);
    console.log(`💬 Message:    ${sanitizedLead.message}`);
    console.log(`📱 WhatsApp:   ${agencyToClientWhatsAppUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 4. Persistent Database Storage in Supabase
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

    // 5. Persistence Fallback: Append to local leads storage
    try {
      const storageDir = path.join(process.cwd(), '.leads');
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      const leadsFile = path.join(storageDir, 'inquiries.jsonl');
      fs.appendFileSync(leadsFile, JSON.stringify(sanitizedLead) + '\n', 'utf-8');
    } catch {
      // Non-fatal if environment has read-only filesystem
    }

    // 6. Instant Email Delivery via Resend
    const resendApiKey = process.env.RESEND_API_KEY || '';
    const notificationEmail = process.env.NOTIFICATION_EMAIL || '';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Growmybizz Leads <onboarding@resend.dev>';

    let emailDelivered = false;
    let emailDeliveryId: string | null = null;

    if (resendApiKey && notificationEmail) {
      try {
        const formattedDate = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        const htmlEmailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Lead: ${sanitizedLead.name}</title>
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
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.02em;">Growmybizz Inquiry</h1>
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
                    <a href="mailto:${sanitizedLead.email}?subject=Re:%20Growmybizz%20Inquiry%20-%20${encodeURIComponent(sanitizedLead.service)}" style="display: block; text-align: center; background-color: #477BDB; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(71, 123, 219, 0.25);">
                      ✉️ Reply via Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Lead Details Table -->
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500; width: 140px;">Client Name</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 700;">${sanitizedLead.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Email Address</td>
                  <td style="padding: 11px 0; font-size: 14px; font-weight: 600;">
                    <a href="mailto:${sanitizedLead.email}" style="color: #477BDB; text-decoration: none;">${sanitizedLead.email}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Phone / WhatsApp</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 600;">
                    ${sanitizedLead.phone ? `<a href="tel:${sanitizedLead.phone}" style="color: #0F1C31; text-decoration: none;">${sanitizedLead.phone}</a>` : '<span style="color: #94A3B8;">Not provided</span>'}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Company</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 500;">${sanitizedLead.company ?? '<span style="color: #94A3B8;">Independent / Not specified</span>'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Service Required</td>
                  <td style="padding: 11px 0; color: #477BDB; font-size: 14px; font-weight: 700;">${sanitizedLead.service}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Budget Estimate</td>
                  <td style="padding: 11px 0; color: #059669; font-size: 14px; font-weight: 700;">${sanitizedLead.budget}</td>
                </tr>
                <tr>
                  <td style="padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 500;">Expected Timeline</td>
                  <td style="padding: 11px 0; color: #0F1C31; font-size: 14px; font-weight: 600;">${sanitizedLead.timeline}</td>
                </tr>
              </table>

              <!-- Project Brief Message Box -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-top: 10px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 8px;">Project Scope & Brief:</div>
                <div style="font-size: 14px; line-height: 1.65; color: #1E293B; white-space: pre-wrap;">${sanitizedLead.message}</div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 30px; text-align: center;">
              <p style="font-size: 12px; color: #64748B; margin: 0;">
                Growmybizz Automated Lead Capture • Powered by Supabase & Resend
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [notificationEmail],
            reply_to: sanitizedLead.email,
            subject: `🚀 New Lead: ${sanitizedLead.name} • ${sanitizedLead.service} (${sanitizedLead.budget})`,
            html: htmlEmailContent,
          }),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json();
          emailDelivered = true;
          emailDeliveryId = resendData.id;
          console.log('✅ Resend email delivered successfully. ID:', resendData.id);
        } else {
          const errorData = await resendRes.json();
          console.error('❌ Resend API delivery error:', errorData);
        }
      } catch (emailErr) {
        console.error('❌ Resend email dispatch failed:', emailErr);
      }
    }

    // 7. Instant Server-Side WhatsApp Alert (CallMeBot / Webhook)
    const whatsappAlertPhone = process.env.WHATSAPP_ALERT_PHONE;
    const whatsappAlertApiKey = process.env.WHATSAPP_ALERT_APIKEY;

    if (whatsappAlertPhone && whatsappAlertApiKey) {
      try {
        const alertMessage =
          `🚀 *New Lead on Growmybizz!*\n\n` +
          `👤 *Name:* ${sanitizedLead.name}\n` +
          `✉️ *Email:* ${sanitizedLead.email}\n` +
          `📞 *Phone:* ${sanitizedLead.phone ?? 'N/A'}\n` +
          `🛠️ *Service:* ${sanitizedLead.service}\n` +
          `💰 *Budget:* ${sanitizedLead.budget}\n` +
          `💬 *Brief:* ${sanitizedLead.message.slice(0, 150)}`;

        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappAlertPhone}&text=${encodeURIComponent(alertMessage)}&apikey=${whatsappAlertApiKey}`;
        await fetch(callMeBotUrl);
        console.log('✅ Instant WhatsApp alert dispatched via CallMeBot.');
      } catch (waErr) {
        console.error('WhatsApp CallMeBot notification failed:', waErr);
      }
    }

    // 8. Optional Generic Lead Webhook (Slack / Discord / Telegram / Zapier)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL || process.env.WHATSAPP_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Lead from Growmybizz*\n*Name:* ${sanitizedLead.name}\n*Email:* ${sanitizedLead.email}\n*Phone:* ${sanitizedLead.phone ?? 'N/A'}\n*Service:* ${sanitizedLead.service}\n*Budget:* ${sanitizedLead.budget}\n*WhatsApp:* ${agencyToClientWhatsAppUrl}\n*Message:* ${sanitizedLead.message}`,
            lead: sanitizedLead,
            whatsappUrl: agencyToClientWhatsAppUrl,
          }),
        });
      } catch (webhookErr) {
        console.error('Webhook notification failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your project enquiry has been received. We will respond within 24 hours.',
      delivery: {
        email: emailDelivered,
        emailId: emailDeliveryId,
        database: supabasePersisted,
      },
      whatsappActionUrl: clientToAgencyWhatsAppUrl,
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message. Please try again.' },
      { status: 500 }
    );
  }
}
