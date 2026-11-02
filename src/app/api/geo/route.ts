import { NextResponse } from 'next/server';
import { getCurrencyForCountry } from '@/data/currencyConfig';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Read location headers from edge/CDN proxies
  const headers = new Headers(request.headers);
  const countryHeader =
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    headers.get('x-country');

  const country = countryHeader ? countryHeader.trim().toUpperCase() : null;
  const currency = getCurrencyForCountry(country);

  return NextResponse.json(
    {
      success: true,
      country,
      currency,
      detected: Boolean(country),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
