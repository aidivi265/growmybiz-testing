import type { Metadata, Viewport } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/data';

// next/font — self-hosted at build time, zero render-blocking, no external request
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-inter',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
