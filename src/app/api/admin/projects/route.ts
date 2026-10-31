import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { getAllProjects } from '@/lib/projectStore';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin credentials required to access client project listings.' },
      { status: 401 }
    );
  }

  try {
    const projects = await getAllProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects.' }, { status: 500 });
  }
}
