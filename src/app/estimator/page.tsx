import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchEstimatorConfig, fetchPageVisibility } from '@/lib/dal';
import ProjectEstimatorClient from '@/components/estimator/ProjectEstimatorClient';

export const revalidate = 60; // 60s ISR revalidation window

export const metadata: Metadata = {
  title: 'Interactive Project Cost & Scope Estimator | Growmybiz24',
  description:
    'Calculate your project investment range and delivery timeline instantly in INR (₹). Customize platforms, design fidelity, and feature modules for web, mobile apps, AI, and digital marketing.',
  openGraph: {
    title: 'Interactive Project Cost & Scope Estimator | Growmybiz24',
    description:
      'Get transparent INR investment ranges and timelines for custom software, websites, mobile apps, AI agents, and branding.',
    url: 'https://growmybiz24.com/estimator',
    siteName: 'Growmybiz24',
    type: 'website',
  },
};

export default async function EstimatorPage() {
  const [config, visibility] = await Promise.all([
    fetchEstimatorConfig(),
    fetchPageVisibility(),
  ]);

  if (visibility.estimator === false) {
    notFound();
  }

  return <ProjectEstimatorClient initialConfig={config} />;
}
