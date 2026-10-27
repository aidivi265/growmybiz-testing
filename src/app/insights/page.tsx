import type { Metadata } from 'next';
import InsightsPageClient from './InsightsPageClient';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Practical guides and frameworks on web, design, marketing, AI and growth strategy.',
};

export default function InsightsPage() {
  return <InsightsPageClient />;
}
