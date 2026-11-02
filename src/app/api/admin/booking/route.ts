import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { defaultBookingConfig, BookingConfig } from '@/data/bookingConfig';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/booking - Read calendar booking configuration
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'booking_config')
      .maybeSingle();

    if (!error && data?.data && typeof data.data === 'object') {
      return NextResponse.json({
        success: true,
        config: {
          ...defaultBookingConfig,
          ...(data.data as BookingConfig),
        },
        source: 'supabase',
      });
    }
  } catch (err) {
    console.warn('[Admin Notice] Booking config fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    config: defaultBookingConfig,
    source: 'default',
  });
}

// POST /api/admin/booking - Save calendar booking configuration
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config: Partial<BookingConfig> = body.config || body;

    const mergedConfig: BookingConfig = {
      ...defaultBookingConfig,
      ...config,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'booking_config',
        data: mergedConfig,
        updated_at: new Date().toISOString(),
      })
      .select('data')
      .single();

    if (error) {
      console.error('[Admin Booking Error] Upsert failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate site cache
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/contact');

    return NextResponse.json({
      success: true,
      message: 'Live calendar booking configuration updated and published successfully.',
      config: data.data,
    });
  } catch (err: any) {
    console.error('[Admin Booking Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update booking configuration.' },
      { status: 500 }
    );
  }
}
