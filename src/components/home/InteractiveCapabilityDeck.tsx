'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Bot,
  TrendingUp,
  Palette,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';

type DisciplineId = 'web-app' | 'ai-auto' | 'growth' | 'branding';
type ProjectScope = 'mvp' | 'growth' | 'enterprise';

interface DisciplineData {
  id: DisciplineId;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  deliverables: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  scopes: {
    mvp: { timeline: string; focus: string; capacity: string };
    growth: { timeline: string; focus: string; capacity: string };
    enterprise: { timeline: string; focus: string; capacity: string };
  };
}

const disciplines: Record<DisciplineId, DisciplineData> = {
  'web-app': {
    id: 'web-app',
    name: 'Web & Mobile App Engineering',
    shortName: 'Web & Apps',
    icon: Code2,
    accentColor: '#3b82f6',
    gradientFrom: '#3b82f6',
    gradientTo: '#2dd4bf',
    deliverables: [
      'Next.js 16 + React 19 Frontend',
      'Supabase / PostgreSQL Architecture',
      'Stripe & Razorpay Payment Integrations',
      'Sub-800ms Core Web Vitals (LCP < 1s)',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'Node.js'],
    metrics: [
      { label: 'Avg. Page Speed', value: '< 800ms' },
      { label: 'System Uptime', value: '99.98%' },
      { label: 'Conversion Lift', value: '+320%' },
    ],
    scopes: {
      mvp: { timeline: '14 - 21 Days', focus: 'High-converting MVP launch with auth & payments', capacity: '2 Sprints open' },
      growth: { timeline: '3 - 5 Weeks', focus: 'Feature expansion, API integrations & scale', capacity: '1 Sprint open' },
      enterprise: { timeline: '6 - 8 Weeks', focus: 'Full custom ecosystem, microservices & SLA', capacity: 'Waitlist open' },
    },
  },
  'ai-auto': {
    id: 'ai-auto',
    name: 'AI Automation & Custom Agents',
    shortName: 'AI & Agents',
    icon: Bot,
    accentColor: '#8b5cf6',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    deliverables: [
      'Autonomous Lead Qualification Bots',
      'LLM Workflow Automation (Gemini / OpenAI)',
      'Multi-channel WhatsApp & CRM Sync',
      'Zero-human Customer Support Triage',
    ],
    techStack: ['Gemini 2.5', 'LangChain', 'Python', 'FastAPI', 'Vector DB', 'Webhooks'],
    metrics: [
      { label: 'Inquiries Automated', value: '75%+' },
      { label: 'Response Latency', value: '< 2 Sec' },
      { label: 'Hours Saved / Mo', value: '180+ Hrs' },
    ],
    scopes: {
      mvp: { timeline: '10 - 14 Days', focus: 'Autonomous WhatsApp & website lead intake agent', capacity: '3 Sprints open' },
      growth: { timeline: '3 - 4 Weeks', focus: 'Multi-tool internal knowledge & workflow agents', capacity: '2 Sprints open' },
      enterprise: { timeline: '5 - 7 Weeks', focus: 'Fine-tuned proprietary models & deep ERP pipelines', capacity: '1 Sprint open' },
    },
  },
  'growth': {
    id: 'growth',
    name: 'Performance Marketing & SEO',
    shortName: 'Growth & Ads',
    icon: TrendingUp,
    accentColor: '#10b981',
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
    deliverables: [
      'High-Intent Google Ads & Meta Campaigns',
      'Technical Programmatic SEO Architecture',
      'Server-Side Conversion Tracking (CAPI)',
      'Continuous Conversion Rate Optimization (CRO)',
    ],
    techStack: ['Google Ads', 'Meta CAPI', 'GA4', 'Semrush', 'Hotjar', 'Looker'],
    metrics: [
      { label: 'Target ROAS', value: '4.2x - 5.8x' },
      { label: 'CAC Reduction', value: '-38%' },
      { label: 'Organic Traffic', value: '+240%' },
    ],
    scopes: {
      mvp: { timeline: '7 - 10 Days', focus: 'Funnel audit, tracking setup & high-intent ad launch', capacity: 'Available now' },
      growth: { timeline: 'Monthly Sprint', focus: 'Continuous audience scaling, creative testing & CRO', capacity: 'Active intake' },
      enterprise: { timeline: 'Quarterly Growth', focus: 'Omnichannel multi-region acquisition machine', capacity: 'By invitation' },
    },
  },
  'branding': {
    id: 'branding',
    name: 'Brand Identity & High-Impact UI/UX',
    shortName: 'Brand & UX',
    icon: Palette,
    accentColor: '#f59e0b',
    gradientFrom: '#f59e0b',
    gradientTo: '#ef4444',
    deliverables: [
      'Comprehensive Design System in Figma',
      'Logo, Typography, Palette & Brand Guidelines',
      'Interactive Micro-Animations & 3D Assets',
      'Investor-Ready Commercial Pitch Decks',
    ],
    techStack: ['Figma', 'After Effects', 'Spline 3D', 'Illustrator', 'Design Tokens'],
    metrics: [
      { label: 'Design Consistency', value: '100%' },
      { label: 'Brand Recall Lift', value: '4.8x' },
      { label: 'Asset Turnaround', value: '< 7 Days' },
    ],
    scopes: {
      mvp: { timeline: '7 - 12 Days', focus: 'Complete brand guide, typography, logo & web UI', capacity: '2 Spots open' },
      growth: { timeline: '2 - 3 Weeks', focus: 'Full product UI/UX suite, mobile app specs & library', capacity: '1 Spot open' },
      enterprise: { timeline: '4 - 5 Weeks', focus: 'Global design system, marketing collateral & pitch deck', capacity: 'Open' },
    },
  },
};

