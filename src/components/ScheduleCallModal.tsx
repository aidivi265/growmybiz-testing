'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Phone, X, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleCallModal({ isOpen, onClose }: ScheduleCallModalProps) {
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10 AM - 1 PM)');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(
    `https://wa.me/${(siteConfig.whatsappNumber || '917290884480').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hi! I would like to schedule a 15-minute discovery call for my business.'
    )}`
  );

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          const num = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
          setWhatsappUrl(
            `https://wa.me/${num}?text=${encodeURIComponent(
              'Hi! I would like to schedule a 15-minute discovery call for my business.'
            )}`
          );
        }
      })
      .catch(() => {});
  }, []);

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCallbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneOrEmail.trim()) return;

    const cleanInput = phoneOrEmail.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanInput);
    const digitsOnly = cleanInput.replace(/[^0-9]/g, '');

    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail
            ? cleanInput.toLowerCase()
            : `${digitsOnly || 'callback'}@phone.growmybiz24.com`,
          phone: isEmail ? null : cleanInput,
          service: 'Discovery Strategy Call',
          budget: 'Flexible',
          timeline: 'Immediate',
          message: `Client requested a scheduled strategy call. Preferred slot: ${preferredTime}. Direct contact provided: ${cleanInput}`,
        }),
      });
      setSubmitted(true);
    } catch {
      // Still show success fallback to WhatsApp
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0E1726] border border-white/15 rounded-2xl p-5 sm:p-8 shadow-2xl text-white my-auto"
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
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#477BDB]/20 border border-[#477BDB]/40 flex items-center justify-center text-[#477BDB]">
            <Calendar size={16} />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#477BDB]">
            Direct Strategy Call
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white tracking-tight">
          Schedule a 15-Min Discovery Call
        </h3>
        <p className="text-white/70 text-xs sm:text-sm mb-5 leading-relaxed">
          Skip lengthy back-and-forths. We will review your current website, digital bottlenecks, and business growth roadmap.
        </p>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Call Request Logged!</h4>
              <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto">
                Our founders have received your slot request for <strong className="text-white">{preferredTime}</strong> and will reach out shortly.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer"
            >
              <MessageSquare size={16} />
              Confirm Immediately on WhatsApp
            </a>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* Direct WhatsApp Call Out */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#25D366]/15 to-[#25D366]/5 border border-[#25D366]/30">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Instant WhatsApp Connect</p>
                    <p className="text-[11px] text-white/60">Fastest response directly with our team</p>
                  </div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  Chat Now
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0E1726] px-3 text-[10px] uppercase font-bold text-white/40 tracking-widest shrink-0">
                Or Request A Call Back
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Request Callback Form */}
            <form onSubmit={handleCallbackRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#477BDB] focus:ring-1 focus:ring-[#477BDB] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Phone Number or Email Address
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#477BDB] focus:ring-1 focus:ring-[#477BDB] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">
                  Preferred Time Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Morning (10 AM - 1 PM)',
                    'Afternoon (1 PM - 5 PM)',
                    'Evening (5 PM - 8 PM)',
                  ].map((timeSlot) => (
                    <button
                      type="button"
                      key={timeSlot}
                      onClick={() => setPreferredTime(timeSlot)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        preferredTime === timeSlot
                          ? 'border-[#477BDB] bg-[#477BDB]/25 text-white font-semibold shadow-sm'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {timeSlot.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Phone size={14} />
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
}

export default ScheduleCallModal;
