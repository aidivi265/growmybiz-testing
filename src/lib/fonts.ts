/**
 * Shared next/font instances — import SYNE_FONT / INTER_FONT anywhere
 * you need the resolved font-family string in an inline style prop.
 *
 * Display: Plus Jakarta Sans — sharp, modern, premium editorial feel
 * Body:    DM Sans — clean, geometric, highly readable
 */
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';

export const inter = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const syne = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
});

// Resolved font-family strings — safe in inline style props (same on server + client)
export const SYNE_FONT = syne.style.fontFamily;
export const INTER_FONT = inter.style.fontFamily;
