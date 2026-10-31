import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { getProjectByReceiptId, updateProjectMockup, verifyProjectAuthorization } from '@/lib/projectStore';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await context.params;
    const body = await request.json();

    const project = await getProjectByReceiptId(receiptId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const isAdmin = await checkAdminAuth();

    // If client is approving the mockup
    if (body.status === 'approved') {
      const clientToken = request.headers.get('x-client-token') || body.token;
      const clientEmail = body.clientEmail;
      const isAuthorized = verifyProjectAuthorization(project, clientToken, clientEmail, isAdmin);

      if (!isAuthorized) {
        return NextResponse.json(
          { error: 'Unauthorized. Valid client access token or email required to execute design approval.' },
          { status: 403 }
        );
      }
    } else {
      // Submitting or modifying a mockup requires admin auth
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized. Admin credentials required to submit or modify project mockups.' },
          { status: 401 }
        );
      }
    }

    const updated = await updateProjectMockup(receiptId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update project mockups.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: body.status === 'approved'
        ? 'Design mockups approved! Milestone 2 (30%) is now unlocked.'
        : 'Mockup details updated successfully.',
      project: updated,
    });
  } catch (error: any) {
    console.error('Error updating mockup:', error);
    return NextResponse.json({ error: 'Server error updating mockup.' }, { status: 500 });
  }
}
