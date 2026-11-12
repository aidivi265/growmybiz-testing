import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { siteConfig } from '@/data/siteConfig';
import { services as defaultServices } from '@/data/services';
import { defaultBookingConfig } from '@/data/bookingConfig';
import { defaultCurrencyConfig } from '@/data/currencyConfig';
import { defaultPageVisibility, normalizePageVisibility } from '@/lib/pageVisibility';

// GET /api/settings - Public site settings, CTA content, active service links, and page visibility
export async function GET() {
  try {
    const [settingsRes, ctaRes, servicesRes, visibilityRes, bookingRes] = await Promise.all([
      supabaseAdmin.from('site_settings').select('*').eq('id', 'global').maybeSingle(),
      supabaseAdmin.from('page_content').select('data').eq('id', 'cta_content').maybeSingle(),
      supabaseAdmin.from('services').select('id, title, slug').eq('is_published', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('page_content').select('data').eq('id', 'page_visibility').maybeSingle(),
      supabaseAdmin.from('page_content').select('data').eq('id', 'booking_config').maybeSingle(),
    ]);

    const settingsData = settingsRes.data;
    const ctaData = ctaRes.data?.data;
    const servicesData = servicesRes.data;
    const visibilityData = normalizePageVisibility(
      visibilityRes.data?.data as Record<string, unknown> | undefined
    );

    const rawSocial = settingsData?.social || siteConfig.social;
    const socialVisibility = rawSocial?._visibility || {};
    const cleanSocial = { ...rawSocial };
    delete cleanSocial._visibility;

    return NextResponse.json(
      {
        success: true,
        settings: {
          siteName: settingsData?.site_name || siteConfig.siteName,
          tagline: settingsData?.tagline || siteConfig.tagline,
          description: settingsData?.description || siteConfig.description,
          email: settingsData?.email || siteConfig.email,
          phone: settingsData?.phone || siteConfig.phone,
          address: settingsData?.address || siteConfig.address,
          whatsappNumber: settingsData?.whatsapp_number || siteConfig.whatsappNumber,
          whatsappUrl: settingsData?.whatsapp_url || siteConfig.whatsappUrl,
          social: cleanSocial,
          socialVisibility,
        },
        bookingConfig:
          bookingRes.data?.data && typeof bookingRes.data.data === 'object'
            ? { ...defaultBookingConfig, ...bookingRes.data.data }
            : defaultBookingConfig,
        currencyConfig: defaultCurrencyConfig,
        pageVisibility: visibilityData,
        ctaContent: ctaData || {
          heading: "Let's build something worth growing.",
          subheading: 'Ready to grow?',
          primary_cta_label: 'Start a Project',
          primary_cta_href: '/contact',
        },
        services:
          servicesData && servicesData.length > 0
            ? servicesData
            : defaultServices.map((s) => ({ id: s.id, title: s.title, slug: s.slug })),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.warn('Public settings fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    settings: siteConfig,
    currencyConfig: defaultCurrencyConfig,
    pageVisibility: defaultPageVisibility,
    ctaContent: {
      heading: "Let's build something worth growing.",
      subheading: 'Ready to grow?',
      primary_cta_label: 'Start a Project',
      primary_cta_href: '/contact',
    },
    services: defaultServices.map((s) => ({ id: s.id, title: s.title, slug: s.slug })),
  });
}
