'use client';

import { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { services as defaultServices } from '@/data/services';

interface QuickInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickInquiryModal({ isOpen, onClose }: QuickInquiryModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState(''); // Email or WhatsApp
  const [service, setService] = useState('web-app-development');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!contact.trim()) {
      setError('Please enter your email or WhatsApp number.');
      return;
    }

    setSubmitting(true);
    try {
      const isEmail = contact.includes('@');
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail ? contact.trim() : '',
          phone: !isEmail ? contact.trim() : '',
          service,
          message: message.trim() || 'I want to discuss my project requirement.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit inquiry.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      if (data.whatsappActionUrl) {
        setWhatsappUrl(data.whatsappActionUrl);
      }
    } catch {
      setError('Network error. Please try again or message us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setContact('');
    setMessage('');
    setSubmitted(false);
    setWhatsappUrl(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F1C31]/80 backdrop-blur-sm transition-opacity"
        onClick={handleReset}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8EDF4] p-6 sm:p-8 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6B7E95] hover:text-[#0F1C31] hover:bg-[#F7F9FC] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-[#477BDB]/10 text-[#477BDB] flex items-center justify-center">
                <MessageSquare size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                Fast Inquiry
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1C31] tracking-tight">
              Talk to Our Team
            </h2>
            <p className="text-sm text-[#6B7E95] mt-1 mb-6">
              Have a quick question or want to discuss feasibility? Fill in your details and we’ll respond within hours.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] placeholder-[#A0AEC0] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                  Email Address or WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="rahul@example.com or +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] placeholder-[#A0AEC0] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                  Area of Interest
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] bg-white focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                >
                  {defaultServices.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                  <option value="general">General Digital Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                  Your Question or Requirement Brief
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell us what you are looking to build or achieve..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] placeholder-[#A0AEC0] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6B7E95] hover:bg-[#F7F9FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}
                >
                  {submitting ? 'Submitting...' : 'Send Inquiry'}
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0F1C31]">Inquiry Received!</h3>
            <p className="text-sm text-[#6B7E95] mt-2 mb-6 max-w-sm mx-auto">
              Thank you, <strong className="text-[#0F1C31]">{name}</strong>. Our technical team has been notified and will reach out shortly.
            </p>

            <div className="space-y-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-md"
                >
                  <span>Chat on WhatsApp Directly</span>
                  <ArrowRight size={16} />
                </a>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#6B7E95] hover:bg-[#F7F9FC]"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
