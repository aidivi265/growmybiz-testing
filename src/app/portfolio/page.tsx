import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioPageClient from './PortfolioPageClient';
import { fetchPortfolio, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Concept projects, frameworks and client work — labelled clearly, described honestly.',
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
