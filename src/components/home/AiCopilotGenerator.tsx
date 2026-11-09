'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Cpu,
  Zap,
  ArrowRight,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Workflow,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallModal from '@/components/ScheduleCallModal';

interface ArchitecturePreset {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  category: string;
  stack: string[];
  timeline: string;
  automationGains: string[];
  deliverables: string[];
}

const PRESETS: ArchitecturePreset[] = [
  {
    id: 'ai-agents',
    badge: 'Autonomous AI',
    title: 'Autonomous AI Customer & Sales Agent',
    tagline: 'Multi-channel 24/7 conversational agent with WhatsApp & CRM integrations.',
    category: 'AI & Automation',
    stack: ['Gemini / OpenAI API', 'LangChain / LangGraph', 'Supabase Vector', 'WhatsApp Cloud API', 'Next.js 16'],
    timeline: '10–14 Days Sprint',
    automationGains: ['Instant response < 1.5s', '85% automated support resolution', 'Automated quotation generation'],
    deliverables: ['Custom LLM Prompt Architecture', 'Multi-tenant Vector Knowledge Base', 'WhatsApp & Web Widget', 'Real-time Analytics Dashboard'],
  },
  {
    id: 'saas-mvp',
    badge: 'AI Full-Stack',
    title: 'Scalable Next.js 16 SaaS MVP Platform',
    tagline: 'Production-ready cloud SaaS platform with modern auth, multi-currency billing and AI workflows.',
    category: 'Web & App Development',
    stack: ['Next.js 16 App Router', 'React 19 + Tailwind v4', 'Supabase Auth & PostgreSQL', 'Stripe / Razorpay', 'Vercel Edge'],
    timeline: '3–4 Weeks Sprint',
    automationGains: ['10x faster go-to-market', 'Sub-second edge TTFB', 'Zero-maintenance serverless scaling'],
    deliverables: ['Custom Interactive Web App', 'Role-Based Authentication (RBAC)', 'Subscription Billing Suite', 'Automated Email Transports'],
  },
  {
    id: 'predictive-seo',
    badge: 'Algorithmic Growth',
    title: 'Predictive SEO & High-Converting Landing Engine',
    tagline: 'Sub-second Core Web Vitals, programmatic landing pages, and AI-optimized metadata.',
    category: 'Digital Marketing & SEO',
    stack: ['Next.js SSG / ISR', 'Structured Schema.org JSON-LD', 'Google Analytics 4', 'Edge CDN', 'Automated Sitemap Generator'],
    timeline: '7–12 Days Sprint',
    automationGains: ['300%+ increase in search impressions', '100/100 Mobile Performance Score', 'Automated lead qualification'],
    deliverables: ['High-Velocity Landing Pages', 'Complete JSON-LD Entity Graph', 'Google Search Console Verification', 'Conversion Rate Funnel'],
  },
  {
    id: 'ecommerce-ai',
    badge: 'Headless Commerce',
    title: 'High-Converting E-Commerce Platform + AI Recommender',
    tagline: 'Blazing fast custom storefront with dynamic personalization, instant checkout, and cart recovery.',
    category: 'E-Commerce Solutions',
    stack: ['Next.js 16 Storefront', 'Shopify / Medusa / Custom DB', 'Tailwind CSS UI', 'Instant Search & Filters', 'WhatsApp Abandoned Cart'],
    timeline: '2–3 Weeks Sprint',
    automationGains: ['42% lower cart abandonment', '< 800ms page load speeds', 'Automated stock & order sync'],
    deliverables: ['Custom Branded Storefront', 'Payment Gateway Integration', 'Automated WhatsApp Receipts', 'Inventory Management Panel'],
  },
];

