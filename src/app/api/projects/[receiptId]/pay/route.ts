import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { getProjectByReceiptId, recordMilestonePayment, verifyProjectAuthorization } from '@/lib/projectStore';
import { checkRateLimit } from '@/lib/rateLimit';

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
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit(`pay_sim_${ip}`, {
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { receiptId } = await context.params;
    const body = await request.json();

    const project = await getProjectByReceiptId(receiptId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // 2. Authorization Check
    const isAdmin = await checkAdminAuth();
    const clientToken = request.headers.get('x-client-token') || body.token;
    const clientEmail = body.email;
    const isAuthorized = verifyProjectAuthorization(project, clientToken, clientEmail, isAdmin);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Client verification required to process milestone settlement.' },
        { status: 403 }
      );
    }

    const milestoneNumber = Number(body.milestoneNumber);
    if (![1, 2, 3].includes(milestoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid milestone number. Must be 1 (50%), 2 (30%), or 3 (20%).' },
        { status: 400 }
      );
    }

    // Explicit DEMO transaction reference
    const transactionRef = `TXN-DEMO-SIM-${Date.now().toString().slice(-6)}`;
    const updated = await recordMilestonePayment(
      receiptId,
      milestoneNumber as 1 | 2 | 3,
      transactionRef
    );

    if (!updated) {
      return NextResponse.json({ error: 'Could not record milestone payment.' }, { status: 404 });
    }

    const milestonePaid = updated.quotation?.milestones.find((m) => m.number === milestoneNumber);

    console.log(`💳 [DEMO PAYMENT SIMULATED] Project: ${receiptId} | Milestone: ${milestoneNumber} | TXN: ${transactionRef}`);

    return NextResponse.json({
      success: true,
      isDemo: true,
      mode: 'SIMULATION_DEMO_ONLY',
      disclaimer: 'TEST PAYMENT SIMULATION ONLY. NO REAL MONEY CHARGED.',
      message: `Milestone ${milestoneNumber} simulated payment verified. Official slip unlocked!`,
      project: updated,
      slipId: milestonePaid?.receiptSlipId,
    });
  } catch (error: any) {
    console.error('Error processing milestone payment:', error);
    return NextResponse.json({ error: 'Server error processing payment.' }, { status: 500 });
  }
}
