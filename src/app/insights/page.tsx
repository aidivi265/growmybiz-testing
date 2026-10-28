import type { Metadata } from 'next';
import InsightsPageClient from './InsightsPageClient';
import { fetchInsights } from '@/lib/dal';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Practical guides and frameworks on web, design, marketing, AI and growth strategy.',
};

export default async function InsightsPage() {
  const articles = await fetchInsights();
  return <InsightsPageClient initialArticles={articles} />;
}
