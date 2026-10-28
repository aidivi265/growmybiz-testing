import type { Metadata } from 'next';
import PortfolioPageClient from './PortfolioPageClient';
import { fetchPortfolio } from '@/lib/dal';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Concept projects, frameworks and client work — labelled clearly, described honestly.',
};

export default async function PortfolioPage() {
  const items = await fetchPortfolio();
  return <PortfolioPageClient initialItems={items} />;
}
