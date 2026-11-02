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
const DEFAULT_THUMBNAIL = '/portfolio/ecommerce-ux.svg';

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
      // Normalize snake_case DB columns to both formats so UI components never break
      const normalizedProjects = data.map((p) => {
        const rawMetrics = Array.isArray(p.metrics) ? p.metrics : [];
        const industry = (p as any).industry || rawMetrics.find((m: any) => m.label === '_industry')?.value || '';
        const serviceSlug = (p as any).serviceSlug || rawMetrics.find((m: any) => m.label === '_serviceSlug')?.value || 'web-app-development';
        const liveUrl = (p as any).live_url || (p as any).liveUrl || rawMetrics.find((m: any) => m.label === '_liveUrl')?.value || '';

        return {
          ...p,
          id: p.id,
          slug: p.slug,
          title: p.title,
          client: p.client,
          category: p.category,
          industry,
          serviceSlug,
          liveUrl,
          live_url: liveUrl,
          thumbnail: p.thumbnail || DEFAULT_THUMBNAIL,
          challenge: p.challenge || '',
          solution: p.solution || '',
          outcome: p.outcome || '',
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          gallery: Array.isArray(p.gallery) ? p.gallery : [p.thumbnail || DEFAULT_THUMBNAIL],
          isConcept: p.is_concept ?? false,
          is_concept: p.is_concept ?? false,
          featured: p.is_featured ?? true,
          is_featured: p.is_featured ?? true,
          published: p.is_published ?? true,
          is_published: p.is_published ?? true,
          year: p.year || '2025',
          order_index: p.order_index ?? 0,
        };
      });

      return NextResponse.json({ success: true, projects: normalizedProjects, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Admin portfolio fetch fallback:', err);
  }

  return NextResponse.json({ success: true, projects: [], source: 'supabase' });
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
      deliverables,
      metrics,
      technologies,
      gallery,
      is_concept,
      is_featured,
      is_published,
      order_index,
      liveUrl,
      live_url,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Project Title is required.' }, { status: 400 });
    }
    if (!client?.trim()) {
      return NextResponse.json({ error: 'Client or Brand Name is required.' }, { status: 400 });
    }

    const cleanSlug = (slug?.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!cleanSlug) {
      return NextResponse.json({ error: 'URL Slug is required and must contain alphanumeric characters.' }, { status: 400 });
    }

    // Pack liveUrl into metrics JSONB so no missing-column error can occur
    const targetLiveUrl = (liveUrl || live_url || '').trim();
    let metricsArray = Array.isArray(metrics) ? [...metrics] : [];
    if (targetLiveUrl) {
      metricsArray = metricsArray.filter((m: any) => m.label !== '_liveUrl');
      metricsArray.push({ label: '_liveUrl', value: targetLiveUrl });
    }

    // Determine highest priority order index (place newly created project at top)
    const { data: firstProj } = await supabaseAdmin
      .from('portfolio_projects')
      .select('order_index')
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();

    const topOrderIndex = typeof order_index === 'number'
      ? order_index
      : (firstProj && typeof firstProj.order_index === 'number' ? firstProj.order_index - 1 : 0);

    const newRecord = {
      slug: cleanSlug,
      title: title.trim(),
      client: client.trim(),
      category: category?.trim() || 'Web & App Development',
      year: String(year || '2025'),
      thumbnail: thumbnail?.trim() || DEFAULT_THUMBNAIL,
      challenge: challenge?.trim() || '',
      solution: solution?.trim() || '',
      outcome: outcome?.trim() || '',
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      metrics: metricsArray,
      technologies: Array.isArray(technologies) ? technologies : [],
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [thumbnail?.trim() || DEFAULT_THUMBNAIL],
      is_concept: is_concept ?? false,
      is_featured: is_featured ?? true,
      is_published: is_published ?? true,
      order_index: topOrderIndex,
    };

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert([newRecord])
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        return NextResponse.json(
          { error: `A project with URL slug "${cleanSlug}" already exists. Please choose a slightly different slug.` },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${cleanSlug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, project: data });
  } catch (err: any) {
    console.error('Portfolio create error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create portfolio item.' }, { status: 500 });
  }
}

// PUT /api/admin/portfolio - Update portfolio item
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, liveUrl, live_url, ...rawUpdates } = body;
    const updates: Record<string, any> = { ...rawUpdates };

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    // Safely update liveUrl inside metrics JSONB
    if (liveUrl !== undefined || live_url !== undefined) {
      const targetLiveUrl = (liveUrl || live_url || '').trim();
      let metricsArray = Array.isArray(updates.metrics) ? [...updates.metrics] : [];
      metricsArray = metricsArray.filter((m: any) => m.label !== '_liveUrl');
      if (targetLiveUrl) {
        metricsArray.push({ label: '_liveUrl', value: targetLiveUrl });
      }
      updates.metrics = metricsArray;
    }

    const isUuid = UUID_REGEX.test(id);

    if (updates.slug) {
      updates.slug = updates.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (updates.thumbnail && !updates.thumbnail.trim()) {
      updates.thumbnail = DEFAULT_THUMBNAIL;
    }

    let query = supabaseAdmin.from('portfolio_projects').update(updates);

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.select('*').maybeSingle();

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        return NextResponse.json(
          { error: `URL slug "${updates.slug}" is already taken by another project. Please choose another.` },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/portfolio');
    if (data?.slug) revalidatePath(`/portfolio/${data.slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, project: data });
  } catch (err: any) {
    console.error('Portfolio update error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update portfolio item.' }, { status: 500 });
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
      await supabaseAdmin.from('portfolio_projects').delete().eq('slug', id);
    }

    revalidatePath('/portfolio');
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err: any) {
    console.error('Portfolio delete error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete portfolio item.' }, { status: 500 });
  }
}

// PATCH /api/admin/portfolio - Reorder projects sequence
export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Array of items with id and order_index is required.' }, { status: 400 });
    }

    // Update each project's order_index in Supabase
    const updatePromises = items.map((it: { id: string; order_index: number }) => {
      const isUuid = UUID_REGEX.test(it.id);
      if (isUuid) {
        return supabaseAdmin
          .from('portfolio_projects')
          .update({ order_index: it.order_index })
          .eq('id', it.id);
      } else {
        return supabaseAdmin
          .from('portfolio_projects')
          .update({ order_index: it.order_index })
          .eq('slug', it.id);
      }
    });

    await Promise.all(updatePromises);

    revalidatePath('/portfolio');
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, reorderedCount: items.length });
  } catch (err: any) {
    console.error('Portfolio reorder error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to reorder projects' }, { status: 500 });
  }
}
