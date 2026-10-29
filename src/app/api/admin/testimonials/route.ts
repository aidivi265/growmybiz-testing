import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { testimonials as staticTestimonials } from '@/data/company';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/testimonials - List all testimonials
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && Array.isArray(data)) {
      return NextResponse.json({ success: true, testimonials: data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Admin testimonials fetch fallback:', err);
  }

  return NextResponse.json({ success: true, testimonials: [], source: 'static' });
}

// POST /api/admin/testimonials - Create testimonial
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, company, avatar, quote, rating, featured, order_index } = body;

    if (!name || !quote) {
      return NextResponse.json({ error: 'Name and quote are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([
        {
          name: name.trim(),
          role: role || '',
          company: company || '',
          avatar: avatar || name.slice(0, 2).toUpperCase(),
          quote: quote.trim(),
          rating: rating || 5,
          featured: featured ?? true,
          order_index: order_index || 0,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, testimonial: data });
  } catch (err) {
    console.error('Testimonial create error:', err);
    return NextResponse.json({ error: 'Failed to create testimonial.' }, { status: 500 });
  }
}

// PUT /api/admin/testimonials - Update testimonial
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, testimonial: data });
  } catch (err) {
    console.error('Testimonial update error:', err);
    return NextResponse.json({ error: 'Failed to update testimonial.' }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials - Delete testimonial
export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Testimonial delete error:', err);
    return NextResponse.json({ error: 'Failed to delete testimonial.' }, { status: 500 });
  }
}
