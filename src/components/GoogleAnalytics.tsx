'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Dispatch custom GA4 and Google Ads conversion events.
 * Safe to call anywhere in client code even if GA4 is not yet initialized or disabled.
 */
export function trackGAEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, eventParams);
    } catch {
      // Gracefully prevent analytics errors from disrupting user experience
    }
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

function AnalyticsTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      window.gtag('config', measurementId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, measurementId]);

  return null;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId =
    measurementId ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || gaId.trim().length === 0 || !gaId.startsWith('G-')) {
    return null;
  }

  const cleanGaId = gaId.trim();

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${cleanGaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${cleanGaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              send_page_view: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker measurementId={cleanGaId} />
      </Suspense>
    </>
  );
}
