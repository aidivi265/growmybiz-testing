'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MessageSquare, Phone, X, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { getClientSettings } from '@/lib/settingsClient';
import { trackGAEvent } from '@/components/GoogleAnalytics';
import TurnstileWidget from '@/components/TurnstileWidget';
import PhoneInput from '@/components/ui/PhoneInput';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleCallModal({ isOpen, onClose }: ScheduleCallModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10 AM - 1 PM)');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(
    `https://wa.me/${(siteConfig.whatsappNumber || '917290884480').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hi! I would like to schedule a 15-minute discovery call for my business.'
    )}`
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getClientSettings().then((data) => {
      if (data?.settings?.whatsappNumber) {
        let num = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
        if (num.length === 10) num = `91${num}`;
        setWhatsappUrl(
          `https://wa.me/${num}?text=${encodeURIComponent(
            'Hi! I would like to schedule a 15-minute discovery call for my business.'
          )}`
        );
      }
    });
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleCallbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Please provide your full name.');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid work or personal email address.');
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 7) {
      setError('Please provide a valid phone or WhatsApp number (at least 7 digits).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          service: 'Discovery Strategy Call',
          budget: 'Flexible',
          timeline: 'Immediate',
          turnstileToken,
          message: `Client requested a scheduled strategy call.\nPreferred slot: ${preferredTime}\nDirect Phone/WhatsApp: ${cleanPhone}\nEmail: ${cleanEmail}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit request. Please reach out via WhatsApp.');
        setLoading(false);
        return;
      }

      // GA4 conversion tracking
      trackGAEvent('schedule_appointment', {
        event_category: 'Lead Capture',
        event_label: preferredTime,
        method: 'Form Submission',
      });
      setSubmitted(true);
    } catch {
      setError('Connection issue. Please message us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#0E1726] border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #477BDB, transparent)' }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#477BDB]/25 border border-[#477BDB]/50 flex items-center justify-center text-[#7AA2FF]">
            <Calendar size={14} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7AA2FF]">
            Direct Strategy Call
          </span>
        </div>

        <h3
          className="text-lg sm:text-xl font-black mb-1.5 text-white tracking-tight"
          style={{ color: '#ffffff' }}
        >
          Schedule a 15-Min Discovery Call
        </h3>
        <p
          className="text-white/80 text-xs mb-4 leading-relaxed"
          style={{ color: '#cbd5e1' }}
        >
          Skip lengthy back-and-forths. We will review your current website, digital bottlenecks, and business growth roadmap.
        </p>

        {submitted ? (
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#32A88A]/20 border border-[#32A88A]/40 text-[#32A88A] flex items-center justify-center mx-auto">
              <CheckCircle size={22} />
            </div>
            <h4 className="text-base font-bold text-white mb-1" style={{ color: '#ffffff' }}>
              Call Request Logged!
            </h4>
            <p className="text-white/70 text-xs leading-relaxed max-w-sm mx-auto" style={{ color: '#94a3b8' }}>
              Our growth strategist will reach out at your requested window: <strong className="text-white">{preferredTime}</strong>.
            </p>
            <div className="pt-1.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] transition-all cursor-pointer shadow-md"
              >
                <MessageSquare size={13} />
                Open WhatsApp for Immediate Chat
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Direct WhatsApp Option */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-[#25D366]/20 to-transparent border border-[#25D366]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight" style={{ color: '#ffffff' }}>
                    Instant WhatsApp Connect
                  </p>
                  <p className="text-[11px] text-white/70 leading-tight" style={{ color: '#cbd5e1' }}>
                    Fastest response directly with our team
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shrink-0 cursor-pointer shadow-sm"
              >
                Chat Now
              </a>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#0E1726] px-2.5 text-[9.5px] uppercase font-bold text-white/50 tracking-wider">
                Or Request a Call Back
              </span>
            </div>

            <form onSubmit={handleCallbackRequest} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1" style={{ color: '#e2e8f0' }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/35 text-xs sm:text-sm focus:outline-none focus:border-[#477BDB] focus:ring-1 focus:ring-[#477BDB] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1" style={{ color: '#e2e8f0' }}>
                  Email Address <span className="text-white/40 font-normal">(for calendar invite & proposal)</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/35 text-xs sm:text-sm focus:outline-none focus:border-[#477BDB] focus:ring-1 focus:ring-[#477BDB] transition-colors"
                />
              </div>

              <div>
                <PhoneInput
                  label="Phone / WhatsApp Number (for call & updates)"
                  required
                  theme="dark"
                  value={phone}
                  onChange={(fullPhone) => setPhone(fullPhone)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1" style={{ color: '#e2e8f0' }}>
                  Preferred Time Window
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
                    'Morning (10 AM - 1 PM)',
                    'Afternoon (1 PM - 5 PM)',
                    'Evening (5 PM - 8 PM)',
                  ].map((timeSlot) => (
                    <button
                      type="button"
                      key={timeSlot}
                      onClick={() => setPreferredTime(timeSlot)}
                      className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                        preferredTime === timeSlot
                          ? 'border-[#477BDB] bg-[#477BDB]/30 text-white shadow-sm'
                          : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {timeSlot.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

                            {/* Cloudflare Turnstile Bot Protection */}
              <TurnstileWidget
                action="schedule_call_modal"
                theme="dark"
                size="compact"
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken('')}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Phone size={13} />
                    <span>Confirm Call Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}

export default ScheduleCallModal;
