import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { blogPosts as staticInsights } from '@/data/insights';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/insights - List all articles
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return NextResponse.json({ success: true, articles: data, source: 'supabase' });
    }
  } catch (err) {
    console.warn('Admin insights fetch fallback:', err);
  }

  return NextResponse.json({ success: true, articles: [], source: 'supabase' });
}

// POST /api/admin/insights - Create article
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content_markdown,
      cover_image,
      author,
      read_time,
      tags,
      is_published,
    } = body;

    if (!slug || !title || !content_markdown) {
      return NextResponse.json({ error: 'Title, slug, and content are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([
        {
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          excerpt: excerpt || '',
          content_markdown: content_markdown || '',
          cover_image: cover_image || '/portfolio-mockups/mobile-app.png',
          author: author || 'Growmybiz24 Team',
          read_time: read_time || '4 min read',
          tags: tags || [],
          is_published: is_published ?? true,
          published_at: is_published ? new Date().toISOString() : null,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/insights');
    revalidatePath(`/insights/${slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, article: data });
  } catch (err) {
    console.error('Article create error:', err);
    return NextResponse.json({ error: 'Failed to create article.' }, { status: 500 });
  }
}

// PUT /api/admin/insights - Update article
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath('/insights');
    if (data?.slug) revalidatePath(`/insights/${data.slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, article: data });
  } catch (err) {
    console.error('Article update error:', err);
    return NextResponse.json({ error: 'Failed to update article.' }, { status: 500 });
  }
}

// DELETE /api/admin/insights - Delete article
export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required.' }, { status: 400 });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      const { error } = await supabaseAdmin.from('articles').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      await supabaseAdmin.from('articles').delete().eq('slug', id);
    }

    revalidatePath('/insights');
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Article delete error:', err);
    return NextResponse.json({ error: 'Failed to delete article.' }, { status: 500 });
  }
}
