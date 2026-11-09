import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Cpu } from 'lucide-react';
import { services as defaultServices } from '@/data/services';
import { Icon } from '@/components/Icon';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';
import type { Service } from '@/types';

// Asymmetric card layout
const CARD_STYLES = [
  { span: 'md:col-span-2', tall: false },   // 1 — wide
  { span: 'md:col-span-1', tall: false },   // 2
  { span: 'md:col-span-1', tall: false },   // 3
  { span: 'md:col-span-1', tall: false },   // 4
  { span: 'md:col-span-2', tall: false },   // 5 — wide
  { span: 'md:col-span-1', tall: false },   // 6
];

const AI_CHIPS: Record<string, string> = {
  'web-app-development': 'NEXT.JS 16 + REACT 19',
  'design-branding': 'CONVERSION DESIGN SYSTEMS',
  'digital-marketing': 'PREDICTIVE ALGORITHMIC SEO',
  'video-content': 'AI MOTION & SYNTHESIS',
  'ai-automation': 'AUTONOMOUS LLM AGENTS',
  'other-digital-services': 'DATA PIPELINES & APIS',
};

interface ServicesSectionProps {
  services?: Service[];
}

export default function ServicesSection({ services: propServices }: ServicesSectionProps) {
  const activeServices = propServices && propServices.length > 0 ? propServices : defaultServices;
  const countLabel = activeServices.length === 6 ? 'Six disciplines.' : `${activeServices.length} disciplines.`;

  return (
    <section className="section-pad-lg relative overflow-hidden bg-[#040812] border-t border-white/[0.08]" id="services">
      {/* Background Neural Grid and Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(71,123,219,0.12) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">

        {/* ── Header ── */}
        <div className="reveal-on-scroll flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
              <Cpu size={12} className="text-cyan-400" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.028em',
                color: '#FFFFFF',
              }}
            >
              {countLabel}<br />
              <span style={{
                background: 'linear-gradient(120deg, #00F0FF 0%, #A855F7 50%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                One Connected AI-Engineered Studio.
              </span>
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 mb-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore all services</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Services grid — asymmetric 3-col ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeServices.map((svc, i) => {
            const cs = CARD_STYLES[i % CARD_STYLES.length];
            const isWide = cs.span === 'md:col-span-2';
            const aiChip = AI_CHIPS[svc.slug] || 'AI ENHANCED';

            return (
              <Link
                prefetch={false}
                key={svc.id}
                href={`/services/${svc.slug}`}
                className={`reveal-on-scroll stagger-${(i % 3) + 1} group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border border-white/[0.08] hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] ${cs.span}`}
                style={{
                  background: 'rgba(11, 19, 37, 0.75)',
                  backdropFilter: 'blur(16px)',
                  padding: isWide ? '28px' : '24px',
                  minHeight: isWide ? '180px' : '190px',
                }}
              >
                {/* Hover: coloured top accent line */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, ${svc.color}, #00F0FF)` }}
                />

                {/* Index number & AI Chip */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${svc.color}25`, border: `1px solid ${svc.color}40` }}
                  >
                    <Icon name={svc.icon} size={18} style={{ color: svc.color }} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-white/[0.04] border border-white/10 text-cyan-400">
                      {aiChip}
                    </span>
                    <span
                      className="font-mono text-xs text-white/30 font-bold select-none"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-white mb-2 transition-colors group-hover:text-cyan-300"
                  style={{
                    fontFamily: INTER_FONT,
                    fontSize: isWide ? '1.125rem' : '1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {svc.title}
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                  {svc.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {svc.offerings.slice(0, isWide ? 4 : 3).map((o) => (
                    <span
                      key={o.id}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-300"
                    >
                      {o.title}
                    </span>
                  ))}
                  {svc.offerings.length > (isWide ? 4 : 3) && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40">
                      +{svc.offerings.length - (isWide ? 4 : 3)}
                    </span>
                  )}
                </div>

                {/* Arrow — appears on hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA bar ── */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm">
            <Sparkles size={16} className="text-cyan-400 shrink-0" />
            <span>
              Unsure which architecture fits your business?{' '}
              <strong className="text-white">Our AI team outlines a customized sprint plan at no cost.</strong>
            </span>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_20px_rgba(71,123,219,0.3)]"
          >
            <span>Let&apos;s talk</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
