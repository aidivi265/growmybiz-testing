import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsightsPageClient from './InsightsPageClient';
import { fetchInsights, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Practical guides and frameworks on web, design, marketing, AI and growth strategy.',
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
