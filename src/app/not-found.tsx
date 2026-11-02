'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Home,
  MessageCircle,
  Calendar,
  Layers,
  Briefcase,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { getClientSettings } from '@/lib/settingsClient';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';
import { trackGAEvent } from '@/components/GoogleAnalytics';

export default function NotFound() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState(
    `https://wa.me/${(siteConfig.whatsappNumber || '917290884480').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hi Growmybiz24 team! I encountered a 404 broken link on your website and would like assistance.'
    )}`
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      setCurrentPath(window.location.pathname);

      getClientSettings().then((data) => {
        let num = (
          data?.settings?.whatsappNumber ||
          siteConfig.whatsappNumber ||
          '917290884480'
        ).replace(/[^0-9]/g, '');
        if (num.length === 10) num = `91${num}`;
        setWhatsappUrl(
          `https://wa.me/${num}?text=${encodeURIComponent(
            `Hi Growmybiz24 team! I encountered a 404 page on: ${fullUrl}. Can you guide me to what I was looking for?`
          )}`
        );
      });
    }
  }, []);

  const handleWhatsAppClick = () => {
    trackGAEvent('contact', {
      event_category: '404 Error Page',
      event_label: 'Report on WhatsApp',
      method: '404 Page Action',
    });
  };

  const handleScheduleClick = () => {
    trackGAEvent('click', {
      event_category: '404 Error Page',
      event_label: 'Schedule Strategy Call',
      method: '404 Page Action',
    });
    setModalOpen(true);
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#0A101D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Compass className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '9s' }} />
          <span>Page Not Found • Error 404</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-bold font-syne text-white tracking-tight mb-4 leading-tight">
          Lost in Digital Space?
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          {currentPath ? (
            <>
              The link <span className="font-mono text-emerald-400 px-1 py-0.5 rounded bg-emerald-500/10 text-xs">{currentPath}</span> was moved, renamed, or no longer exists.
            </>
          ) : (
            "The page you are looking for has been relocated or doesn't exist."
          )}{' '}
          Don&apos;t worry—our team is active 24/7 to help you get back on course.
        </p>

        {/* Primary Conversion Actions: WhatsApp & Schedule Call */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10">
          {/* Action 1: Report on WhatsApp */}
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

          {/* Action 2: Schedule Discovery Call */}
          <button
            type="button"
            onClick={handleScheduleClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/40 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span>Schedule Strategy Call</span>
          </button>

          {/* Action 3: Return Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>

        {/* Quick Route Recovery Suggestions */}
        <div className="pt-8 border-t border-white/10 text-left">
          <p className="text-xs uppercase tracking-wider text-white/40 font-mono mb-3 text-center sm:text-left">
            Popular destinations to explore:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Link
              href="/services"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Layers size={13} className="text-emerald-400" />
                  Services
                </span>
                <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-white/50 mt-1 line-clamp-1">Web, App & AI Dev</p>
            </Link>

            <Link
              href="/portfolio"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-blue-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-blue-400" />
                  Case Studies
                </span>
                <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-white/50 mt-1 line-clamp-1">15+ Live Deliveries</p>
            </Link>

            <Link
              href="/start-project"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-purple-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-400" />
                  Intake
                </span>
                <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-white/50 mt-1 line-clamp-1">Instant Quotation</p>
            </Link>

            <Link
              href="/insights"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Compass size={13} className="text-amber-400" />
                  Insights
                </span>
                <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-white/50 mt-1 line-clamp-1">Growth Engineering</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Discovery Strategy Call Modal */}
      <ScheduleCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
