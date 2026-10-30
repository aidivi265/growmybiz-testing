import type { Metadata, Viewport } from 'next';
import './globals.css';
import { inter, syne } from '@/lib/fonts';
import LayoutShell from '@/components/LayoutShell';
import { siteConfig } from '@/data/siteConfig';
import { Analytics } from '@vercel/analytics/next';
import { fetchSiteSettings, fetchPageVisibility } from '@/lib/dal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1C31',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growmybiz24.com';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: [
    'Growmybiz24',
    'Growmybiz24 Digital Agency',
    'Web Development Company India',
    'Next.js Full Stack Development',
    'Custom AI Automation Solutions',
    'UI UX Design Agency India',
    'Performance Marketing Agency',
    'E-commerce Growth Partner',
    'B2B SaaS Product Engineering',
    'Digital Solutions for a Bigger Tomorrow',
  ],
  authors: [{ name: siteConfig.siteName, url: baseUrl }],
  creator: siteConfig.siteName,
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/brand-logo-mark.png', type: 'image/png' },
    ],
    apple: [
      { url: '/brand-logo-mark.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: baseUrl,
    locale: 'en_IN',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.siteName} — ${siteConfig.tagline}`,
      },
      {
        url: '/growmybizz-app-icon.png',
        width: 512,
        height: 512,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: '@growmybiz24',
    site: '@growmybiz24',
    images: ['/brand-logo-white-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${baseUrl}/#organization`,
      name: 'Growmybiz24',
      alternateName: 'Growmybiz24 Digital Agency',
      url: baseUrl,
      logo: `${baseUrl}/brand-logo-white-bg.png`,
      image: `${baseUrl}/brand-logo-white-bg.png`,
      description: siteConfig.description,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New Delhi',
        addressCountry: 'IN',
      },
      sameAs: [
        siteConfig.social.linkedin,
        siteConfig.social.instagram,
        siteConfig.social.twitter,
        siteConfig.social.youtube,
      ],
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR, USD, EUR, GBP',
      paymentAccepted: 'UPI, Net Banking, Credit Card, Bank Transfer',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Growmybiz24',
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, pageVisibility] = await Promise.all([
    fetchSiteSettings(),
    fetchPageVisibility(),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/brand-logo-mark.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LayoutShell initialSettings={siteSettings} initialVisibility={pageVisibility}>
          {children}
        </LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
