import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactPageClient from './ContactPageClient';
import { fetchServices, fetchSiteSettings, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact Us | Start a Project & Technical Scoping',
  description: 'Tell us about your project. We will respond with a clear scope and no ambiguity.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Start a Project | Growmybiz24',
    description: 'Tell us about your project. We will respond with a clear scope and no ambiguity within 24 hours.',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: 'Contact Growmybiz24',
      },
    ],
  },
};

export default async function ContactPage() {
  const [services, settings, visibility] = await Promise.all([
    fetchServices(),
    fetchSiteSettings(),
    fetchPageVisibility(),
  ]);

  if (visibility.contact === false) {
    notFound();
  }

  return <ContactPageClient initialServices={services} initialSettings={settings} />;
}
