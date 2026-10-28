import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (!error && data) {
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
        },
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
    } = body;

    const cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    const cleanWhatsappUrl = cleanWhatsapp
      ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
          `Hi ${siteName || 'Growmybizz'} team, I would like to discuss a new project.`
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

    return NextResponse.json({
      success: true,
      message: 'Site settings updated successfully in Supabase.',
      settings: data,
    });
  } catch (err) {
    console.error('Error saving site settings:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving settings.' },
      { status: 500 }
    );
  }
}
