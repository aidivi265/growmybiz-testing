import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { getProjectByReceiptId, verifyProjectAuthorization, getSanitizedPublicProject } from '@/lib/projectStore';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await context.params;
    if (!receiptId) {
      return NextResponse.json({ error: 'Receipt ID is required.' }, { status: 400 });
    }

    const project = await getProjectByReceiptId(receiptId);
    if (!project) {
      return NextResponse.json(
        { error: `No project found matching Receipt ID "${receiptId}". Please verify your reference number.` },
        { status: 404 }
      );
    }

    // Extract authorization credentials
    const { searchParams } = new URL(request.url);
    const providedToken = request.headers.get('x-client-token') || searchParams.get('token');
    const providedEmail = searchParams.get('email');
    const isAdmin = await checkAdminAuth();

    const isAuthorized = verifyProjectAuthorization(project, providedToken, providedEmail, isAdmin);

    if (!isAuthorized) {
      // Return strict sanitized public view — zero PII, zero financial leakage
      const sanitized = getSanitizedPublicProject(project);
      return NextResponse.json({
        success: true,
        project: sanitized,
        isRestricted: true,
      });
    }

    // Authorized access: full project details
    return NextResponse.json({
      success: true,
      project,
      isRestricted: false,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Server error retrieving project.' }, { status: 500 });
  }
}
