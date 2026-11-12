import type { MetadataRoute } from 'next';
import { fetchServices, fetchPortfolio, fetchInsights, fetchPageVisibility } from '@/lib/dal';

/**
 * Revalidate sitemap at most every 60 seconds (Incremental Static Regeneration).
 * On-demand revalidation is also triggered immediately via `revalidatePath('/sitemap.xml')`
 * whenever an admin or Supabase webhook mutates services, insights, or portfolio projects.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growmybiz24.com';
  const baseUrl = rawBaseUrl.replace(/^[\uFEFF\s]+|[\uFEFF\s]+$/g, '').replace(/\/$/, '');
  const currentDate = new Date().toISOString();

  const [services, portfolioItems, blogPosts, visibility] = await Promise.all([
    fetchServices(),
    fetchPortfolio(),
    fetchInsights(),
    fetchPageVisibility(),
  ]);

  // Static core routes filtered by visibility
  const candidateStaticRoutes: Array<{
    key: keyof typeof visibility | 'home';
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { key: 'home', path: '', changeFrequency: 'daily', priority: 1.0 },
    { key: 'services', path: '/services', changeFrequency: 'daily', priority: 0.9 },
    { key: 'portfolio', path: '/portfolio', changeFrequency: 'daily', priority: 0.9 },
    { key: 'insights', path: '/insights', changeFrequency: 'daily', priority: 0.85 },
    { key: 'startProject', path: '/start-project', changeFrequency: 'weekly', priority: 0.85 },
    { key: 'estimator', path: '/estimator', changeFrequency: 'daily', priority: 0.9 },
    { key: 'audit', path: '/audit', changeFrequency: 'daily', priority: 0.9 },
    { key: 'about', path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { key: 'process', path: '/process', changeFrequency: 'monthly', priority: 0.8 },
    { key: 'contact', path: '/contact', changeFrequency: 'monthly', priority: 0.9 },
    { key: 'portal', path: '/portal', changeFrequency: 'weekly', priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = candidateStaticRoutes
    .filter((r) => r.key === 'home' || visibility[r.key] !== false)
    .map((r) => ({
      url: r.path ? `${baseUrl}${r.path}` : baseUrl,
      lastModified: currentDate,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }));

  // Dynamic service detail routes (only published services & visible services section)
  const serviceRoutes: MetadataRoute.Sitemap =
    visibility.services === false
      ? []
      : services
          .filter((s) => (s as any).published !== false && (s as any).is_published !== false)
          .map((s) => ({
            url: `${baseUrl}/services/${s.slug}`,
            lastModified: (s as any).updatedAt ? new Date((s as any).updatedAt).toISOString() : currentDate,
            changeFrequency: 'weekly',
            priority: 0.85,
          }));

  // Dynamic portfolio project routes
  const portfolioRoutes: MetadataRoute.Sitemap =
    visibility.portfolio === false
      ? []
      : portfolioItems
          .filter((p) => p.published)
          .map((p) => ({
            url: `${baseUrl}/portfolio/${p.slug}`,
            lastModified: (p as any).updatedAt ? new Date((p as any).updatedAt).toISOString() : currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          }));

  // Dynamic insight article routes
  const insightRoutes: MetadataRoute.Sitemap =
    visibility.insights === false
      ? []
      : blogPosts
          .filter((p) => p.published)
          .map((p) => ({
            url: `${baseUrl}/insights/${p.slug}`,
            lastModified: (p as any).updatedAt
              ? new Date((p as any).updatedAt).toISOString()
              : p.publishedAt
              ? new Date(p.publishedAt).toISOString()
              : currentDate,
            changeFrequency: 'monthly',
            priority: 0.75,
          }));

  // Legal documentation routes filtered by visibility
  const legalEntries: Array<{ slug: string; key: keyof typeof visibility }> = [
    { slug: 'privacy-policy', key: 'legalPrivacy' },
    { slug: 'terms-of-service', key: 'legalTerms' },
    { slug: 'cookie-policy', key: 'legalCookies' },
    { slug: 'refund-policy', key: 'legalRefund' },
    { slug: 'disclaimer', key: 'legalDisclaimer' },
    { slug: 'accessibility', key: 'legalAccessibility' },
  ];

  const legalRoutes: MetadataRoute.Sitemap = legalEntries
    .filter((item) => visibility[item.key] !== false)
    .map((item) => ({
      url: `${baseUrl}/legal/${item.slug}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...portfolioRoutes,
    ...insightRoutes,
    ...legalRoutes,
  ];
}
