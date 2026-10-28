import type { Metadata, Viewport } from 'next';
import './globals.css';
import { inter, syne } from '@/lib/fonts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/data';

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
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
