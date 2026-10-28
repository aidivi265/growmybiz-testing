'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { services, budgetRanges, timelineOptions, siteConfig } from '@/data';
import { Input, Textarea, Select, Breadcrumb } from '@/components/ui';
import type { EnquiryFormData } from '@/types';
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

export default function ContactPageClient() {
  const [form, setForm] = useState<EnquiryFormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...services.map((s) => ({ value: s.slug, label: s.title })),
    { value: 'not-sure', label: 'Not sure yet' },
  ];

  const validate = () => {
    const e: Partial<EnquiryFormData> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.service) e.service = 'Please select a service';
    if (!form.message.trim()) e.message = 'Please describe your project';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const set = (field: keyof EnquiryFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
              <div className="flex flex-col items-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#0F1C31] mb-3">Message received.</h2>
                <p className="text-[#6B7E95] max-w-md leading-relaxed">
                  Thank you for reaching out. We will review your enquiry and respond within 1–2 business days.
                </p>
                <button
                  onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                  className="mt-7 text-sm text-[#477BDB] hover:text-[#3366C8] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={set('name')}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone number"
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                  <Input
                    label="Company / Organisation"
                    placeholder="Your company name"
                    value={form.company}
                    onChange={set('company')}
                  />
                </div>

                <Select
                  label="Service you are interested in"
                  options={serviceOptions}
                  value={form.service}
                  onChange={set('service')}
                  error={errors.service}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Approximate budget"
                    options={[{ value: '', label: 'Select a range' }, ...budgetRanges]}
                    value={form.budget}
                    onChange={set('budget')}
                  />
                  <Select
                    label="Preferred timeline"
                    options={[{ value: '', label: 'Select timeline' }, ...timelineOptions]}
                    value={form.timeline}
                    onChange={set('timeline')}
                  />
                </div>

                <Textarea
                  label="Tell us about your project"
                  placeholder="Describe your goal, what you have in place today, and any relevant context..."
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
                      Sending...
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
                  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                  { icon: Phone, label: 'Phone', value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
                  { icon: MapPin, label: 'Based in', value: siteConfig.address, href: undefined },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E8EDF4] flex items-center justify-center shrink-0">
                      <item.icon size={13} className="text-[#6B7E95]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7E95] mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-[#0F1C31] hover:text-[#477BDB] transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-[#0F1C31]">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl border border-[#E8EDF4]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#477BDB]" />
                <h3 className="text-sm font-semibold text-[#0F1C31]">Response time</h3>
              </div>
              <p className="text-sm text-[#6B7E95] leading-relaxed">
                We aim to respond to all enquiries within 1–2 business days. For time-sensitive requests, please mention it in your message.
              </p>
            </div>

            {/* What to expect */}
            <div className="p-5 rounded-2xl border border-[#E8EDF4]">
              <h3 className="text-sm font-semibold text-[#0F1C31] mb-3">What happens next</h3>
              <ol className="space-y-3">
                {[
                  'We review your enquiry',
                  'We respond with initial questions or a scoping call invitation',
                  'We agree a clear scope before any commitment',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#6B7E95]">
                    <span className="w-5 h-5 rounded-full bg-[#477BDB]/10 text-[#477BDB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
