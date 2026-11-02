import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { revalidateContentCache, RevalidatableEntity } from '@/lib/revalidate';

// Default revalidation secret fallback if env var is not set
const DEFAULT_SECRET = process.env.REVALIDATION_SECRET || process.env.ADMIN_SECRET_KEY || 'growmybiz24_sync_revalidate_2025';

async function isAuthorized(request: Request): Promise<boolean> {
  // 1. Check admin session cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (token && verifySessionToken(token)) {
      return true;
    }
  } catch {
    // Ignore and proceed to token check
  }

  // 2. Check header or query parameter secret
  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const customSecret = request.headers.get('x-revalidate-secret');

  const providedSecret =
    querySecret ||
    customSecret ||
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (
    providedSecret &&
    (providedSecret === DEFAULT_SECRET ||
      (process.env.SUPABASE_SERVICE_ROLE_KEY && providedSecret === process.env.SUPABASE_SERVICE_ROLE_KEY))
  ) {
    return true;
  }

  return false;
}

/**
 * GET /api/revalidate
 * Supports quick browser or crawler ping with secret:
 * e.g. /api/revalidate?secret=...&path=/sitemap.xml
 */
export async function GET(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized. Invalid or missing revalidation secret.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const targetPath = url.searchParams.get('path') || '/sitemap.xml';
  const entity = (url.searchParams.get('entity') as RevalidatableEntity) || 'all';

  if (targetPath) {
    revalidatePath(targetPath);
  }

  const result = revalidateContentCache(entity);

  return NextResponse.json({
    success: true,
    message: `Successfully revalidated ${targetPath} and dynamic content caches.`,
    revalidatedPaths: Array.from(new Set([targetPath, ...result.revalidatedPaths])),
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/revalidate
 * Supports:
 *  1. Supabase Database Webhook payloads (triggered by database inserts/updates/deletes)
 *  2. Manual Admin Dashboard or CI/CD revalidation calls
 */
export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized. Invalid or missing revalidation secret.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    // Case 1: Supabase Database Webhook format
    // e.g. { type: 'INSERT' | 'UPDATE' | 'DELETE', table: 'services', record: { slug: '...' }, old_record: { slug: '...' } }
    if (body.table) {
      let entity: RevalidatableEntity = 'all';
      let slug = body.record?.slug || body.old_record?.slug;

      if (body.table === 'services') entity = 'services';
      else if (body.table === 'articles') entity = 'insights';
      else if (body.table === 'portfolio_projects') entity = 'portfolio';
      else if (body.table === 'seo_metadata') entity = 'seo';
      else if (body.table === 'page_content' && body.record?.id?.startsWith('legal_')) {
        entity = 'legal';
        slug = body.record.id.replace('legal_', '');
      }

      const result = revalidateContentCache(entity, slug);

      return NextResponse.json({
        success: true,
        source: 'supabase_webhook',
        table: body.table,
        action: body.type,
        revalidatedPaths: result.revalidatedPaths,
        timestamp: result.timestamp,
      });
    }

    // Case 2: Explicit path or entity purge
    if (body.path) {
      revalidatePath(body.path);
    }

    const entity: RevalidatableEntity = body.entity || 'all';
    const slug: string | undefined = body.slug;
    const result = revalidateContentCache(entity, slug);

    return NextResponse.json({
      success: true,
      source: 'manual',
      revalidatedPaths: Array.from(new Set([...(body.path ? [body.path] : []), ...result.revalidatedPaths])),
      timestamp: result.timestamp,
    });
  } catch (err: any) {
    console.error('Revalidation API error:', err);
    return NextResponse.json({ error: 'Revalidation failed', details: err?.message }, { status: 500 });
  }
}
