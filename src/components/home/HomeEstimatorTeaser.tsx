'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Globe,
  Smartphone,
  Palette,
  Bot,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';

interface ScopePreset {
  id: string;
  categorySlug: string;
  title: string;
  icon: React.ElementType;
  tagline: string;
  minINR: number;
  maxINR: number;
  timeline: string;
  features: string[];
}

const SCOPE_PRESETS: ScopePreset[] = [
  {
    id: 'web-dev',
    categorySlug: 'web-dev',
    title: 'Web & E-Commerce',
    icon: Globe,
    tagline: 'High-converting custom web apps & headless e-commerce stores',
    minINR: 45000,
    maxINR: 95000,
    timeline: '2–3 Weeks Cadence',
    features: [
      'Tailored Next.js 16 + React 19 Frontend',
      'Headless CMS & Supabase Cloud Integration',
      'SEO Architecture & Schema.org Rich Snippets',
      'Payment Gateway & WhatsApp Lead Sync',
    ],
  },
  {
    id: 'saas-apps',
    categorySlug: 'web-dev',
    title: 'SaaS & Mobile Apps',
    icon: Smartphone,
    tagline: 'Full-stack web products, user dashboards & native mobile apps',
    minINR: 85000,
    maxINR: 180000,
    timeline: '3–5 Weeks Cadence',
    features: [
      'Cross-platform Flutter / React Native or SaaS UI',
      'Row-Level Security & Role-Based User Auth',
      'Stripe / Razorpay Recurring Billing & Webhooks',
      'Real-time PostgreSQL Database & Edge APIs',
    ],
  },
  {
    id: 'design-branding',
    categorySlug: 'design-branding',
    title: 'Brand & UI/UX Systems',
    icon: Palette,
    tagline: 'Premium visual identity, Figma design systems & interactive prototypes',
    minINR: 35000,
    maxINR: 75000,
    timeline: '1–2 Weeks Cadence',
    features: [
      'Complete Brand Book & Typography Rules',
      'Production-Ready Figma Design System',
      'Interactive Micro-Animations & Clickable Prototype',
      'Custom 3D Emblems & Vector Graphic Assets',
    ],
  },
  {
    id: 'ai-automation',
    categorySlug: 'ai-automation',
    title: 'AI & Workflow Automation',
    icon: Bot,
    tagline: 'Custom Gemini/LLM AI bots, n8n automations & CRM integration',
    minINR: 40000,
    maxINR: 110000,
    timeline: '2–3 Weeks Cadence',
    features: [
      'Custom AI Chatbot with Business Knowledge Base',
      'WhatsApp & Email Automated Response Engine',
      'CRM, Sheets & Lead Pipeline Automation',
      'Zero-Latency Edge Function Deployment',
    ],
  },
];

export default function HomeEstimatorTeaser() {
  const [selectedId, setSelectedId] = useState<string>('web-dev');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { currency, rates, currencyDetails } = useCurrency();

  const activePreset = SCOPE_PRESETS.find((p) => p.id === selectedId) || SCOPE_PRESETS[0];

  // Currency converted prices
  const rate = rates[currency] || 1;
  const symbol = currencyDetails.symbol;

  const minConverted = Math.round((activePreset.minINR / rates.INR) * rate);
  const maxConverted = Math.round((activePreset.maxINR / rates.INR) * rate);

  return (
    <section className="relative overflow-hidden bg-[#0A101C] py-20 lg:py-28 border-y border-[#1E2D4A]">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at center, #2563EB 0%, #6366F1 50%, transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Calculator className="w-3.5 h-3.5" />
              <span>Transparent Agency Investment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Instant Project Scope &amp; Cost Estimator
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] mt-3 leading-relaxed">
              No hidden fees, no opaque sales calls. Pick your digital requirement below for an instant, verified agency budget range.
            </p>
          </div>

          {/* Currency pill switcher */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">Viewing in:</span>
            <CurrencySwitcher variant="pills" theme="dark" />
          </div>
        </div>

        {/* Interactive Estimator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Category Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {SCOPE_PRESETS.map((preset) => {
              const IconComp = preset.icon;
              const isSelected = preset.id === selectedId;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedId(preset.id)}
                  className={`text-left p-4.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#172554] to-[#1E293B] border-[#3B82F6] shadow-[0_8px_30px_rgba(37,99,235,0.25)]'
                      : 'bg-[#0F172A]/70 border-white/5 hover:border-white/15 hover:bg-[#131E35]'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'bg-white/5 text-[#94A3B8]'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-white' : 'text-[#E2E8F0]'}`}>
                        {preset.title}
                      </h3>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                      {preset.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Scope & Investment Summary Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#0F1E36] via-[#0D1829] to-[#0A101C] border border-[#2563EB]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Ambient accent top bar */}
            <div
              className="absolute top-0 inset-x-0 h-1.5"
              style={{ background: 'linear-gradient(90deg, #2563EB, #6366F1, #10B981)' }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                  Selected Service Tier
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {activePreset.title}
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[#CBD5E1]">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{activePreset.timeline}</span>
              </div>
            </div>

            {/* Estimated Investment Range Banner */}
            <div className="my-6 p-5 rounded-2xl bg-[#091120] border border-[#1E2E4A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#94A3B8]">Estimated Investment Range</div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-baseline gap-1">
                  <span className="text-[#38BDF8]">{symbol}</span>
                  <span>{minConverted.toLocaleString()}</span>
                  <span className="text-sm font-normal text-[#64748B] mx-1">–</span>
                  <span className="text-[#38BDF8]">{symbol}</span>
                  <span>{maxConverted.toLocaleString()}</span>
                  <span className="text-xs font-bold text-[#64748B] ml-2 font-mono uppercase">{currency}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#94A3B8] sm:text-right max-w-[200px] leading-tight">
                *Verified base scope. Feature add-ons &amp; priority rush customizable in full tool.
              </div>
            </div>

            {/* Included Deliverables */}
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                Key Baseline Deliverables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePreset.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#CBD5E1]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              <Link
                href={`/estimator?category=${activePreset.categorySlug}`}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                }}
              >
                <span>Customize Full Scope Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <span>Book 15-Min Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Call Modal */}
      <ScheduleCallModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </section>
  );
}