export default function AiCopilotGenerator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ai-agents');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'stack' | 'timeline' | 'automation'>('stack');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (id: string) => {
    setIsSimulating(true);
    setSimulationStep(1);
    setTimeout(() => setSimulationStep(2), 250);
    setTimeout(() => setSimulationStep(3), 500);
    setTimeout(() => {
      startTransition(() => {
        setSelectedPresetId(id);
        setIsSimulating(false);
      });
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoal.trim()) return;
    setIsSimulating(true);
    setSimulationStep(1);
    setTimeout(() => setSimulationStep(2), 300);
    setTimeout(() => setSimulationStep(3), 600);
    setTimeout(() => {
      setIsSimulating(false);
    }, 900);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#030712] border-y border-white/[0.08]" id="ai-generator">
      {/* Background Neural Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Glowing AI Badges */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>AI ARCHITECTURE COPILOT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <h2
            style={{ fontFamily: SYNE_FONT }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Synthesize Your Custom <br />
            <span
              style={{
                background: 'linear-gradient(120deg, #00F0FF 0%, #A855F7 50%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI &amp; Growth Stack in Seconds.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Select an objective or type your vision. Our neural roadmap generator outlines the exact technical stack, deliverables, and timeline needed to scale your business.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 max-w-4xl mx-auto">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/60 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{preset.badge}: {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Prompt Bar */}
        <form onSubmit={handleCustomSubmit} className="max-w-3xl mx-auto mb-10">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-2 rounded-2xl bg-white/[0.03] border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.12)] focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all gap-2">
            <div className="flex items-center gap-2.5 px-3 flex-1">
              <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Or describe your business idea (e.g. AI-powered real estate lead matcher)..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none py-1.5"
              />
            </div>
            <button
              type="submit"
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Blueprint</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* High-Tech Generated AI Blueprint Card */}
        <div className="max-w-5xl mx-auto relative rounded-2xl overflow-hidden border border-white/10 bg-[#0B1325]/90 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
          {/* Top HUD Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02] text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">LIVE SYNTHESIS</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">TARGET: {activePreset.category.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="hidden sm:inline">VELOCITY: <strong className="text-cyan-400">{activePreset.timeline}</strong></span>
              <span className="hidden md:inline">SYSTEM: <strong className="text-purple-400">AGENTIC v4.2</strong></span>
            </div>
          </div>

          {/* Main Blueprint Details */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium mb-2.5">
                  <Terminal size={12} />
                  <span>BLUEPRINT ARCHITECTURE</span>
                </div>
                <h3
                  style={{ fontFamily: SYNE_FONT }}
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight"
                >
                  {activePreset.title}
                </h3>
                <p className="text-slate-300 text-sm mt-1.5 max-w-xl">
                  {customGoal ? `Tailored roadmap for: "${customGoal}"` : activePreset.tagline}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0 self-start lg:self-center">
                {(['stack', 'automation', 'timeline'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'stack' ? 'Tech Stack' : tab === 'automation' ? 'AI Impact' : 'Timeline'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'stack' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                    <Cpu size={14} />
                    <span>Engineered Technology Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activePreset.stack.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-950/60 text-cyan-200 border border-cyan-800/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                    <Workflow size={14} />
                    <span>Core Deliverables</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {activePreset.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-purple-400 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                {activePreset.automationGains.map((gain, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-emerald-500/20 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3 border border-emerald-500/30">
                      0{idx + 1}
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{gain}</div>
                    <div className="text-xs text-slate-400">Automated end-to-end execution</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Estimated Delivery Sprint: {activePreset.timeline}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Rapid agile sprints with functional staging demos every 72 hours.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-cyan-400 font-bold block mb-1">Phase 1</span>
                    <span className="text-white font-medium">Architecture &amp; Figma</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-cyan-400 font-bold block mb-1">Phase 2</span>
                    <span className="text-white font-medium">Full-Stack Next.js Code</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-cyan-400 font-bold block mb-1">Phase 3</span>
                    <span className="text-white font-medium">AI &amp; API Integration</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-emerald-400 font-bold block mb-1">Phase 4</span>
                    <span className="text-white font-medium">Testing &amp; Production</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Execution CTA Bar */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                Ready to deploy this system? Full IP ownership and clean source code handover included.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/start-project?preset=${activePreset.id}&title=${encodeURIComponent(activePreset.title)}`}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <span>Build This System</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white/90 border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
