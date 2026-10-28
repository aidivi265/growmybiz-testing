import type { Metadata, Viewport } from 'next';
import './globals.css';
import { inter, syne } from '@/lib/fonts';
import LayoutShell from '@/components/LayoutShell';
import { siteConfig } from '@/data/siteConfig';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1C31',
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: ['digital agency', 'web development', 'design', 'branding', 'digital marketing', 'AI automation', 'India', 'Growmybizz'],
  authors: [{ name: siteConfig.siteName }],
  creator: siteConfig.siteName,
  metadataBase: new URL('https://growmybizz.vercel.app'),
  icons: {
    icon: '/growmybizz-app-icon.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: 'en_IN',
    images: [
      {
        url: '/growmybizz-app-icon.png',
        width: 512,
        height: 512,
        alt: `${siteConfig.siteName} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/growmybizz-app-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
