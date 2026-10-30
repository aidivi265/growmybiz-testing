'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { MessageCircle } from 'lucide-react';
import { getClientSettings } from '@/lib/settingsClient';

export default function WhatsAppFloatingButton() {
  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl);

  useEffect(() => {
    getClientSettings().then((data) => {
      if (data?.settings?.whatsappUrl) {
        setWhatsappUrl(data.settings.whatsappUrl);
      }
    });
  }, []);

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-[#0F1C31]/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with an expert
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Growmybiz24 on WhatsApp"
        className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-108 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.40)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <MessageCircle size={26} className="fill-white/20 text-white" />
      </a>
    </aside>
  );
}
