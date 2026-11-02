import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { defaultBeforeAfterShowcases, BeforeAfterShowcase } from '@/data/beforeAfterShowcase';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/before-after - Retrieve all showcase transformations
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'before_after_showcase')
      .maybeSingle();

    if (!error && data?.data && Array.isArray((data.data as any)?.items)) {
      return NextResponse.json({
        success: true,
        items: (data.data as any).items,
        source: 'supabase',
      });
    }
  } catch (err) {
    console.warn('[Admin Notice] Before-After fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    items: defaultBeforeAfterShowcases,
    source: 'default',
  });
}

// POST /api/admin/before-after - Save showcase transformations to Supabase
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: BeforeAfterShowcase[] = Array.isArray(body) ? body : body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid payload: Array of showcase items is required.' },
        { status: 400 }
      );
    }

    const payload = {
      items,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'before_after_showcase',
        data: payload,
        updated_at: new Date().toISOString(),
      })
      .select('data')
      .single();

    if (error) {
      console.error('[Admin Before-After Error] Upsert failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate cached homepage & portfolio pages
    revalidatePath('/');
    revalidatePath('/portfolio');

    return NextResponse.json({
      success: true,
      message: 'Before & After showcases updated and published successfully.',
      items: (data.data as any)?.items || items,
    });
  } catch (err: any) {
    console.error('[Admin Before-After Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update showcases.' },
      { status: 500 }
    );
  }
}
