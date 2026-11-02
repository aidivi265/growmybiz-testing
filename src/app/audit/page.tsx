import type { Metadata } from 'next';
import WebsiteAuditClient from '@/components/audit/WebsiteAuditClient';

export const revalidate = 60; // 60s ISR revalidation window

export const metadata: Metadata = {
  title: 'Free Website & Technical SEO Audit Tool | Growmybiz24',
  description:
    'Instant speed, SEO, mobile responsiveness, and security audit for your website. Get actionable Google Core Web Vitals insights and performance grades in seconds.',
  openGraph: {
    title: 'Free Website & Technical SEO Audit Tool | Growmybiz24',
    description:
      'Audit your website across Google Core Web Vitals, technical SEO architecture, mobile responsiveness, and security headers in seconds.',
    url: 'https://growmybiz24.com/audit',
    siteName: 'Growmybiz24',
    type: 'website',
  },
};

export default function AuditPage() {
  return <WebsiteAuditClient />;
}
