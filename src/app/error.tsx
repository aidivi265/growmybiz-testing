'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  MessageCircle,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { getClientSettings } from '@/lib/settingsClient';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';
import { trackGAEvent } from '@/components/GoogleAnalytics';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(
    `https://wa.me/${(siteConfig.whatsappNumber || '917290884480').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hi Growmybiz24 team! I encountered an error while browsing your website.'
    )}`
  );

  useEffect(() => {
    // Log exception for telemetry / monitoring
    console.error('[Application Error Boundary Caught]:', error);

    if (typeof window !== 'undefined') {
      const page = window.location.href;
      getClientSettings().then((data) => {
        let num = (
          data?.settings?.whatsappNumber ||
          siteConfig.whatsappNumber ||
          '917290884480'
        ).replace(/[^0-9]/g, '');
        if (num.length === 10) num = `91${num}`;

        const digestInfo = error.digest ? ` (Digest: ${error.digest})` : '';
        const msgSnippet = error.message ? ` - ${error.message.slice(0, 70)}` : '';

        setWhatsappUrl(
          `https://wa.me/${num}?text=${encodeURIComponent(
            `Hi Growmybiz24 Support! I encountered an unexpected error on ${page}${digestInfo}${msgSnippet}. Could you assist me?`
          )}`
        );
      });
    }
  }, [error]);

  const handleRetry = () => {
    setRetrying(true);
    trackGAEvent('click', {
      event_category: 'Error Boundary',
      event_label: 'Try Again',
      method: 'Error Page Action',
    });
    setTimeout(() => {
      reset();
      setRetrying(false);
    }, 300);
  };

  const handleWhatsAppClick = () => {
    trackGAEvent('contact', {
      event_category: 'Error Boundary',
      event_label: 'Report Glitch on WhatsApp',
      method: 'Error Page Action',
    });
  };

  const handleScheduleClick = () => {
    trackGAEvent('click', {
      event_category: 'Error Boundary',
      event_label: 'Schedule Strategy Call',
      method: 'Error Page Action',
    });
    setModalOpen(true);
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#0A101D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Unexpected System Hiccup • 500</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-bold font-syne text-white tracking-tight mb-4 leading-tight">
          Something Went Temporarily Wrong
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          We encountered an unexpected glitch while rendering this section. Your session data is intact, and our engineering team has been notified.
        </p>

        {/* Technical Digest Tag */}
        {error.digest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-white/50 mb-8">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Incident Reference: {error.digest}</span>
          </div>
        )}

        {/* Primary Action Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10">
          {/* Action 1: Instant Retry */}
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Refreshing...' : 'Try Again'}</span>
          </button>

          {/* Action 2: Report Glitch on WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#25D366] to-[#1FB855] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/40"
          >
            <MessageCircle className="w-4 h-4 fill-white/20 text-white shrink-0" />
            <span>Report on WhatsApp</span>
          </a>

          {/* Action 3: Schedule Strategy Call */}
          <button
            type="button"
            onClick={handleScheduleClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/40 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span>Schedule Call</span>
          </button>

          {/* Action 4: Homepage Fallback */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>

        {/* Quick Route Recovery */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
          <span>Need immediate assistance?</span>
          <Link href="/services" className="text-white hover:text-emerald-400 underline underline-offset-4 flex items-center gap-1">
            <Layers size={12} /> View Services
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/contact" className="text-white hover:text-blue-400 underline underline-offset-4 flex items-center gap-1">
            Contact Support <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Discovery Strategy Call Modal */}
      <ScheduleCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
