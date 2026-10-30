import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactPageClient from './ContactPageClient';
import { fetchServices, fetchSiteSettings, fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact — Start a Project',
  description: 'Tell us about your project. We will respond with a clear scope and no ambiguity.',
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
