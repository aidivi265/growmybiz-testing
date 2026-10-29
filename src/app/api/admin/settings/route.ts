import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { siteConfig } from '@/data/siteConfig';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/settings - Read site settings
export async function GET() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [settingsRes, visibilityRes] = await Promise.all([
      supabaseAdmin.from('site_settings').select('*').eq('id', 'global').maybeSingle(),
      supabaseAdmin.from('page_content').select('data').eq('id', 'page_visibility').maybeSingle(),
    ]);

    const data = settingsRes.data;
    const pageVisibility = visibilityRes.data?.data || {
      about: true,
      services: true,
      portfolio: true,
      process: true,
      insights: true,
      contact: true,
      testimonials: true,
    };

    if (!settingsRes.error && data) {
      const rawSocial = data.social || siteConfig.social;
      const socialVisibility = rawSocial?._visibility || {
        linkedin: true,
        instagram: true,
        twitter: true,
        youtube: true,
      };
      const cleanSocial = { ...rawSocial };
      delete cleanSocial._visibility;

      return NextResponse.json({
        success: true,
        settings: {
          siteName: data.site_name || siteConfig.siteName,
          tagline: data.tagline || siteConfig.tagline,
          description: data.description || siteConfig.description,
          email: data.email || siteConfig.email,
          phone: data.phone || siteConfig.phone,
          address: data.address || siteConfig.address,
          whatsappNumber: data.whatsapp_number || siteConfig.whatsappNumber,
          whatsappUrl: data.whatsapp_url || siteConfig.whatsappUrl,
          social: cleanSocial,
          socialVisibility,
        },
        pageVisibility,
        source: 'supabase',
      });
    }
  } catch (err) {
    console.warn('Supabase site_settings read error:', err);
  }

  // Fallback to local siteConfig
  return NextResponse.json({
    success: true,
    settings: {
      siteName: siteConfig.siteName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      email: siteConfig.email,
      phone: siteConfig.phone,
      address: siteConfig.address,
      whatsappNumber: siteConfig.whatsappNumber,
      whatsappUrl: siteConfig.whatsappUrl,
      social: siteConfig.social,
    },
    pageVisibility: {
      about: true,
      services: true,
      portfolio: true,
      process: true,
      insights: true,
      contact: true,
      testimonials: true,
    },
    source: 'siteConfig',
  });
}

// POST /api/admin/settings - Save site settings to Supabase
export async function POST(request: Request) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      siteName,
      tagline,
      description,
      email,
      phone,
      address,
      whatsappNumber,
      social,
    } = body;

    const cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    const cleanWhatsappUrl = cleanWhatsapp
      ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
          `Hi ${siteName || 'Growmybiz24'} team, I would like to discuss a new project.`
        )}`
      : undefined;

    const updates = {
      id: 'global',
      updated_at: new Date().toISOString(),
      site_name: siteName,
      tagline: tagline,
      description: description,
      email: email,
      phone: phone,
      address: address,
      whatsapp_number: whatsappNumber,
      social: {
        ...(social || siteConfig.social),
        _visibility: body.socialVisibility || {},
      },
      ...(cleanWhatsappUrl ? { whatsapp_url: cleanWhatsappUrl } : {}),
    };

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert(updates)
      .select()
      .single();

    if (error) {
      console.error('Supabase site_settings upsert error:', error);
      return NextResponse.json(
        { error: 'Failed to update settings in Supabase: ' + error.message },
        { status: 500 }
      );
    }

    // Save page visibility if provided
    if (body.pageVisibility && typeof body.pageVisibility === 'object') {
      try {
        await supabaseAdmin
          .from('page_content')
          .upsert({
            id: 'page_visibility',
            data: body.pageVisibility,
            updated_at: new Date().toISOString(),
          });
      } catch (visErr) {
        console.warn('Page visibility upsert notice:', visErr);
      }
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/portfolio');
    revalidatePath('/process');
    revalidatePath('/insights');
    revalidatePath('/contact');

    return NextResponse.json({
      success: true,
      message: 'Site settings and page visibility updated successfully in Supabase.',
      settings: data,
      pageVisibility: body.pageVisibility,
    });
  } catch (err) {
    console.error('Error saving site settings:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving settings.' },
      { status: 500 }
    );
  }
}
