import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

const defaultSeoList = [
  {
    route_path: '/',
    meta_title: 'Growmybiz24 | Digital Solutions for a Bigger Tomorrow',
    meta_description: 'Growmybiz24 is a premier digital agency specializing in performant web development, modern branding, digital marketing, and AI automation.',
    og_image: '/og-image.jpg',
    keywords: ['Growmybiz24', 'Digital Agency', 'Web Development', 'AI Automation', 'Branding'],
  },
  {
    route_path: '/services',
    meta_title: 'Services | Growmybiz24 Digital Solutions',
    meta_description: 'Explore our high-performance digital services: Web & App Development, Design & Branding, Digital Marketing, AI Automation, and Content Production.',
    og_image: '/og-image.jpg',
    keywords: ['Web Development', 'UI UX Design', 'SEO Marketing', 'AI Agents'],
  },
  {
    route_path: '/portfolio',
    meta_title: 'Portfolio & Case Studies | Growmybiz24',
    meta_description: 'Discover our proven track record of architecting digital products, e-commerce solutions, and scalable enterprise designs.',
    og_image: '/og-image.jpg',
    keywords: ['Case Studies', 'Client Work', 'Web Applications', 'Design Systems'],
  },
  {
    route_path: '/insights',
    meta_title: 'Insights & Technology Blog | Growmybiz24',
    meta_description: 'Practical guides and deep-dives on modern web architecture, digital marketing conversion rate optimization, and AI automation.',
    og_image: '/og-image.jpg',
    keywords: ['Tech Insights', 'Modern Web', 'CRO', 'AI Workflows'],
  },
  {
    route_path: '/contact',
    meta_title: 'Contact Us | Start Your Project with Growmybiz24',
    meta_description: 'Get in touch with the Growmybiz24 leadership team. Let us turn your vision into scalable digital revenue.',
    og_image: '/og-image.jpg',
    keywords: ['Contact Growmybiz24', 'Hire Web Agency', 'Get In Touch'],
  },
];

// GET /api/admin/seo - List all SEO metadata
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('seo_metadata')
      .select('*')
      .order('route_path', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, routes: data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('SEO metadata fetch fallback:', err);
  }

  return NextResponse.json({ success: true, routes: defaultSeoList, source: 'static' });
}

// POST /api/admin/seo - Upsert SEO metadata for a route
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { route_path, meta_title, meta_description, og_image, keywords } = body;

    if (!route_path || !meta_title || !meta_description) {
      return NextResponse.json(
        { error: 'Route path, meta title, and meta description are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('seo_metadata')
      .upsert({
        route_path: route_path.trim(),
        meta_title: meta_title.trim(),
        meta_description: meta_description.trim(),
        og_image: og_image || '/og-image.jpg',
        keywords: Array.isArray(keywords) ? keywords : [],
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath(route_path);
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, route: data });
  } catch (err) {
    console.error('SEO update error:', err);
    return NextResponse.json({ error: 'Failed to update SEO metadata.' }, { status: 500 });
  }
}
