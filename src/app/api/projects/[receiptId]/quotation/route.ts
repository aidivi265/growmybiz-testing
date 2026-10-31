import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { getProjectByReceiptId, saveProject, generateDefaultQuotation } from '@/lib/projectStore';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  // Enforce Admin Authentication
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Unauthorized. Only authenticated Growmybiz24 administrators can modify or publish quotations.' },
      { status: 401 }
    );
  }

  try {
    const { receiptId } = await context.params;
    const body = await request.json();

    const project = await getProjectByReceiptId(receiptId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Action 1: Auto-generate AI quotation draft if requested
    if (body.action === 'ai_generate') {
      project.quotation = generateDefaultQuotation(project);
      await saveProject(project);
      return NextResponse.json({ success: true, quotation: project.quotation });
    }

    // Action 2: Update quotation and optionally mark live
    if (body.quotation) {
      project.quotation = {
        ...project.quotation,
        ...body.quotation,
        updatedAt: new Date().toISOString(),
      };
    }

    if (body.publishLive === true) {
      project.status = 'quotation_live';
      console.log(`[QUOTATION LIVE] Project ${project.receiptId} quotation published to client portal by admin.`);
    }

    await saveProject(project);

    return NextResponse.json({
      success: true,
      message: body.publishLive ? 'Quotation is now live on client portal!' : 'Quotation draft saved.',
      project,
    });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: 'Failed to update quotation.' }, { status: 500 });
  }
}
