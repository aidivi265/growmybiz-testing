import { revalidatePath } from 'next/cache';

export type RevalidatableEntity = 'services' | 'insights' | 'portfolio' | 'legal' | 'seo' | 'all';

export interface RevalidationResult {
  success: boolean;
  revalidatedPaths: string[];
  timestamp: string;
  error?: string;
}

/**
 * Centralized on-demand cache revalidation utility.
 * Synchronizes Supabase database mutations immediately with:
 *  - Dynamic Sitemap (`/sitemap.xml`)
 *  - Public listing pages (`/services`, `/portfolio`, `/insights`)
 *  - Item detail pages and their OpenGraph social image endpoints
 *  - The homepage aggregators (`/`)
 */
export function revalidateContentCache(
  entity: RevalidatableEntity,
  slug?: string | null
): RevalidationResult {
  const pathsPurged: string[] = [];

  try {
    // 1. Critical: Revalidate the dynamic sitemap so search engines always get fresh XML
    revalidatePath('/sitemap.xml');
    pathsPurged.push('/sitemap.xml');

    // 2. Revalidate homepage
    revalidatePath('/');
    pathsPurged.push('/');

    // 3. Entity-specific route invalidations
    if (entity === 'services' || entity === 'all') {
      revalidatePath('/services');
      pathsPurged.push('/services');
      if (slug) {
        revalidatePath(`/services/${slug}`);
        revalidatePath(`/services/${slug}/opengraph-image`);
        pathsPurged.push(`/services/${slug}`, `/services/${slug}/opengraph-image`);
      }
    }

    if (entity === 'portfolio' || entity === 'all') {
      revalidatePath('/portfolio');
      pathsPurged.push('/portfolio');
      if (slug) {
        revalidatePath(`/portfolio/${slug}`);
        revalidatePath(`/portfolio/${slug}/opengraph-image`);
        pathsPurged.push(`/portfolio/${slug}`, `/portfolio/${slug}/opengraph-image`);
      }
    }

    if (entity === 'insights' || entity === 'all') {
      revalidatePath('/insights');
      pathsPurged.push('/insights');
      if (slug) {
        revalidatePath(`/insights/${slug}`);
        revalidatePath(`/insights/${slug}/opengraph-image`);
        pathsPurged.push(`/insights/${slug}`, `/insights/${slug}/opengraph-image`);
      }
    }

    if (entity === 'legal' || entity === 'all') {
      if (slug) {
        revalidatePath(`/legal/${slug}`);
        pathsPurged.push(`/legal/${slug}`);
      }
    }

    return {
      success: true,
      revalidatedPaths: pathsPurged,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error(`[Revalidation Error] Failed during cache purge for ${entity}:`, err);
    return {
      success: false,
      revalidatedPaths: pathsPurged,
      timestamp: new Date().toISOString(),
      error: err?.message || String(err),
    };
  }
}