export default function InteractiveCapabilityDeck() {
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineId>('web-app');
  const [scope, setScope] = useState<ProjectScope>('mvp');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cur = disciplines[activeDiscipline];
  const curScope = cur.scopes[scope];

  return (
    <>
      <div className="relative w-full max-w-[500px] xl:max-w-[540px]">
        {/* Ambient Backlight Glow behind the deck */}
        <div
          className="absolute -inset-1.5 rounded-[32px] blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cur.accentColor}, transparent 70%)`,
          }}
        />

        {/* Main Glass Deck Container */}
        <div
          className="relative rounded-[28px] overflow-hidden border transition-all duration-500 shadow-2xl"
          style={{
            background: 'linear-gradient(155deg, rgba(13, 22, 38, 0.92) 0%, rgba(9, 15, 27, 0.96) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${cur.accentColor}18, inset 0 1px 0 rgba(255,255,255,0.12)`,
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Top Live Status Bar */}
          <div className="relative z-10 px-6 pt-5 pb-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: cur.accentColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ background: cur.accentColor }}
                />
              </span>
              <span className="text-white/80 font-mono text-[11px] font-semibold tracking-wide uppercase">
                Interactive Capability Deck
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-semibold">
              <Zap size={10} className="fill-emerald-400" />
              <span>Sprints Active</span>
            </div>
          </div>

          <div className="relative z-10 p-6 space-y-5">
            {/* ── Discipline Selector Tabs ── */}
            <div>
              <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>Select Digital Discipline</span>
              </p>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
                {(Object.keys(disciplines) as DisciplineId[]).map((key) => {
                  const item = disciplines[key];
                  const Icon = item.icon;
                  const isSelected = activeDiscipline === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveDiscipline(key)}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-white shadow-lg'
                          : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                      }`}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${item.gradientFrom}33, ${item.gradientTo}22)`
                          : undefined,
                        border: isSelected ? `1px solid ${item.accentColor}66` : '1px solid transparent',
                      }}
                    >
                      <Icon size={16} className={`mb-1 transition-transform ${isSelected ? 'scale-110 text-white' : ''}`} />
                      <span className="text-[10px] tracking-tight truncate max-w-full">{item.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Active Discipline Header & Live Metrics ── */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div>
                  <h3
                    className="text-base font-bold text-white tracking-tight flex items-center gap-2"
                    style={{ fontFamily: SYNE_FONT }}
                  >
                    <span>{cur.name}</span>
                  </h3>
                  <p className="text-white/45 text-xs mt-0.5">Custom architecture designed for scalable velocity</p>
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${cur.gradientFrom}, ${cur.gradientTo})`,
                  }}
                >
                  <cur.icon size={16} className="text-white" />
                </div>
              </div>

              {/* Real-time Impact Metric Chips */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
                {cur.metrics.map((m, i) => (
                  <div key={i} className="text-center p-2 rounded-xl bg-black/30 border border-white/[0.04]">
                    <div
                      className="font-extrabold text-sm text-white"
                      style={{
                        fontFamily: SYNE_FONT,
                        color: i === 0 ? cur.accentColor : '#ffffff',
                      }}
                    >
                      {m.value}
                    </div>
                    <div className="text-[9.5px] text-white/40 uppercase tracking-wider mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Interactive Scope Toggle (MVP vs Growth vs Enterprise) ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                  Select Project Scope
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <Clock size={11} /> {curScope.timeline}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
                {[
                  { id: 'mvp', label: 'MVP Sprint', desc: 'Fast to Market' },
                  { id: 'growth', label: 'Growth Scale', desc: 'Expand & Optimize' },
                  { id: 'enterprise', label: 'Enterprise', desc: 'Full System' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScope(s.id as ProjectScope)}
                    className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      scope === s.id
                        ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <div className="text-xs font-bold leading-none">{s.label}</div>
                    <div className="text-[9px] text-white/35 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-2.5 px-3 py-2 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px]">{curScope.focus}</span>
                <span
                  className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                  style={{
                    background: `${cur.accentColor}22`,
                    color: cur.accentColor,
                    border: `1px solid ${cur.accentColor}44`,
                  }}
                >
                  {curScope.capacity}
                </span>
              </div>
            </div>

            {/* ── Deliverables & Tech Stack ── */}
            <div className="space-y-2">
              <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={11} />
                <span>Production Deliverables</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cur.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/75"
                  >
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Interactive CTA Button ── */}
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${cur.gradientFrom}, ${cur.gradientTo})`,
                  boxShadow: `0 8px 24px ${cur.accentColor}40`,
                }}
              >
                <Sparkles size={15} />
                <span>Schedule Discovery for {cur.shortName}</span>
                <ArrowRight size={15} />
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-white/35 px-1">
                <span>Free 25-min architectural consultation</span>
                <Link
                  href={`/services/${activeDiscipline === 'web-app' ? 'web-app-development' : activeDiscipline === 'ai-auto' ? 'ai-automation-agents' : activeDiscipline === 'growth' ? 'digital-marketing' : 'design-branding'}`}
                  className="text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
                >
                  Explore service details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Integration */}
      <ScheduleCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
