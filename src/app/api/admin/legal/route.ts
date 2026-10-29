import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

const defaultLegalDocs: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `## 1. Information We Collect\nWe collect personal information that you provide directly to us when filling out forms on our website or communicating with our team (e.g., name, email address, phone number, company name, and project requirements).\n\n## 2. How We Use Your Information\nWe use the information we collect to communicate with you about your inquiries, deliver our agreed services, send invoices, and comply with applicable legal obligations.\n\n## 3. Data Protection & Security\nWe implement standard technical and organizational security protocols to protect your personal data against unauthorized access, loss, or disclosure. We never sell or rent your personal information to third parties.`,
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: `## 1. Acceptance of Terms\nBy accessing or using the services provided by Growmybiz24, you agree to be bound by these Terms of Service.\n\n## 2. Scope of Services\nAll projects, deliverables, milestones, and payment schedules are governed by an individual Statement of Work (SOW) agreed upon between the client and Growmybiz24 prior to work commencement.\n\n## 3. Intellectual Property\nUpon full payment of all agreed fees, the client owns full commercial rights to all final delivered creative assets, source code, and design files specified in the project scope.`,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: `## 1. What Are Cookies\nCookies are small data files placed on your device to enhance site navigation, analyze aggregate site traffic, and personalize your experience.\n\n## 2. Cookies We Use\nWe strictly use essential cookies required for session security and anonymous performance analytics (e.g., Google Analytics 4) to understand how visitors navigate our pages.`,
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: `## 1. Milestone-Based Engagements\nBecause our services are customized professional services, work is billed and approved according to defined project milestones.\n\n## 2. Milestone Approvals\nOnce a milestone has been reviewed, approved, and delivered, the fee associated with that milestone is non-refundable. If you choose to terminate a project before completion, you will only be invoiced for work completed up to the termination date.`,
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: `## General Disclaimer\nThe materials on Growmybiz24's website are provided on an 'as is' basis. While we strive to ensure that all information and case study insights are accurate and up-to-date, we make no representations or warranties regarding completeness or suitability for any specific commercial purpose.`,
  },
  'accessibility': {
    title: 'Accessibility Statement',
    content: `## Our Commitment\nGrowmybiz24 is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards (WCAG 2.1 Level AA) across our design systems and engineering builds.`,
  },
};

// GET /api/admin/legal - List or get legal document
export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    try {
      const { data, error } = await supabaseAdmin
        .from('page_content')
        .select('data')
        .eq('id', `legal_${slug}`)
        .maybeSingle();

      if (!error && data?.data) {
        return NextResponse.json({ success: true, doc: data.data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Legal fetch fallback:', err);
    }

    const fallback = defaultLegalDocs[slug] || { title: 'Legal Policy', content: 'Content coming soon.' };
    return NextResponse.json({ success: true, doc: fallback, source: 'static' });
  }

  // Return all docs
  return NextResponse.json({ success: true, docs: defaultLegalDocs });
}

// POST /api/admin/legal - Update legal document
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, content } = body;

    if (!slug || !content) {
      return NextResponse.json({ error: 'slug and content are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: `legal_${slug}`,
        data: { title: title || slug, content },
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath(`/legal/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, doc: data.data });
  } catch (err) {
    console.error('Legal update error:', err);
    return NextResponse.json({ error: 'Failed to update legal policy.' }, { status: 500 });
  }
}
