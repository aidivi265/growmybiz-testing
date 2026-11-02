import type { MetadataRoute } from 'next';
import { fetchServices, fetchPortfolio, fetchInsights } from '@/lib/dal';

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

  const [services, portfolioItems, blogPosts] = await Promise.all([
    fetchServices(),
    fetchPortfolio(),
    fetchInsights(),
  ]);

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/start-project`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/estimator`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/audit`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Dynamic service detail routes (only published services)
  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => (s as any).published !== false && (s as any).is_published !== false)
    .map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: (s as any).updatedAt ? new Date((s as any).updatedAt).toISOString() : currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  // Dynamic portfolio project routes (only published case studies)
  const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: (p as any).updatedAt ? new Date((p as any).updatedAt).toISOString() : currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  // Dynamic insight article routes (only published blog posts)
  const insightRoutes: MetadataRoute.Sitemap = blogPosts
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

  // Legal documentation routes
  const legalSlugs = [
    'privacy-policy',
    'terms-of-service',
    'cookie-policy',
    'refund-policy',
    'disclaimer',
    'accessibility',
  ];
  const legalRoutes: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${baseUrl}/legal/${slug}`,
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
