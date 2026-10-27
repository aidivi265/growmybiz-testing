import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact — Start a Project',
  description: 'Tell us about your project. We will respond with a clear scope and no ambiguity.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
