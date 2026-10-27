import type { Metadata } from 'next';
import PortfolioPageClient from './PortfolioPageClient';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Concept projects, frameworks and client work — labelled clearly, described honestly.',
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
