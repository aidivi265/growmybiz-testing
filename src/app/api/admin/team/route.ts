import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { teamMembers as staticTeamMembers } from '@/data/company';
import type { TeamMember } from '@/types';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/team - List all team members
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'team_members')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return NextResponse.json({ success: true, members: data.data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Team fetch fallback:', err);
  }

  return NextResponse.json({ success: true, members: staticTeamMembers, source: 'static' });
}

// POST /api/admin/team - Save / update team members
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const members: TeamMember[] = body.members;

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: 'At least one team member is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: 'team_members',
        data: members,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({ success: true, members: data.data });
  } catch (err) {
    console.error('Team update error:', err);
    return NextResponse.json({ error: 'Failed to update team members.' }, { status: 500 });
  }
}
