'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Code2,
  Bot,
  Palette,
  TrendingUp,
  Video,
  Server,
  Globe,
  ShoppingCart,
  AppWindow,
  Smartphone,
  MessageSquare,
  Cpu,
  Workflow,
  Zap,
  Sparkles,
  Layout,
  Layers,
  FileText,
  Search,
  Target,
  Gauge,
  MapPin,
  Film,
  Clapperboard,
  MonitorPlay,
  BookOpen,
  Database,
  GitBranch,
  Key,
  ShieldCheck,
  CreditCard,
  FileCode,
  MessageCircle,
  Activity,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Clock,
  Calendar,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import type {
  EstimatorConfig,
  EstimatorPlatform,
  EstimatorServiceCategory,
  EstimatorDesignTier,
  EstimatorFeature,
  EstimatorTimeline,
} from '@/data/estimatorConfig';
import PhoneInput from '@/components/ui/PhoneInput';
import TurnstileWidget from '@/components/TurnstileWidget';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';
import { trackGAEvent } from '@/components/GoogleAnalytics';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { CurrencyCode } from '@/data/currencyConfig';

interface ProjectEstimatorClientProps {
  initialConfig: EstimatorConfig;
}

// Icon dictionary mapping for dynamic CMS icons
const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Bot,
  Palette,
  TrendingUp,
  Video,
  Server,
  Globe,
  ShoppingCart,
  AppWindow,
  Smartphone,
  MessageSquare,
  Cpu,
  Workflow,
  Zap,
  Sparkles,
  Layout,
  Layers,
  FileText,
  Search,
  Target,
  Gauge,
  MapPin,
  Film,
  Clapperboard,
  MonitorPlay,
  BookOpen,
  Database,
  GitBranch,
  Key,
  ShieldCheck,
  CreditCard,
  FileCode,
  MessageCircle,
  Activity,
  Lock,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICON_MAP[name] || Sparkles;
  return <IconComponent className={className || 'w-5 h-5'} />;
}

