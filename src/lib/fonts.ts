/**
 * Shared next/font instances — import SYNE_FONT / INTER_FONT anywhere
 * you need the resolved font-family string in an inline style prop.
 *
 * Usage in a component:
 *   import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';
 *   <h1 style={{ fontFamily: SYNE_FONT }}>…</h1>
 */
import { Inter, Syne } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
});

// These are the resolved font-family strings (e.g. "__Syne_abc123, __Syne_Fallback_abc123")
// Safe to use in inline style={{ fontFamily: SYNE_FONT }} — same value on server and client
export const SYNE_FONT = syne.style.fontFamily;
export const INTER_FONT = inter.style.fontFamily;
