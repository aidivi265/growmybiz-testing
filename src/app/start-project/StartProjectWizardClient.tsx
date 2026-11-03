'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building2,
  Code2,
  Layers,
  Palette,
  Bot,
  TrendingUp,
  ShieldCheck,
  FileText,
  DollarSign,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import TurnstileWidget from '@/components/TurnstileWidget';
import PhoneInput from '@/components/ui/PhoneInput';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';

const SERVICES = [
  {
    id: 'web-app-development',
    title: 'Web Application & SaaS',
    icon: Code2,
    desc: 'Custom Next.js web applications, portals, and SaaS platforms.',
  },
  {
    id: 'custom-website-cms',
    title: 'High-Conversion Website & CMS',
    icon: Layers,
    desc: 'Bespoke marketing websites with self-managed admin dashboard.',
  },
  {
    id: 'design-branding',
    title: 'Design & UI/UX Branding',
    icon: Palette,
    desc: 'Logos, Figma design systems, wireframes, and luxury visual identities.',
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Agents',
    icon: Bot,
    desc: 'LLM integrations, custom chatbots, and automated document engines.',
  },
  {
    id: 'digital-marketing',
    title: 'Performance Marketing & SEO',
    icon: TrendingUp,
    desc: 'Technical SEO architecture and high-ROAS paid media sprints.',
  },
];

const SCALE_OPTIONS = [
  '1 to 5 Key Pages (Starter MVP)',
  '6 to 15 Pages & Custom Sections',
  'Complex Web App / Multi-Tenant Portal',
  'E-Commerce Store with Payment Processing',
];

const FEATURE_OPTIONS = [
  'User Login & Role-Based Access Control',
  'Payment Gateway (Razorpay / Stripe / UPI)',
  'Self-Service Admin Dashboard & CMS',
  'Automated Transactional Emails & Invoices',
  'AI Chatbot / Document Generator',
  'Interactive Charts & Client Analytics',
  'SEO Schema & OpenGraph Meta Optimizations',
];

const getDynamicBudgetRanges = (curr: string) => {
  switch (curr) {
    case 'USD':
      return [
        { label: 'Starter Sprint', range: '$200 – $450', sub: 'Single-page / Landing' },
        { label: 'Growth Project', range: '$450 – $950', sub: 'Standard Web Platform' },
        { label: 'Full-Stack Solution', range: '$950 – $1,800', sub: 'Custom Web App / SaaS' },
        { label: 'Enterprise / Scale', range: '$1,800+', sub: 'Comprehensive Architecture' },
      ];
    case 'EUR':
      return [
        { label: 'Starter Sprint', range: '€180 – €420', sub: 'Single-page / Landing' },
        { label: 'Growth Project', range: '€420 – €880', sub: 'Standard Web Platform' },
        { label: 'Full-Stack Solution', range: '€880 – €1,650', sub: 'Custom Web App / SaaS' },
        { label: 'Enterprise / Scale', range: '€1,650+', sub: 'Comprehensive Architecture' },
      ];
    case 'AED':
      return [
        { label: 'Starter Sprint', range: '750 – 1,650 AED', sub: 'Single-page / Landing' },
        { label: 'Growth Project', range: '1,650 – 3,500 AED', sub: 'Standard Web Platform' },
        { label: 'Full-Stack Solution', range: '3,500 – 6,600 AED', sub: 'Custom Web App / SaaS' },
        { label: 'Enterprise / Scale', range: '6,600+ AED', sub: 'Comprehensive Architecture' },
      ];
    default:
      return [
        { label: 'Starter Sprint', range: '₹15,000 – ₹35,000', sub: 'Single-page / Landing' },
        { label: 'Growth Project', range: '₹35,000 – ₹75,000', sub: 'Standard Web Platform' },
        { label: 'Full-Stack Solution', range: '₹75,000 – ₹1,50,000', sub: 'Custom Web App / SaaS' },
        { label: 'Enterprise / Scale', range: '₹1,50,000+', sub: 'Comprehensive Architecture' },
      ];
  }
};

