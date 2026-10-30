import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioPageClient from './PortfolioPageClient';
import { fetchPortfolio, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Case Studies & Digital Product Portfolio | Growmybiz24',
  description:
    'Explore verified case studies, interactive UI/UX prototypes, and high-performance digital platforms delivered by Growmybiz24.',
};

export default async function PortfolioPage() {
  const [items, visibility] = await Promise.all([
    fetchPortfolio(),
    fetchPageVisibility(),
  ]);

  if (visibility.portfolio === false) {
    notFound();
  }

  return <PortfolioPageClient initialItems={items} />;
}
