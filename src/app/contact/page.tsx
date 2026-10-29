import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { fetchServices, fetchSiteSettings } from '@/lib/dal';

export const metadata: Metadata = {
  title: 'Contact — Start a Project',
  description: 'Tell us about your project. We will respond with a clear scope and no ambiguity.',
};

export default async function ContactPage() {
  const [services, settings] = await Promise.all([
    fetchServices(),
    fetchSiteSettings(),
  ]);
  return <ContactPageClient initialServices={services} initialSettings={settings} />;
}
