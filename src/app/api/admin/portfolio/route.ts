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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    if (!error && Array.isArray(data)) {
      return NextResponse.json({ success: true, projects: data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Admin portfolio fetch fallback:', err);
  }

  return NextResponse.json({ success: true, projects: [], source: 'supabase' });
}

// POST /api/admin/portfolio - Create portfolio item or seed defaults
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check for seed action
    if (body.action === 'seed') {
      const { portfolioItems } = await import('@/data/portfolio');
      const rows = portfolioItems.map((p, idx) => ({
        slug: p.slug,
        title: p.title,
        client: p.client,
        category: p.category || 'Web & App Development',
        year: String(p.year || 2025),
        thumbnail: p.thumbnail || '/portfolio-mockups/mobile-app.png',
        challenge: p.challenge || 'Project problem statement.',
        solution: p.solution || p.approach || 'Solution and technical implementation.',
        outcome: p.outcome || 'Delivered quantifiable client results.',
        deliverables: p.deliverables || [],
        technologies: p.technologies || [],
        gallery: p.images || [p.thumbnail || '/portfolio-mockups/mobile-app.png'],
        metrics: [
          { label: '_industry', value: p.industry || '' },
          { label: '_serviceSlug', value: p.serviceSlug || 'web-app-development' },
        ],
        is_concept: p.isConcept ?? false,
        is_featured: p.featured ?? true,
        is_published: true,
        order_index: idx,
      }));

      const { data, error } = await supabaseAdmin.from('portfolio_projects').insert(rows).select('*');
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      revalidatePath('/portfolio');
      revalidatePath('/');
      return NextResponse.json({ success: true, count: data?.length || 0, projects: data });
    }

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
      deliverables,
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

    const defaultThumb = '/portfolio-mockups/mobile-app.png';

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert([
        {
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          client: client.trim(),
          category: category || 'Web & App Development',
          year: String(year || '2025'),
          thumbnail: thumbnail?.trim() || defaultThumb,
          challenge: challenge?.trim() || 'Client problem statement and project scope.',
          solution: solution?.trim() || 'Strategic development and UI/UX implementation.',
          outcome: outcome?.trim() || 'Validated growth, scalability, and enhanced conversions.',
          deliverables: Array.isArray(deliverables) ? deliverables : [],
          metrics: Array.isArray(metrics) ? metrics : [],
          technologies: Array.isArray(technologies) ? technologies : [],
          gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [thumbnail || defaultThumb],
          is_concept: is_concept ?? false,
          is_featured: is_featured ?? true,
          is_published: is_published ?? true,
          order_index: typeof order_index === 'number' ? order_index : 0,
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

    const isUuid = UUID_REGEX.test(id);

    // Sanitize updates to prevent NOT NULL database crashes
    if (updates.challenge !== undefined && !updates.challenge) {
      updates.challenge = 'Client problem statement and project scope.';
    }
    if (updates.solution !== undefined && !updates.solution) {
      updates.solution = 'Strategic development and UI/UX implementation.';
    }
    if (updates.thumbnail !== undefined && !updates.thumbnail) {
      updates.thumbnail = '/portfolio-mockups/mobile-app.png';
    }
    if (updates.category !== undefined && !updates.category) {
      updates.category = 'Web & App Development';
    }

    let query = supabaseAdmin.from('portfolio_projects').update(updates);

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.select('*').maybeSingle();

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

    const isUuid = UUID_REGEX.test(id);

    if (isUuid) {
      const { error } = await supabaseAdmin.from('portfolio_projects').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      // If it's a string slug (like static mock id "ecommerce-ux-prototype"), delete by slug or complete gracefully
      await supabaseAdmin.from('portfolio_projects').delete().eq('slug', id);
    }

    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Portfolio delete error:', err);
    return NextResponse.json({ error: 'Failed to delete portfolio item.' }, { status: 500 });
  }
}
