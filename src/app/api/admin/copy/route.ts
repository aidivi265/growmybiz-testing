import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { valueProps as staticValueProps, stats as staticStats } from '@/data/company';

import { defaultOrbitConfig } from '@/data/orbitConfig';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/copy - Get value props, stats, and custom page copy
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('*')
      .in('id', ['value_props', 'stats', 'about_content', 'cta_content', 'orbit_config']);

    const map: Record<string, any> = {};
    if (!error && data) {
      data.forEach((row) => {
        map[row.id] = row.data;
      });
    }

    return NextResponse.json({
      success: true,
      value_props: map.value_props || staticValueProps,
      stats: map.stats || staticStats,
      orbit_config: map.orbit_config || defaultOrbitConfig,
      about_content: map.about_content || {
        story_heading: 'Built to help businesses grow online.',
        story_body: 'We started Growmybizz because we were tired of seeing businesses get passed between separate design agencies, dev shops, and ad contractors who never spoke to each other.',
        mission: 'Coordinate technical, creative, and growth disciplines under one roof so digital execution moves fast and directly drives revenue.',
      },
      cta_content: map.cta_content || {
        heading: "Let's build something worth growing.",
        subheading: 'Tell us about your project. We will respond with a clear scope and no ambiguity.',
        primary_cta_label: 'Start a Project',
        primary_cta_href: '/contact',
      },
      source: data && data.length > 0 ? 'supabase' : 'static',
    });
  } catch (err) {
    console.warn('Copy fetch fallback:', err);
    return NextResponse.json({
      success: true,
      value_props: staticValueProps,
      stats: staticStats,
      source: 'static',
    });
  }
}

// POST /api/admin/copy - Update a page copy section
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section_id, data } = body;

    if (!section_id || !data) {
      return NextResponse.json({ error: 'section_id and data are required.' }, { status: 400 });
    }

    const { data: result, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: section_id,
        data,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/process');
    revalidatePath('/contact');

    return NextResponse.json({ success: true, saved: result });
  } catch (err) {
    console.error('Copy update error:', err);
    return NextResponse.json({ error: 'Failed to update page copy.' }, { status: 500 });
  }
}
