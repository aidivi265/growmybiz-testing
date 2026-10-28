import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { processSteps as staticProcessSteps } from '@/data/process';
import type { ProcessStep } from '@/types';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/process - List all process steps
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'process_steps')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return NextResponse.json({ success: true, steps: data.data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Process fetch fallback:', err);
  }

  return NextResponse.json({ success: true, steps: staticProcessSteps, source: 'static' });
}

// POST /api/admin/process - Save / reorder process steps
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const steps: ProcessStep[] = body.steps;

    if (!Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: 'At least one process step is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'process_steps',
        data: steps,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/process');
    revalidatePath('/');

    return NextResponse.json({ success: true, steps: data.data });
  } catch (err) {
    console.error('Process update error:', err);
    return NextResponse.json({ error: 'Failed to update process steps.' }, { status: 500 });
  }
}
