'use client';

import { useState } from 'react';
import { Calendar, MessageSquare, Phone, X, ArrowRight, Clock, CheckCircle } from 'lucide-react';

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
            : `${digitsOnly || 'callback'}@phone.growmybizz.com`,
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

  const whatsappScheduleUrl = `https://wa.me/917290884480?text=${encodeURIComponent(
    `Hi Divyansh! I would like to schedule a 15-minute discovery call for my business.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0E1726] border border-white/10 rounded-2xl p-5 sm:p-8 shadow-2xl text-white"
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
          className="absolute top-5 right-5 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#477BDB]/20 border border-[#477BDB]/40 flex items-center justify-center text-[#477BDB]">
            <Calendar size={16} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#477BDB]">
            Direct Strategy Session
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Schedule a Discovery Call</h2>
        <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
          15 minutes with our technical leadership. We review your goals, clarify scope, and provide practical next steps without sales fluff.
        </p>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Call Request Received!</h3>
            <p className="text-white/60 text-xs max-w-xs mb-6">
              We will reach out to confirm your slot within a few hours.
            </p>
            <a
              href={whatsappScheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all shadow-md"
            >
              <MessageSquare size={14} />
              Open WhatsApp Now
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Option 1: WhatsApp Instant */}
            <a
              href={whatsappScheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    Instant WhatsApp Booking
                  </div>
                  <div className="text-xs text-white/50">Chat directly with the founder & pick a slot</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-emerald-400 shrink-0" />
            </a>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-white/40">
                Or request a callback
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Quick Form */}
            <form onSubmit={handleCallbackRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#477BDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">
                  Phone / WhatsApp or Email
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="+91 98765 43210 or name@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#477BDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Preferred Time Slot</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#09101C] border border-white/10 text-white text-xs focus:outline-none focus:border-[#477BDB]"
                >
                  <option value="Morning (10 AM - 1 PM IST)">Morning (10:00 AM – 1:00 PM IST)</option>
                  <option value="Afternoon (2 PM - 5 PM IST)">Afternoon (2:00 PM – 5:00 PM IST)</option>
                  <option value="Evening (5 PM - 8 PM IST)">Evening (5:00 PM – 8:00 PM IST)</option>
                  <option value="Urgent (Within 2 Hours)">Urgent (Next available slot today)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Confirm Call Request'}
                <Clock size={13} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleCallModal;
