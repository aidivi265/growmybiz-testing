import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProcessPreview from '@/components/home/ProcessPreview';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import InsightsPreview from '@/components/home/InsightsPreview';
import { fetchHeroSlides, fetchProcessSteps, fetchValueProps } from '@/lib/dal';

export const metadata: Metadata = {
  title: 'Growmybizz — Digital Growth Partner',
  description:
    'Full-service digital agency. Web, design, marketing, content and AI — built around one goal: your business growing online.',
};

export default async function HomePage() {
  const [heroSlides, processSteps, valueProps] = await Promise.all([
    fetchHeroSlides(),
    fetchProcessSteps(),
    fetchValueProps(),
  ]);

  return (
    <>
      <HeroSection initialSlides={heroSlides} />
      {/* Dark → White transition strip */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
      <ServicesSection />
      {/* White → Dark transition */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
      <ValuePropsSection items={valueProps} />
      {/* Dark → White transition */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
      <PortfolioPreview />
      {/* White → Dark transition */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
      <TestimonialsSection />
      {/* Dark → Dark transition */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0A1525, #152744, #0A1525)' }} />
      <ProcessPreview steps={processSteps} />
      {/* Dark → Light transition */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
      <InsightsPreview />
    </>
  );
}
