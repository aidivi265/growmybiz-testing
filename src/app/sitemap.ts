import type { MetadataRoute } from 'next';
import { fetchServices, fetchPortfolio, fetchInsights } from '@/lib/dal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growmybiz24.com';
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
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
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
      url: `${baseUrl}/insights`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Dynamic service detail routes
  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic portfolio project routes
  const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  // Dynamic insight article routes
  const insightRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/insights/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt).toISOString() : currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

  // Legal routes
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
