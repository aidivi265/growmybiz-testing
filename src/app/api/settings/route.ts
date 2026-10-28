import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { siteConfig } from '@/data/siteConfig';

// GET /api/settings - Public site settings (cached, CDN edge friendly)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json(
        {
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
            social: data.social || siteConfig.social,
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }
  } catch (err) {
    console.warn('Public settings fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    settings: siteConfig,
  });
}
