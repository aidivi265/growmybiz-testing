import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { heroSlides as staticHeroSlides } from '@/data/hero';
import type { HeroSlide } from '@/types';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/hero - Retrieve all hero slides
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'hero_slides')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return NextResponse.json({ success: true, slides: data.data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Hero slides fetch fallback:', err);
  }

  return NextResponse.json({ success: true, slides: staticHeroSlides, source: 'static' });
}

// POST /api/admin/hero - Save / update hero slides
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slides: HeroSlide[] = body.slides;

    if (!Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'At least one hero slide is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'hero_slides',
        data: slides,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, slides: data.data });
  } catch (err) {
    console.error('Hero update error:', err);
    return NextResponse.json({ error: 'Failed to update hero slides.' }, { status: 500 });
  }
}
