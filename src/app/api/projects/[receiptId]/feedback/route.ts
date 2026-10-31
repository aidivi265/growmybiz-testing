import { NextResponse } from 'next/server';
import { submitProjectFeedback } from '@/lib/projectStore';

export async function POST(
  request: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await context.params;
    const body = await request.json();

    const feedback = {
      rating: Number(body.rating) || 5,
      satisfactionLevel: body.satisfactionLevel || 'Highly Satisfied',
      bestAspect: body.bestAspect || 'Engineering speed and transparent communication',
      suggestions: body.suggestions || 'None, excellent experience.',
      allowTestimonial: !!body.allowTestimonial,
      interestedInRetainer: !!body.interestedInRetainer,
      submittedAt: new Date().toISOString(),
    };

    const updated = await submitProjectFeedback(receiptId, feedback);
    if (!updated) {
      return NextResponse.json({ error: 'Could not record feedback.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your valuable feedback! Growmybiz24 appreciates your partnership.',
      project: updated,
    });
  } catch (error: any) {
    console.error('Error recording feedback:', error);
    return NextResponse.json({ error: 'Server error saving feedback.' }, { status: 500 });
  }
}
