import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { defaultEstimatorConfig, EstimatorConfig } from '@/data/estimatorConfig';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/estimator - Retrieve current estimator configuration
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'estimator_config')
      .maybeSingle();

    if (!error && data?.data && Array.isArray((data.data as any)?.categories)) {
      return NextResponse.json({
        success: true,
        config: data.data,
        source: 'supabase',
      });
    }
  } catch (err) {
    console.warn('[Admin Notice] Estimator fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    config: defaultEstimatorConfig,
    source: 'default',
  });
}

// POST /api/admin/estimator - Save updated estimator configuration to Supabase
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config: EstimatorConfig = body.config || body;

    if (!config || !Array.isArray(config.categories) || !Array.isArray(config.designTiers)) {
      return NextResponse.json(
        { error: 'Invalid configuration payload. Categories and design tiers arrays are required.' },
        { status: 400 }
      );
    }

    const updatedPayload = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'estimator_config',
        data: updatedPayload,
        updated_at: new Date().toISOString(),
      })
      .select('data')
      .single();

    if (error) {
      console.error('[Admin Estimator Error] Upsert failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Purge on-demand cache
    revalidatePath('/estimator');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Estimator pricing and scope rules updated successfully in Supabase.',
      config: data.data,
    });
  } catch (err: any) {
    console.error('[Admin Estimator Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update estimator configuration.' },
      { status: 500 }
    );
  }
}
