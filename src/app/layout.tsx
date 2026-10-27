import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: ['digital agency', 'web development', 'design', 'branding', 'digital marketing', 'AI automation', 'India'],
  authors: [{ name: siteConfig.siteName }],
  creator: siteConfig.siteName,
  metadataBase: new URL('https://growmybizz.com'),
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
