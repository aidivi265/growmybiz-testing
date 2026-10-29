import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { services as staticServices } from '@/data/services';
import { defaultServiceCategories } from '@/data/serviceCategories';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/services - List all services + niche categories map
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [servicesRes, categoriesRes] = await Promise.all([
      supabaseAdmin.from('services').select('*').order('order_index', { ascending: true }),
      supabaseAdmin.from('page_content').select('data').eq('id', 'service_categories').maybeSingle(),
    ]);

    const servicesList = servicesRes.data && servicesRes.data.length > 0 ? servicesRes.data : staticServices;
    const categoriesMap = categoriesRes.data?.data || defaultServiceCategories;

    return NextResponse.json({
      success: true,
      services: servicesList,
      categories: categoriesMap,
      source: servicesRes.data && servicesRes.data.length > 0 ? 'supabase' : 'static',
    });
  } catch (err) {
    console.warn('Admin services fetch fallback:', err);
  }

  return NextResponse.json({
    success: true,
    services: staticServices,
    categories: defaultServiceCategories,
    source: 'static',
  });
}

// POST /api/admin/services - Create new service or update categories map
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Dedicated action: Save niche industry categories
    if (body.action === 'save_categories') {
      const { categories_map } = body;
      if (!categories_map || typeof categories_map !== 'object') {
        return NextResponse.json({ error: 'Invalid categories_map' }, { status: 400 });
      }

      await supabaseAdmin
        .from('page_content')
        .upsert({
          id: 'service_categories',
          data: categories_map,
          updated_at: new Date().toISOString(),
        });

      revalidatePath('/services');
      return NextResponse.json({ success: true, categories: categories_map });
    }

    const {
      slug,
      title,
      short_description,
      description,
      icon_name,
      color,
      featured,
      offerings,
      deliverables,
      process_steps,
      faqs,
      order_index,
      is_published,
    } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([
        {
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          short_description: short_description || '',
          description: description || '',
          icon_name: icon_name || 'Code2',
          color: color || '#477BDB',
          featured: featured ?? true,
          offerings: offerings || [],
          deliverables: deliverables || [],
          process_steps: process_steps || [],
          faqs: faqs || [],
          order_index: order_index || 0,
          is_published: is_published ?? true,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Instant On-Demand Cache Revalidation
    revalidatePath('/services');
    revalidatePath(`/services/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, service: data });
  } catch (err) {
    console.error('Service create error:', err);
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}

// PUT /api/admin/services - Update existing service
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Instant On-Demand Cache Revalidation
    revalidatePath('/services');
    if (data?.slug) revalidatePath(`/services/${data.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, service: data });
  } catch (err) {
    console.error('Service update error:', err);
    return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 });
  }
}

// DELETE /api/admin/services - Delete service
export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('services').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Service delete error:', err);
    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
  }
}
