import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { defaultCurrencyConfig, CurrencyConfig } from '@/data/currencyConfig';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/currency - Read currency and exchange rate configuration
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'currency_config')
      .maybeSingle();

    if (!error && data?.data && typeof data.data === 'object') {
      return NextResponse.json({
        success: true,
        config: {
          ...defaultCurrencyConfig,
          ...(data.data as CurrencyConfig),
        },
        source: 'supabase',
      });
    }
  } catch (err) {
    console.warn('[Admin Notice] Currency config fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    config: defaultCurrencyConfig,
    source: 'default',
  });
}

// POST /api/admin/currency - Save currency and exchange rate configuration
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config: Partial<CurrencyConfig> = body.config || body;

    const mergedRates = {
      ...defaultCurrencyConfig.rates,
      ...(config.rates || {}),
      USD: 1.0, // Base peg
    };

    const mergedConfig: CurrencyConfig = {
      ...defaultCurrencyConfig,
      ...config,
      rates: mergedRates,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'currency_config',
        data: mergedConfig,
        updated_at: new Date().toISOString(),
      })
      .select('data')
      .single();

    if (error) {
      console.error('[Admin Currency Error] Upsert failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate site cache
    revalidatePath('/', 'layout');
    revalidatePath('/estimator');

    return NextResponse.json({
      success: true,
      message: 'Currency exchange rates and geo-detection configuration updated successfully.',
      config: data.data,
    });
  } catch (err: any) {
    console.error('[Admin Currency Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update currency configuration.' },
      { status: 500 }
    );
  }
}
