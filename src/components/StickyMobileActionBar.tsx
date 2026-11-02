'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Zap } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { getClientSettings } from '@/lib/settingsClient';
import { trackGAEvent } from '@/components/GoogleAnalytics';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';

export default function StickyMobileActionBar() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(
    siteConfig.whatsappUrl ||
      `https://wa.me/${(siteConfig.whatsappNumber || '917290884480').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hi Growmybiz24 team! I would like to inquire about your digital growth services.'
      )}`
  );

  // Sync with dynamic CMS settings if configured in Supabase
  useEffect(() => {
    getClientSettings().then((data) => {
      if (data?.settings?.whatsappUrl) {
        setWhatsappUrl(data.settings.whatsappUrl);
      } else if (data?.settings?.whatsappNumber) {
        let num = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
        if (num.length === 10) num = `91${num}`;
        setWhatsappUrl(
          `https://wa.me/${num}?text=${encodeURIComponent(
            'Hi Growmybiz24 team! I would like to inquire about your digital growth services.'
          )}`
        );
      }
    });
  }, []);

  // Suppress on admin, portal, or project intake wizard where dedicated flow is active
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal') ||
    pathname?.startsWith('/start-project')
  ) {
    return null;
  }

  const handleWhatsAppClick = () => {
    trackGAEvent('contact', {
      event_category: 'Mobile Sticky Bar',
      event_label: 'WhatsApp Us',
      method: 'Sticky Bar Action',
    });
  };

  const handleCallClick = () => {
    trackGAEvent('click', {
      event_category: 'Mobile Sticky Bar',
      event_label: 'Book Discovery Call',
      method: 'Sticky Bar Action',
    });
    setModalOpen(true);
  };

  return (
    <>
      <nav
        aria-label="Mobile quick actions"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A111E]/95 backdrop-blur-md border-t border-white/10 px-3 pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.45)]"
        style={{
          paddingBottom: 'calc(0.55rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
          {/* Action 1: Direct WhatsApp Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            aria-label="Chat directly on WhatsApp"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#25D366] to-[#1FB855] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-emerald-950/20"
          >
            <MessageCircle size={15} className="fill-white/20 text-white shrink-0" />
            <span className="truncate">WhatsApp Us</span>
          </a>

          {/* Action 2: Book Strategy Call Modal */}
          <button
            type="button"
            onClick={handleCallClick}
            aria-label="Schedule a 15-minute discovery strategy call"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-blue-950/20 cursor-pointer"
          >
            <Zap size={14} className="fill-white text-white shrink-0" />
            <span className="truncate">Book Strategy Call</span>
          </button>
        </div>
      </nav>

      {/* Discovery Call Booking Modal */}
      <ScheduleCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