const TIMELINE_OPTIONS = [
  'Urgent Sprint (< 2 Weeks)',
  'Standard Delivery (3–5 Weeks)',
  'Comprehensive Build (6–10 Weeks)',
  'Flexible / Ongoing Retainer',
];

export default function StartProjectWizardClient() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;
  const { currency, formatPrice } = useCurrency();
  const activeBudgetRanges = getDynamicBudgetRanges(currency);

  // Slide 1: Contact
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');

  // Slide 2: Project Info
  const [serviceCategory, setServiceCategory] = useState(SERVICES[0].id);
  const [serviceTitle, setServiceTitle] = useState(SERVICES[0].title);
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [inspiration1, setInspiration1] = useState('');
  const [inspiration2, setInspiration2] = useState('');

  // Slide 3: Scope & Features
  const [projectScale, setProjectScale] = useState(SCALE_OPTIONS[1]);
  const [featureWishlist, setFeatureWishlist] = useState<string[]>([
    FEATURE_OPTIONS[1],
    FEATURE_OPTIONS[2],
  ]);
  const [technicalNotes, setTechnicalNotes] = useState('');

  // Slide 4: Budget & Timeline
  const [budgetRange, setBudgetRange] = useState(activeBudgetRanges[1].range);
  const [targetTimeline, setTargetTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [urgencyLevel, setUrgencyLevel] = useState('Standard');

  // Slide 5: Asset Readiness
  const [assetsLogo, setAssetsLogo] = useState(true);
  const [assetsCopy, setAssetsCopy] = useState(false);
  const [assetsPhotos, setAssetsPhotos] = useState(false);
  const [assetsDomain, setAssetsDomain] = useState(false);
  const [assetsNotes, setAssetsNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const toggleFeature = (feature: string) => {
    setFeatureWishlist((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleNext = () => {
    setError(null);
    if (currentSlide === 1) {
      if (!clientName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        setError('Please enter a valid work email address.');
        return;
      }
    } else if (currentSlide === 2) {
      if (!primaryGoal.trim()) {
        setError('Please describe your main project objective or problem to solve.');
        return;
      }
    }
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  };

  const handleBack = () => {
    setError(null);
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          companyName: companyName.trim() || clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          city: city.trim(),
          country: country.trim(),
          serviceCategory,
          serviceTitle,
          primaryGoal: primaryGoal.trim(),
          inspirationUrls: [inspiration1.trim(), inspiration2.trim()].filter(Boolean),
          projectScale,
          featureWishlist,
          technicalNotes: technicalNotes.trim(),
          budgetRange,
          currency,
          targetTimeline,
          urgencyLevel,
          assetsReady: {
            logo: assetsLogo,
            copy: assetsCopy,
            photos: assetsPhotos,
            domain: assetsDomain,
            otherNotes: assetsNotes.trim(),
          },
          _hp: honeypot,
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit project requirement.');
        setSubmitting(false);
        return;
      }

      setSubmittedReceipt(data.receiptId);
      if (data.token) {
        setSubmittedToken(data.token);
        try {
          localStorage.setItem(`gmb_token_${data.receiptId}`, data.token);
        } catch {
          // ignore storage error
        }
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F1C31] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!submittedReceipt ? (
          <div className="bg-white rounded-3xl border border-[#E8EDF4] shadow-[0_8px_30px_rgba(15,28,49,0.06)] overflow-hidden">
            {/* Header with Progress Bar */}
            <div className="p-6 sm:p-8 border-b border-[#E8EDF4] bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#477BDB] bg-[#EBF1FB]">
                  <Sparkles size={13} />
                  Start a Project Intake
                </span>
                <span className="text-xs font-semibold text-[#6B7E95]">
                  Step {currentSlide} of {totalSlides}
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-[#EBF1FB] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#477BDB] to-[#6477C8] transition-all duration-300"
                  style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Slide Body */}
            <div className="p-6 sm:p-8">
              {/* SLIDE 1: Contact & Company Profile */}
              {currentSlide === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2
                      style={{ fontFamily: SYNE_FONT }}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F1C31] tracking-tight"
                    >
                      Let’s start with your details
                    </h2>
                    <p className="text-sm text-[#6B7E95] mt-1">
                      Who is commissioning this project? We will use this to generate your formal quotation and client portal access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                        Company or Brand Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Malhotra Tech Dynamics"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                        Work Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="vikram@malhotratech.in"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                        required
                      />
                    </div>
                    <div>
                      <PhoneInput
                        label="WhatsApp / Phone Number"
                        value={clientPhone}
                        onChange={(fullPhone, meta) => {
                          setClientPhone(fullPhone);
                          if (meta && (!country || country === 'India')) {
                            const cMap: Record<string, string> = {
                              US: 'United States',
                              AE: 'United Arab Emirates',
                              GB: 'United Kingdom',
                              CA: 'Canada',
                              AU: 'Australia',
                              SG: 'Singapore',
                              SA: 'Saudi Arabia',
                              DE: 'Germany',
                              FR: 'France',
                              QA: 'Qatar',
                              KW: 'Kuwait',
                              OM: 'Oman',
                              BH: 'Bahrain',
                            };
                            if (cMap[meta.countryCode]) {
                              setCountry(cMap[meta.countryCode]);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Gurugram, Delhi NCR"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: Project Category & Goals */}
              {currentSlide === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2
                      style={{ fontFamily: SYNE_FONT }}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F1C31] tracking-tight"
                    >
                      What are we building together?
                    </h2>
                    <p className="text-sm text-[#6B7E95] mt-1">
                      Choose your core digital discipline and describe what success looks like.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-2.5">
                      Select Primary Service Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES.map((s) => {
                        const Icon = s.icon;
                        const isSelected = serviceCategory === s.id;
                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              setServiceCategory(s.id);
                              setServiceTitle(s.title);
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#477BDB] bg-[#EBF1FB] ring-2 ring-[#477BDB]/20 shadow-sm'
                                : 'border-[#E8EDF4] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#477BDB] text-white' : 'bg-[#F0F4FA] text-[#477BDB]'
                                }`}
                              >
                                <Icon size={18} />
                              </span>
                              <div>
                                <h3 className="text-sm font-bold text-[#0F1C31]">{s.title}</h3>
                                <p className="text-[11px] text-[#6B7E95] mt-0.5 leading-snug">{s.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                      Primary Objective or Business Problem to Solve <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      rows={3}
                      placeholder="e.g. Build an automated client onboarding portal to replace spreadsheets and enable online credit card payments."
                      className="w-full px-4 py-3 rounded-xl border border-[#E8EDF4] text-sm text-[#0F1C31] focus:outline-none focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1">
                        Inspiration or Benchmark URL #1
                      </label>
                      <input
                        type="url"
                        value={inspiration1}
                        onChange={(e) => setInspiration1(e.target.value)}
                        placeholder="https://linear.app"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1C31] mb-1">
                        Inspiration or Benchmark URL #2
                      </label>
                      <input
                        type="url"
                        value={inspiration2}
                        onChange={(e) => setInspiration2(e.target.value)}
                        placeholder="https://stripe.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Scope, Features & Scale */}
              {currentSlide === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2
                      style={{ fontFamily: SYNE_FONT }}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F1C31] tracking-tight"
                    >
                      Scope & Essential Features
                    </h2>
                    <p className="text-sm text-[#6B7E95] mt-1">
                      Choose the expected scale and select the key modules you need included in the quotation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-2">
                      Estimated Project Scale
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SCALE_OPTIONS.map((scale) => (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => setProjectScale(scale)}
                          className={`text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                            projectScale === scale
                              ? 'border-[#477BDB] bg-[#EBF1FB] text-[#477BDB] shadow-sm'
                              : 'border-[#E8EDF4] bg-white text-[#3D4F63] hover:border-[#CBD5E1]'
                          }`}
                        >
                          {scale}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-2">
                      Select Key Features & Integrations Needed
                    </label>
                    <div className="space-y-2">
                      {FEATURE_OPTIONS.map((feat) => {
                        const checked = featureWishlist.includes(feat);
                        return (
                          <div
                            key={feat}
                            onClick={() => toggleFeature(feat)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                              checked
                                ? 'border-[#477BDB]/40 bg-[#EBF1FB]/60'
                                : 'border-[#E8EDF4] bg-white hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#477BDB] rounded border-gray-300 focus:ring-[#477BDB]"
                            />
                            <span className="text-xs font-medium text-[#0F1C31]">{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                      Special Technical Requirements or Constraints
                    </label>
                    <textarea
                      value={technicalNotes}
                      onChange={(e) => setTechnicalNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Must integrate with existing PostgreSQL database or third-party CRM."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SLIDE 4: Budget Range & Delivery Timeline */}
              {currentSlide === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2
                      style={{ fontFamily: SYNE_FONT }}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F1C31] tracking-tight"
                    >
                      Budget & Timeline Alignment
                    </h2>
                    <p className="text-sm text-[#6B7E95] mt-1">
                      Growmybiz24 operates on transparent 50% / 30% / 20% milestone billing.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-[#0F1C31]">
                        Target Investment Budget Range
                      </label>
                      <CurrencySwitcher variant="pills" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeBudgetRanges.map((b) => {
                        const isSelected = budgetRange === b.range;
                        return (
                          <div
                            key={b.range}
                            onClick={() => setBudgetRange(b.range)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20 shadow-sm'
                                : 'border-[#E8EDF4] bg-white hover:border-[#CBD5E1]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-[#0F1C31]">{b.label}</span>
                              <span className="text-[10px] text-[#64748B] font-mono">{b.sub}</span>
                            </div>
                            <div className="text-base font-extrabold text-[#2563EB]">{b.range}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1C31] mb-2">
                      Desired Delivery Timeline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIMELINE_OPTIONS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setTargetTimeline(time)}
                          className={`text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                            targetTimeline === time
                              ? 'border-[#477BDB] bg-[#EBF1FB] text-[#477BDB] shadow-sm'
                              : 'border-[#E8EDF4] bg-white text-[#3D4F63] hover:border-[#CBD5E1]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 50/30/20 Policy Callout */}
                  <div className="p-4 rounded-2xl bg-[#0F1C31] text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={16} className="text-[#477BDB]" />
                      <span className="text-xs font-bold tracking-wide uppercase text-white/90">
                        Our Milestone Protection Policy
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-base font-black text-[#477BDB]">50%</div>
                        <div className="text-[10px] text-white/60 mt-0.5">Kickoff Advance</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-base font-black text-amber-400">30%</div>
                        <div className="text-[10px] text-white/60 mt-0.5">Design Approval</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-base font-black text-emerald-400">20%</div>
                        <div className="text-[10px] text-white/60 mt-0.5">Final Handover</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-white/50 mt-2.5 text-center">
                      Official tax invoice & verified payment slip are issued only upon confirmed payment.
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 5: Asset Readiness Check & Review */}
              {currentSlide === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2
                      style={{ fontFamily: SYNE_FONT }}
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F1C31] tracking-tight"
                    >
                      Asset Readiness & Review
                    </h2>
                    <p className="text-sm text-[#6B7E95] mt-1">
                      What documents or assets do you currently have prepared? (Check all that apply).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8EDF4] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                      <input
                        type="checkbox"
                        checked={assetsLogo}
                        onChange={(e) => setAssetsLogo(e.target.checked)}
                        className="w-4 h-4 text-[#477BDB] rounded"
                      />
                      <span className="text-xs font-semibold text-[#0F1C31]">Vector Logo / Brand Colors</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8EDF4] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                      <input
                        type="checkbox"
                        checked={assetsCopy}
                        onChange={(e) => setAssetsCopy(e.target.checked)}
                        className="w-4 h-4 text-[#477BDB] rounded"
                      />
                      <span className="text-xs font-semibold text-[#0F1C31]">Written Page Text / Copy</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8EDF4] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                      <input
                        type="checkbox"
                        checked={assetsPhotos}
                        onChange={(e) => setAssetsPhotos(e.target.checked)}
                        className="w-4 h-4 text-[#477BDB] rounded"
                      />
                      <span className="text-xs font-semibold text-[#0F1C31]">Product Photos / Media</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8EDF4] bg-white cursor-pointer hover:bg-[#F8FAFC]">
                      <input
                        type="checkbox"
                        checked={assetsDomain}
                        onChange={(e) => setAssetsDomain(e.target.checked)}
                        className="w-4 h-4 text-[#477BDB] rounded"
                      />
                      <span className="text-xs font-semibold text-[#0F1C31]">Registered Domain Name</span>
                    </label>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl border border-[#E8EDF4] bg-[#F7F9FC] space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                      Submission Review
                    </div>
                    <div className="text-xs text-[#3D4F63] space-y-1">
                      <div>
                        <strong>Client:</strong> {clientName} ({companyName || 'Individual'})
                      </div>
                      <div>
                        <strong>Email:</strong> {clientEmail} | <strong>Phone:</strong> {clientPhone || 'N/A'}
                      </div>
                      <div>
                        <strong>Service:</strong> {serviceTitle}
                      </div>
                      <div>
                        <strong>Scale:</strong> {projectScale}
                      </div>
                      <div>
                        <strong>Budget & Timeline:</strong> {budgetRange} | {targetTimeline}
                      </div>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile Bot Protection */}
                  <TurnstileWidget
                    action="start_project_wizard"
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
              )}

              {/* Navigation Actions */}
              <div className="mt-8 pt-5 border-t border-[#E8EDF4] flex items-center justify-between">
                {currentSlide > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6B7E95] hover:text-[#0F1C31] hover:bg-[#F0F4FA] transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentSlide < totalSlides ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}
                  >
                    Next Step
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    {submitting ? 'Generating Receipt...' : 'Submit & Receive Receipt #'}
                    <CheckCircle2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="bg-white rounded-3xl border border-[#E8EDF4] shadow-2xl p-8 sm:p-12 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 mb-3 border border-emerald-200">
              Project Successfully Initialized
            </span>

            <h1
              style={{ fontFamily: SYNE_FONT }}
              className="text-2xl sm:text-4xl font-extrabold text-[#0F1C31] tracking-tight"
            >
              Your Project Is Registered
            </h1>

            <p className="text-sm text-[#6B7E95] mt-2 mb-6 max-w-md mx-auto">
              We have assigned a unique receipt number to your project requirement. Our technical team and AI assistant are reviewing your brief to finalize your official quotation.
            </p>

            {/* Receipt Number Badge */}
            <div className="p-5 rounded-2xl bg-[#0F1C31] text-white max-w-md mx-auto mb-8 shadow-inner">
              <div className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
                Official Tracking Receipt Number
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#477BDB] mt-1 select-all">
                {submittedReceipt}
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                Save this number to track your project, review your quotation, and access the client portal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                href={`/portal?receipt=${encodeURIComponent(submittedReceipt)}${submittedToken ? `&token=${encodeURIComponent(submittedToken)}` : ''}`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}
              >
                <span>Track in Client Portal</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-xs text-[#6B7E95] hover:text-[#0F1C31] hover:bg-[#F0F4FA] transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
