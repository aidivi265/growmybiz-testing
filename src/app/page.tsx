import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import ProcessPreview from '@/components/home/ProcessPreview';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import InsightsPreview from '@/components/home/InsightsPreview';

export const metadata: Metadata = {
  title: 'Growmybizz — Digital Growth Partner',
  description:
    'Full-service digital agency. Web, design, marketing, content and AI — built around one goal: your business growing online.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ValuePropsSection />
      <PortfolioPreview />
      <ProcessPreview />
      <InsightsPreview />
    </>
  );
}
