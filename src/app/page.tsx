import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProcessPreview from '@/components/home/ProcessPreview';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import InsightsPreview from '@/components/home/InsightsPreview';
import {
  fetchHeroSlides,
  fetchOrbitConfig,
  fetchServices,
  fetchPortfolio,
  fetchTestimonials,
  fetchProcessSteps,
  fetchValueProps,
  fetchInsights,
  fetchPageVisibility,
} from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Growmybiz24 — Digital Solutions for a Bigger Tomorrow | Web, Design & AI Growth Agency',
  description:
    'Full-service digital growth agency in India. We engineer custom web platforms, scalable SaaS products, high-converting brand identities, and custom AI automation for global businesses.',
};

export default async function HomePage() {
  const [
    heroSlides,
    orbitConfig,
    services,
    portfolio,
    testimonials,
    processSteps,
    valueProps,
    insights,
    visibility,
  ] = await Promise.all([
    fetchHeroSlides(),
    fetchOrbitConfig(),
    fetchServices(),
    fetchPortfolio(),
    fetchTestimonials(),
    fetchProcessSteps(),
    fetchValueProps(),
    fetchInsights(),
    fetchPageVisibility(),
  ]);

  return (
    <>
      <HeroSection initialSlides={heroSlides} orbitConfig={orbitConfig} />

      {/* Services Section */}
      {visibility.services !== false && services.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
          <ServicesSection services={services} />
        </>
      )}

      {/* Value Propositions / Why Us */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
      <ValuePropsSection items={valueProps} />

      {/* Portfolio Preview */}
      {visibility.portfolio !== false && portfolio.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
          <PortfolioPreview projects={portfolio} />
        </>
      )}

      {/* Testimonials (Only rendered if enabled and has at least 1 real testimonial) */}
      {visibility.testimonials !== false && testimonials && testimonials.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
          <TestimonialsSection testimonials={testimonials} />
        </>
      )}

      {/* Process Preview */}
      {visibility.process !== false && processSteps.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #0A1525, #152744, #0A1525)' }} />
          <ProcessPreview steps={processSteps} />
        </>
      )}

      {/* Insights / Articles Preview */}
      {visibility.insights !== false && insights.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
          <InsightsPreview posts={insights} />
        </>
      )}
    </>
  );
}
