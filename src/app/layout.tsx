import type { Metadata, Viewport } from 'next';
import './globals.css';
import { inter, syne } from '@/lib/fonts';
import LayoutShell from '@/components/LayoutShell';
import { siteConfig } from '@/data/siteConfig';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { fetchSiteSettings, fetchPageVisibility } from '@/lib/dal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1C31',
};

const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growmybiz24.com';
const baseUrl = rawBaseUrl.replace(/^[\uFEFF\s]+|[\uFEFF\s]+$/g, '');

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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, pageVisibility] = await Promise.all([
    fetchSiteSettings(),
    fetchPageVisibility(),
  ]);

  const visibleSameAs = [
    siteSettings.socialVisibility?.linkedin !== false && (siteSettings.social?.linkedin || siteConfig.social.linkedin),
    siteSettings.socialVisibility?.instagram !== false && (siteSettings.social?.instagram || siteConfig.social.instagram),
    siteSettings.socialVisibility?.twitter !== false && (siteSettings.social?.twitter || siteConfig.social.twitter),
    siteSettings.socialVisibility?.youtube !== false && (siteSettings.social?.youtube || siteConfig.social.youtube),
  ].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${baseUrl}/#organization`,
        name: siteSettings.siteName || 'Growmybiz24',
        alternateName: 'Growmybiz24 Digital Agency',
        url: baseUrl,
        logo: `${baseUrl}/brand-logo-white-bg.png`,
        image: `${baseUrl}/brand-logo-white-bg.png`,
        description: siteSettings.description || siteConfig.description,
        telephone: siteSettings.phone || siteConfig.phone,
        email: siteSettings.email || siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New Delhi',
          addressCountry: 'IN',
        },
        sameAs: visibleSameAs,
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
        name: siteSettings.siteName || 'Growmybiz24',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
    ],
  };

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
        <GoogleAnalytics measurementId={siteSettings?.googleAnalyticsId} />
      </body>
    </html>
  );
}
