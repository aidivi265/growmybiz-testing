'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { services as defaultServices } from '@/data/services';
import { budgetRanges, timelineOptions } from '@/data/forms';
import { siteConfig } from '@/data/siteConfig';
import { Input, Textarea, Select, Breadcrumb } from '@/components/ui';
import type { EnquiryFormData, Service } from '@/types';
import { SYNE_FONT } from '@/lib/fonts';

const INITIAL: EnquiryFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: '',
};

interface ContactPageClientProps {
  initialServices?: Service[];
  initialSettings?: any;
}

export default function ContactPageClient({
  initialServices,
  initialSettings,
}: ContactPageClientProps) {
  const [form, setForm] = useState<EnquiryFormData>(INITIAL);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappActionUrl, setWhatsappActionUrl] = useState<string | null>(null);

  const currentServices = initialServices && initialServices.length > 0 ? initialServices : defaultServices;
  const config = initialSettings || siteConfig;

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...currentServices.map((s) => ({ value: s.slug, label: s.title })),
    { value: 'not-sure', label: 'Not sure yet' },
  ];

  const validate = () => {
    const e: Partial<EnquiryFormData> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';

    const cleanPhone = (form.phone || '').replace(/[^0-9]/g, '');
    if (!form.phone?.trim()) e.phone = 'Phone / WhatsApp number is required';
    else if (cleanPhone.length < 8) e.phone = 'Enter a valid phone number (at least 8-10 digits)';

    if (!form.company?.trim()) e.company = 'Company or project name is required';
    if (!form.service) e.service = 'Please select a primary service';
    if (!form.budget) e.budget = 'Please select an estimated budget range';
    if (!form.timeline) e.timeline = 'Please select a target timeline';
    if (!form.message.trim()) {
      e.message = 'Please provide a project description';
    } else if (form.message.trim().length < 15) {
      e.message = 'Please describe your project in at least 15 characters';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _hp: honeypot, // Honeypot spam check
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Failed to submit enquiry. Please try again or reach out directly.');
        setSubmitting(false);
        return;
      }

      if (data.whatsappActionUrl) {
        setWhatsappActionUrl(data.whatsappActionUrl);
      }
      setSubmitted(true);
    } catch {
      setServerError(`Unable to connect to the server. Please try again or email us directly at ${config.email}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: keyof EnquiryFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <div className="mt-7 max-w-2xl">
            <span className="section-label block mb-4">Get in touch</span>
            <h1
              style={{
                fontFamily: SYNE_FONT,
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Start a project.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-lg">
              Tell us what you are trying to achieve. We will respond with a clear view on scope, timing and cost — no ambiguity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-12 px-6 sm:px-10 bg-white rounded-2xl border border-[#E8EDF4] shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#0F1C31] mb-2">Enquiry received successfully!</h2>
                <p className="text-[#6B7E95] max-w-md leading-relaxed text-sm sm:text-base">
                  Thank you for reaching out, <strong className="text-[#0F1C31]">{form.name}</strong>. Your project details have been dispatched to our founders via email and logged into our queue.
                </p>

                {/* Instant WhatsApp Action Card */}
                <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white rounded-2xl border border-emerald-200/80 max-w-md w-full text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F1C31]">Prefer an instant response?</h3>
                      <p className="text-xs text-[#6B7E95]">Fast-track your inquiry directly on WhatsApp</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] mb-4 leading-relaxed">
                    Skip the email wait time. Connect directly with our founding team on WhatsApp with your project brief pre-loaded.
                  </p>
                  <a
                    href={whatsappActionUrl || config.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                  >
                    <MessageSquare size={16} />
                    <span>Open Instant WhatsApp Chat</span>
                  </a>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={() => {
                      setForm(INITIAL);
                      setSubmitted(false);
                      setWhatsappActionUrl(null);
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#477BDB] bg-[#EBF1FB] hover:bg-[#DDE8F8] transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Anti-spam honeypot (invisible to real users) */}
                <input
                  type="text"
                  name="_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {serverError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Jane Smith"
                    value={form.name}
                    onChange={set('name')}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. jane@company.com"
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone / WhatsApp Number *"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={set('phone')}
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Company / Brand Name *"
                    placeholder="e.g. Acme Studio"
                    value={form.company}
                    onChange={set('company')}
                    error={errors.company}
                    required
                  />
                </div>

                <Select
                  label="Primary Service Needed *"
                  options={serviceOptions}
                  value={form.service}
                  onChange={set('service')}
                  error={errors.service}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Estimated Budget Range *"
                    options={[
                      { value: '', label: 'Select a budget range' },
                      ...budgetRanges.map((b) => ({ value: b.value, label: b.label })),
                    ]}
                    value={form.budget}
                    onChange={set('budget')}
                    error={errors.budget}
                    required
                  />
                  <Select
                    label="Target Timeline *"
                    options={[
                      { value: '', label: 'Select a timeline' },
                      ...timelineOptions.map((t) => ({ value: t.value, label: t.label })),
                    ]}
                    value={form.timeline}
                    onChange={set('timeline')}
                    error={errors.timeline}
                    required
                  />
                </div>

                <Textarea
                  label="Tell Us About Your Project *"
                  placeholder="Describe your goals, what you need built, your target audience, and any reference websites..."
                  value={form.message}
                  onChange={set('message')}
                  error={errors.message}
                  required
                  rows={5}
                />

                {/* Disclaimer */}
                <p className="text-xs text-[#6B7E95]">
                  Your information is used only to respond to this enquiry. We do not share or sell personal data. See our{' '}
                  <a href="/legal/privacy-policy" className="text-[#477BDB] hover:underline">Privacy Policy</a>.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-md disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact details */}
            <div className="p-5 rounded-2xl border border-[#E8EDF4] bg-[#F7F9FC]">
              <h3 className="text-sm font-semibold text-[#0F1C31] mb-4">Contact details</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: config.email, href: `mailto:${config.email}` },
                  { icon: Phone, label: 'Phone', value: config.phone, href: `tel:${config.phone}` },
                  { icon: MapPin, label: 'Based in', value: config.address, href: undefined },
                ].map(({ icon: IconComponent, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E8EDF4] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent size={14} className="text-[#477BDB]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7E95]">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-[#0F1C31] hover:text-[#477BDB] transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-[#0F1C31]">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl border border-[#E8EDF4] bg-[#F7F9FC]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#32A88A]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#32A88A]">Response commitment</h4>
              </div>
              <p className="text-sm text-[#3D4F63] leading-relaxed">
                We review every enquiry and reply within <strong>24 hours</strong> on business days with a clear initial assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
