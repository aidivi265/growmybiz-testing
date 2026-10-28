import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { portfolioItems as staticPortfolio } from '@/data/portfolio';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/portfolio - List all portfolio projects
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, projects: data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Admin portfolio fetch fallback:', err);
  }

  return NextResponse.json({ success: true, projects: staticPortfolio, source: 'static' });
}

// POST /api/admin/portfolio - Create portfolio item
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug,
      title,
      client,
      category,
      year,
      thumbnail,
      challenge,
      solution,
      outcome,
      metrics,
      technologies,
      gallery,
      is_concept,
      is_featured,
      is_published,
      order_index,
    } = body;

    if (!slug || !title || !client) {
      return NextResponse.json({ error: 'Title, client, and slug are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert([
        {
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          client: client.trim(),
          category: category || 'Web & Digital',
          year: year || '2025',
          thumbnail: thumbnail || '/portfolio-mockups/mobile-app.png',
          challenge: challenge || '',
          solution: solution || '',
          outcome: outcome || '',
          metrics: metrics || [],
          technologies: technologies || [],
          gallery: gallery || [],
          is_concept: is_concept ?? false,
          is_featured: is_featured ?? true,
          is_published: is_published ?? true,
          order_index: order_index || 0,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, project: data });
  } catch (err) {
    console.error('Portfolio create error:', err);
    return NextResponse.json({ error: 'Failed to create portfolio item.' }, { status: 500 });
  }
}

// PUT /api/admin/portfolio - Update portfolio item
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/portfolio');
    if (data?.slug) revalidatePath(`/portfolio/${data.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, project: data });
  } catch (err) {
    console.error('Portfolio update error:', err);
    return NextResponse.json({ error: 'Failed to update portfolio item.' }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio - Delete portfolio item
export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('portfolio_projects').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Portfolio delete error:', err);
    return NextResponse.json({ error: 'Failed to delete portfolio item.' }, { status: 500 });
  }
}
