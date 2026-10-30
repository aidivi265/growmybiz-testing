import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growmybiz24.com';

  return {
    rules: [
      // 1. General rules for legitimate search engines
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/private/',
        ],
      },
      // 2. Explicitly ban aggressive commercial AI training scrapers & data miners
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'ClaudeBot',
          'Claude-Web',
          'Bytespider',
          'Diffbot',
          'cohere-ai',
          'Omgilibot',
          'PerplexityBot',
          'Scrapy',
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'MegaIndex',
          'ZoominfoBot',
          'Seekport',
          'PetalBot',
        ],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