export default function ProjectEstimatorClient({ initialConfig }: ProjectEstimatorClientProps) {
  const config = initialConfig;

  // ── 1. Interactive Selection State ──
  const { currency, setCurrency, rates, currencyDetails } = useCurrency();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(config.categories[0]?.id || 'web-dev');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(
    config.categories[0]?.platforms[0]?.id || 'business-website'
  );
  const [selectedTierId, setSelectedTierId] = useState<string>(config.designTiers[1]?.id || 'custom-pro');
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([
    'headless-cms',
    'crm-whatsapp-sync',
    'seo-pro-schemas',
  ]);
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(
    config.timelines[0]?.id || 'standard-pace'
  );

  // Pre-select category or platform from query parameters if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const platParam = params.get('platform');
      if (catParam) {
        const found = config.categories.find(
          (c) => c.id === catParam || c.slug === catParam
        );
        if (found) {
          setSelectedCategoryId(found.id);
          if (found.platforms && found.platforms.length > 0) {
            setSelectedPlatformId(found.platforms[0].id);
          }
        }
      }
      if (platParam) {
        setSelectedPlatformId(platParam);
      }
    }
  }, [config.categories]);

  // ── 2. Lead Capture Form State ──
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // ── 3. Post-Submission Success State ──
  const [quoteSuccess, setQuoteSuccess] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // ── 4. Derived Selections ──
  const activeCategory = useMemo(
    () => config.categories.find((c) => c.id === selectedCategoryId) || config.categories[0],
    [config, selectedCategoryId]
  );

  const activePlatform = useMemo(() => {
    for (const cat of config.categories) {
      const p = cat.platforms.find((plat) => plat.id === selectedPlatformId);
      if (p) return p;
    }
    return activeCategory.platforms[0];
  }, [config, selectedPlatformId, activeCategory]);

  const activeTier = useMemo(
    () => config.designTiers.find((t) => t.id === selectedTierId) || config.designTiers[0],
    [config, selectedTierId]
  );

  const activeTimeline = useMemo(
    () => config.timelines.find((t) => t.id === selectedTimelineId) || config.timelines[0],
    [config, selectedTimelineId]
  );

  // Toggle feature selection
  const handleToggleFeature = (featureId: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  // Switch category
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = config.categories.find((c) => c.id === catId);
    if (cat && cat.platforms[0]) {
      setSelectedPlatformId(cat.platforms[0].id);
    }
  };

  // ── 5. Real-Time Multi-Currency Calculation ──
  const currencySymbol = currencyDetails.symbol;

  const getItemPrice = useCallback(
    (priceUSD: number, priceINR: number): number => {
      if (currency === 'INR') return priceINR;
      if (currency === 'USD') return priceUSD;
      const rate = rates[currency] || (currency === 'EUR' ? 0.92 : 3.67);
      return Math.round(priceUSD * rate);
    },
    [currency, rates]
  );

  const basePrice = getItemPrice(activePlatform.basePriceUSD, activePlatform.basePriceINR);
  const tierPrice = getItemPrice(activeTier.additionalPriceUSD, activeTier.additionalPriceINR);

  const featuresTotal = useMemo(() => {
    return selectedFeatureIds.reduce((sum, fId) => {
      const feat = config.features.find((f) => f.id === fId);
      if (!feat) return sum;
      return sum + getItemPrice(feat.priceUSD, feat.priceINR);
    }, 0);
  }, [config, selectedFeatureIds, getItemPrice]);

  const rawSubtotal = (basePrice + tierPrice + featuresTotal) * activeTimeline.multiplier;

  // Adaptive round increment and floor per currency
  const roundIncrement = currencyDetails.roundIncrement;
  const minFloor = currency === 'INR' ? 12000 : currency === 'AED' ? 550 : currency === 'EUR' ? 130 : 140;
  const minSpread = currency === 'INR' ? 5000 : currency === 'AED' ? 250 : currency === 'EUR' ? 60 : 70;

  const estimatedMin = Math.max(
    minFloor,
    Math.round((rawSubtotal * 0.95) / roundIncrement) * roundIncrement
  );
  const estimatedMax = Math.max(
    estimatedMin + minSpread,
    Math.round((rawSubtotal * 1.15) / roundIncrement) * roundIncrement
  );

  // Delivery duration estimation
  const totalWeeksMin = Math.max(1, Math.round(activePlatform.baseWeeks * (activeTimeline.id === 'rapid-emergency' ? 0.6 : 0.85)));
  const totalWeeksMax = Math.max(totalWeeksMin + 1, Math.round(activePlatform.baseWeeks * (activeTimeline.id === 'rapid-emergency' ? 0.8 : 1.35)));

  // ── 6. Lock in Estimate Form Submission ──
  const handleSubmitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!clientName.trim() || clientName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!clientEmail.trim() && !clientPhone.trim()) {
      setFormError('Please provide an email or phone/WhatsApp number so we can send your quote.');
      return;
    }

    setFormSubmitting(true);

    const selectedFeatureTitles = selectedFeatureIds
      .map((id) => config.features.find((f) => f.id === id)?.title)
      .filter(Boolean) as string[];

    const payload = {
      name: clientName.trim(),
      email: clientEmail.trim(),
      phone: clientPhone.trim(),
      company: clientCompany.trim(),
      notes: clientNotes.trim(),
      turnstileToken,
      estimateDetails: {
        categoryTitle: activeCategory.title,
        platformTitle: activePlatform.title,
        tierTitle: activeTier.title,
        selectedFeatureTitles,
        timelineTitle: `${activeTimeline.title} (${activeTimeline.durationLabel})`,
        estimatedMin,
        estimatedMax,
        currency,
        currencySymbol,
      },
    };

    try {
      const res = await fetch('/api/estimator/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to lock in estimate.');
      }

      setQuoteSuccess(data);
      trackGAEvent('generate_lead', {
        event_category: 'Project Estimator',
        event_label: activePlatform.title,
        value: estimatedMin,
        currency,
      });
    } catch (err: any) {
      console.error('Estimate submission error:', err);
      setFormError(err.message || 'Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCopyQuote = () => {
    if (!quoteSuccess?.quoteId) return;
    navigator.clipboard.writeText(quoteSuccess.quoteId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const resetCalculator = () => {
    setQuoteSuccess(null);
    setCurrentStep(1);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientCompany('');
    setClientNotes('');
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#477BDB] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-[#477BDB]" />
            <span>Interactive Project Cost & Scope Estimator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-syne text-white tracking-tight mb-4 leading-tight">
            Calculate Your Project Scope & Investment
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Select your service deliverables, design fidelity, feature modules, and timeline to get an instant, transparent estimation. Zero hidden surprises.
          </p>

          {/* Currency Toggle Switch */}
          <div className="mt-6">
            <CurrencySwitcher variant="pills" />
          </div>
        </div>

        {/* ── Success Screen when Quotation is Locked In ── */}
        {quoteSuccess ? (
          <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-white/[0.05] to-black/60 border border-emerald-500/30 shadow-2xl relative">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={36} />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                Estimate Locked In & Recorded
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold font-syne text-white">
                Official Estimate Generated!
              </h2>

              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Thank you <strong className="text-white">{clientName}</strong>. Your scope has been registered. Our leadership team has received this estimate.
              </p>

              {/* Quote Reference Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between max-w-sm mx-auto">
                <div>
                  <div className="text-[10px] uppercase font-mono text-white/40">Quotation Reference</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">{quoteSuccess.quoteId}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Scope Summary Card */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-3 mt-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Selected Platform</span>
                  <span className="text-xs font-semibold text-white">{activePlatform.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Design Tier</span>
                  <span className="text-xs font-semibold text-white">{activeTier.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Estimated Timeline</span>
                  <span className="text-xs font-semibold text-white">{activeTimeline.title} ({totalWeeksMin}–{totalWeeksMax} Wks)</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-emerald-400">Investment Range</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {currencySymbol}{estimatedMin.toLocaleString()} – {currencySymbol}{estimatedMax.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Post-estimate Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                {/* Action 1: Direct WhatsApp send */}
                <a
                  href={quoteSuccess.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#25D366] to-[#1FB855] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle size={16} className="fill-white/20" />
                  <span>Send Scope to WhatsApp</span>
                </a>

                {/* Action 2: Schedule 15-min Call */}
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/40 cursor-pointer"
                >
                  <Calendar size={16} />
                  <span>Schedule 15-Min Scope Call</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4 text-xs text-white/40">
                <Link
                  href={`/start-project?quote=${quoteSuccess.quoteId}`}
                  className="text-white hover:text-emerald-400 underline underline-offset-4 flex items-center gap-1"
                >
                  Proceed to Full Client Intake <ExternalLink size={11} />
                </Link>
                <span>•</span>
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Calculate Another Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Main Step-By-Step Estimator Engine ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Multi-Step Interactive Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step Navigation Pill Bar */}
              <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto no-scrollbar">
                {[
                  { step: 1, label: '1. Service & Platform' },
                  { step: 2, label: '2. Design Tier' },
                  { step: 3, label: '3. Features & Add-ons' },
                  { step: 4, label: '4. Timeline & Cadence' },
                  { step: 5, label: '5. Lock In Estimate' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentStep === s.step
                        ? 'bg-[#477BDB] text-white shadow-md shadow-blue-900/30'
                        : currentStep > s.step
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <span>{s.label}</span>
                    {currentStep > s.step && <Check size={11} className="text-emerald-400" />}
                  </button>
                ))}
              </div>

              {/* ── STEP 1: Service Category & Platform Type ── */}
              {currentStep === 1 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                      Choose Your Core Service Category
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Growmybiz24 specializes across 6 primary digital domains. Pick the domain matching your primary initiative.
                    </p>
                  </div>

                  {/* Category Selection Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {config.categories.map((cat) => {
                      const isSelected = cat.id === selectedCategoryId;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#477BDB]/15 border-[#477BDB] text-white shadow-lg shadow-blue-950/20'
                              : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <DynamicIcon
                            name={cat.icon}
                            className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#477BDB]' : 'text-white/40'}`}
                          />
                          <div>
                            <div className="text-xs font-bold leading-snug">{cat.title}</div>
                            <div className="text-[10px] text-white/40 line-clamp-1 mt-0.5">{cat.platforms.length} Platform Options</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Platform Options for Active Category */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Select Deliverable Type for <span className="text-[#477BDB]">{activeCategory.title}</span>:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCategory.platforms.map((plat) => {
                        const isSelected = plat.id === selectedPlatformId;
                        const price = getItemPrice(plat.basePriceUSD, plat.basePriceINR);
                        return (
                          <button
                            key={plat.id}
                            type="button"
                            onClick={() => setSelectedPlatformId(plat.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#477BDB]/20 to-transparent border-[#477BDB] ring-1 ring-[#477BDB]'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                          >
                            {plat.badge && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#477BDB]/20 text-[#477BDB] border border-[#477BDB]/30">
                                {plat.badge}
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <DynamicIcon name={plat.icon} className="w-4 h-4 text-[#477BDB]" />
                                <span className="text-sm font-bold text-white group-hover:text-[#477BDB] transition-colors">
                                  {plat.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                                {plat.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                              <span className="text-white/40">Base from</span>
                              <span className="font-bold text-emerald-400">
                                {currencySymbol}{price.toLocaleString()}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#477BDB] to-[#6477C8] text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-blue-950/30"
                    >
                      <span>Proceed to Design Tier</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Scope & Design Tier ── */}
              {currentStep === 2 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
                      Select Your Design & Architecture Fidelity
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Choose the level of visual polish, custom illustration, and design system fidelity your brand requires.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {config.designTiers.map((tier) => {
                      const isSelected = tier.id === selectedTierId;
                      const addPrice = getItemPrice(tier.additionalPriceUSD, tier.additionalPriceINR);
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTierId(tier.id)}
                          className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#477BDB]/20 via-white/[0.03] to-transparent border-[#477BDB] ring-1 ring-[#477BDB]'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-start gap-3.5 max-w-lg">
                            <div
                              className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#477BDB] bg-[#477BDB]' : 'border-white/30'
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{tier.title}</span>
                                {tier.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/50 mt-1 leading-relaxed">{tier.description}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono font-bold text-emerald-400">
                              {addPrice === 0 ? 'Included' : `+${currencySymbol}${addPrice.toLocaleString()}`}
                            </div>
                            <div className="text-[10px] font-mono text-white/40 mt-0.5">
                              {tier.multiplier === 1.0 ? '1.0x baseline' : `${tier.multiplier}x polish factor`}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#477BDB] to-[#6477C8] text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-blue-950/30"
                    >
                      <span>Proceed to Features</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Features & Add-ons ── */}
              {currentStep === 3 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
                      Add Modular Features & Integrations
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Pick any functional capabilities you need built into your solution. Select as many as applicable.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.features.map((feat) => {
                      const isSelected = selectedFeatureIds.includes(feat.id);
                      const price = getItemPrice(feat.priceUSD, feat.priceINR);
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          onClick={() => handleToggleFeature(feat.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                            isSelected
                              ? 'bg-[#477BDB]/15 border-[#477BDB] ring-1 ring-[#477BDB]'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#477BDB] bg-[#477BDB]' : 'border-white/30'
                            }`}
                          >
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-white truncate">{feat.title}</span>
                              <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                                +{currencySymbol}{price.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                              {feat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#477BDB] to-[#6477C8] text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-blue-950/30"
                    >
                      <span>Proceed to Timeline</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Project Timeline & Urgency ── */}
              {currentStep === 4 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">4</span>
                      Delivery Pace & Target Timeline
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Choose your preferred speed. Rush launches require dedicated parallel sprint engineers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {config.timelines.map((time) => {
                      const isSelected = time.id === selectedTimelineId;
                      return (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => setSelectedTimelineId(time.id)}
                          className={`p-5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#477BDB]/20 via-white/[0.03] to-transparent border-[#477BDB] ring-1 ring-[#477BDB]'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#477BDB] bg-[#477BDB]' : 'border-white/30'
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{time.title}</span>
                                {time.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {time.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/50 mt-1">{time.description}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-sm font-mono font-bold text-white">{time.durationLabel}</div>
                            <div className="text-[10px] text-white/40 font-mono mt-0.5">{time.multiplier}x rate</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-emerald-950/30"
                    >
                      <span>Lock In This Estimate</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review & Lead Capture ── */}
              {currentStep === 5 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">5</span>
                      Lock in Your Estimate & Get Official Quotation
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      Provide your details to register this scope with Growmybiz24 leadership. We will generate your official quotation reference immediately.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitEstimate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                          Full Name <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Rahul Sharma or Alex Turner"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#477BDB]"
                        />
                      </div>

                      {/* Work Email */}
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                          Work Email <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#477BDB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone with International Picker */}
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                          WhatsApp / Phone Number
                        </label>
                        <PhoneInput
                          value={clientPhone}
                          onChange={setClientPhone}
                          placeholder="Phone / WhatsApp"
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">
                          Company / Brand Name
                        </label>
                        <input
                          type="text"
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          placeholder="e.g. Nexus Retail or Stealth AI"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#477BDB]"
                        />
                      </div>
                    </div>

                    {/* Special Notes / Brief */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        Specific Goals, Reference Sites or Target Date (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Tell us any custom integrations, reference links, or target launch dates you have in mind..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#477BDB]"
                      />
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className="pt-2">
                      <TurnstileWidget onVerify={setTurnstileToken} theme="dark" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                      >
                        {formSubmitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Registering Scope...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={15} />
                            <span>Lock in Estimate & Generate Official Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Real-Time Investment Breakdown Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-black/80 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="text-xs uppercase font-mono tracking-wider text-white/50">Live Scope Summary</div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                    Step {currentStep} of 5
                  </span>
                </div>

                {/* Big Investment Range Display */}
                <div className="py-4 space-y-1">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-mono">Estimated Investment Range</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {currencySymbol}{estimatedMin.toLocaleString()} – {currencySymbol}{estimatedMax.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-white/50 flex items-center gap-1.5 pt-1">
                    <Clock size={12} className="text-[#477BDB]" />
                    <span>Estimated Duration: <strong>{totalWeeksMin} – {totalWeeksMax} Weeks</strong></span>
                  </div>
                </div>

                {/* Itemized Calculation Spec */}
                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                  {/* Base Platform */}
                  <div className="flex justify-between items-start text-white/70">
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-white">{activePlatform.title}</div>
                      <div className="text-[10px] text-white/40">{activeCategory.title}</div>
                    </div>
                    <span className="font-mono text-white/90">
                      {currencySymbol}{basePrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Design Tier */}
                  <div className="flex justify-between items-start text-white/70">
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-white">{activeTier.title}</div>
                      <div className="text-[10px] text-white/40">{activeTier.multiplier}x Polish Factor</div>
                    </div>
                    <span className="font-mono text-white/90">
                      {tierPrice === 0 ? 'Included' : `+${currencySymbol}${tierPrice.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Features Count */}
                  <div className="flex justify-between items-start text-white/70">
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-white">Selected Add-ons ({selectedFeatureIds.length})</div>
                      <div className="text-[10px] text-white/40 line-clamp-1">
                        {selectedFeatureIds.map((id) => config.features.find((f) => f.id === id)?.title).filter(Boolean).join(', ')}
                      </div>
                    </div>
                    <span className="font-mono text-white/90">
                      +{currencySymbol}{featuresTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Timeline Rate */}
                  <div className="flex justify-between items-start text-white/70">
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-white">{activeTimeline.title}</div>
                      <div className="text-[10px] text-white/40">{activeTimeline.durationLabel}</div>
                    </div>
                    <span className="font-mono text-white/90">
                      {activeTimeline.multiplier === 1.0 ? '1.0x' : `${activeTimeline.multiplier}x Rush`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-5 border-t border-white/10">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#477BDB] to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Direct Help WhatsApp Callout */}
                <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/60 flex items-center justify-between">
                  <span>Need a custom quote?</span>
                  <a
                    href={`https://wa.me/917290884480?text=${encodeURIComponent(
                      `Hi Growmybiz24 team! I am using the Cost Estimator for ${activePlatform.title} and have a quick question.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                  >
                    <MessageCircle size={12} /> WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Strategy Call Modal */}
      <ScheduleCallModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
