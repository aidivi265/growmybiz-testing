import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import AiCopilotGenerator from '@/components/home/AiCopilotGenerator';
import HomeAuditBar from '@/components/home/HomeAuditBar';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProcessPreview from '@/components/home/ProcessPreview';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import HomeEstimatorTeaser from '@/components/home/HomeEstimatorTeaser';
import InsightsPreview from '@/components/home/InsightsPreview';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
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
  fetchBeforeAfterShowcases,
} from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Growmybiz24 — Digital Solutions for a Bigger Tomorrow | Web, Design & AI Growth Agency',
  description:
    'Full-service digital growth agency in India. We engineer custom web platforms, scalable SaaS products, high-converting brand identities, and custom AI automation for global businesses.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Growmybiz24 — Digital Solutions for a Bigger Tomorrow',
    description:
      'Full-service digital growth agency in India. We engineer custom web platforms, scalable SaaS products, high-converting brand identities, and custom AI automation.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: 'Growmybiz24 — Digital Solutions for a Bigger Tomorrow',
      },
    ],
  },
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
    beforeAfterShowcases,
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
    fetchBeforeAfterShowcases(),
  ]);

  const totalOfferings = services.reduce(
    (acc, s) => acc + (Array.isArray(s.offerings) ? s.offerings.length : 0),
    0
  );

  return (
    <>
      {/* Hero Section with Interactive 3D Growth Orbit */}
      <HeroSection
        initialSlides={heroSlides}
        orbitConfig={orbitConfig}
        servicesCount={services.length}
        offeringsCount={totalOfferings > 0 ? totalOfferings : 30}
        portfolioCount={portfolio.length}
      />

      {/* Interactive AI Architecture Copilot & Blueprint Generator */}
      <AiCopilotGenerator />

      {/* Free Website & Technical SEO Diagnostic Lead Magnet */}
      <HomeAuditBar />

      {/* Services Section */}
      {visibility.services !== false && services.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
          <ServicesSection services={services} />
        </>
      )}

      {/* Value Propositions / Why Choose Growmybiz24 */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0F1C31, #1A2B4A, #0F1C31)' }} />
      <ValuePropsSection items={valueProps} />

      {/* Interactive Project Cost & Scope Estimator Preview */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
      <HomeEstimatorTeaser />

      {/* Interactive Before & After Transformation Slider */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
      <BeforeAfterSlider initialItems={beforeAfterShowcases} />

      {/* Portfolio Preview */}
      {visibility.portfolio !== false && portfolio.length > 0 && (
        <>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #1A2B4A, #243B66, #1A2B4A)' }} />
          <PortfolioPreview projects={portfolio} />
        </>
      )}

      {/* Testimonials (Only rendered if enabled and has real entries) */}
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
