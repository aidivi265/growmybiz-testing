import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioPageClient from './PortfolioPageClient';
import { fetchPortfolio, fetchPageVisibility, fetchBeforeAfterShowcases } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Case Studies & Digital Product Portfolio | Growmybiz24',
  description:
    'Explore verified case studies, interactive UI/UX prototypes, and high-performance digital platforms delivered by Growmybiz24.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Case Studies & Digital Product Portfolio | Growmybiz24',
    description:
      'Explore verified case studies, interactive UI/UX prototypes, and high-performance digital platforms delivered by Growmybiz24.',
    url: '/portfolio',
    type: 'website',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: 'Growmybiz24 Client Case Studies',
      },
    ],
  },
};

export default async function PortfolioPage() {
  const [items, visibility, beforeAfterItems] = await Promise.all([
    fetchPortfolio(),
    fetchPageVisibility(),
    fetchBeforeAfterShowcases(),
  ]);

  if (visibility.portfolio === false) {
    notFound();
  }

  return <PortfolioPageClient initialItems={items} beforeAfterItems={beforeAfterItems} />;
}
