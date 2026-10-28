/**
 * Shared next/font instances — optimized variable font loading.
 *
 * Display: Plus Jakarta Sans — sharp, modern, premium editorial feel (variable font)
 * Body:    DM Sans — clean, geometric, highly readable (variable font)
 */
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';

export const inter = DM_Sans({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const syne = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

// Resolved font-family strings — safe in inline style props (same on server + client)
export const SYNE_FONT = syne.style.fontFamily;
export const INTER_FONT = inter.style.fontFamily;
