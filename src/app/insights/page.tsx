import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsightsPageClient from './InsightsPageClient';
import { fetchInsights, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Insights, Tech Blog & Strategic Guides | Growmybiz24',
  description:
    'Actionable engineering frameworks, CRO strategies, and practical AI implementations for scaling modern businesses.',
  alternates: {
    canonical: '/insights',
  },
  openGraph: {
    title: 'Insights, Tech Blog & Strategic Guides | Growmybiz24',
    description:
      'Actionable engineering frameworks, CRO strategies, and practical AI implementations for scaling modern businesses.',
    url: '/insights',
    type: 'website',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: 'Growmybiz24 Insights & Engineering Blog',
      },
    ],
  },
};

export default async function InsightsPage() {
  const [articles, visibility] = await Promise.all([
    fetchInsights(),
    fetchPageVisibility(),
  ]);

  if (visibility.insights === false) {
    notFound();
  }

  return <InsightsPageClient initialArticles={articles} />;
}
