import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '@/data/process';
import type { ProcessStep } from '@/types';
import { Icon } from '@/components/Icon';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

const STEP_COLORS = [
  { accent: '#6AADFF', dimAccent: '#477BDB', border: 'rgba(71,123,219,0.30)', glow: 'rgba(71,123,219,0.15)' },
  { accent: '#A09EF5', dimAccent: '#6477C8', border: 'rgba(100,119,200,0.30)', glow: 'rgba(100,119,200,0.15)' },
  { accent: '#52D9B8', dimAccent: '#32A88A', border: 'rgba(50,168,138,0.30)', glow: 'rgba(50,168,138,0.15)' },
  { accent: '#6AADFF', dimAccent: '#477BDB', border: 'rgba(71,123,219,0.30)', glow: 'rgba(71,123,219,0.15)' },
  { accent: '#A09EF5', dimAccent: '#6477C8', border: 'rgba(100,119,200,0.30)', glow: 'rgba(100,119,200,0.15)' },
  { accent: '#52D9B8', dimAccent: '#32A88A', border: 'rgba(50,168,138,0.30)', glow: 'rgba(50,168,138,0.15)' },
];

export default function ProcessPreview({ steps }: { steps?: ProcessStep[] }) {
  const activeSteps = steps && steps.length > 0 ? steps : processSteps;
  return (
    <section
      className="section-pad-lg relative overflow-hidden"
      id="process"
      style={{ background: 'linear-gradient(145deg, #0A1525 0%, #0F1C31 50%, #0C1828 100%)' }}
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(71,123,219,0.08) 0%, transparent 70%)', filter: 'blur(1px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="reveal-on-scroll grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end mb-16">
          <div>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#52D9B8' }}
            >
              <span className="w-4 h-px" style={{ background: '#32A88A' }} />
              How we work
            </span>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.7rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.028em',
                color: '#FFFFFF',
              }}
            >
              Clear steps.<br />
              <span style={{
                background: 'linear-gradient(120deg,#52D9B8,#6AADFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                No surprises.
              </span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-slate-200 text-sm leading-relaxed mb-4 max-w-[300px] lg:ml-auto">
              A six-step delivery process that keeps scope, communication and expectations aligned from start to finish.
            </p>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Full process breakdown <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Steps grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeSteps.map((step, i) => {
            const c = STEP_COLORS[i % STEP_COLORS.length];
            return (
              <div
                key={step.id}
                className={`reveal-on-scroll stagger-${i + 1} interactive-glow-card group relative flex flex-col rounded-2xl p-4 transition-all duration-300`}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid rgba(255,255,255,0.10)`,
                }}
              >
                {/* Accent top bar */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, ${c.dimAccent}, transparent)` }}
                />

                {/* Number */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.glow, border: `1px solid ${c.border}` }}
                  >
                    <span style={{
                      fontFamily: SYNE_FONT,
                      fontWeight: 800,
                      fontSize: '0.8125rem',
                      color: c.accent,
                      letterSpacing: '0.02em',
                    }}>
                      {step.number}
                    </span>
                  </div>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <Icon name={step.icon} size={11} style={{ color: 'rgba(255,255,255,0.60)' }} />
                  </div>
                </div>

                <h3
                  className="font-bold text-white text-sm mb-2 leading-snug"
                  style={{ fontFamily: INTER_FONT }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3 mt-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Bottom trust strip ── */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(50,168,138,0.15)', border: '1px solid rgba(50,168,138,0.30)' }}
            >
              <span style={{ color: '#52D9B8', fontSize: '1rem', fontWeight: 700 }}>✓</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Transparent from day one</p>
              <p className="text-slate-300 text-xs mt-0.5">Scope, milestones and deliverables are agreed in writing before any work begins.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shrink-0 hover:-translate-y-0.5 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #477BDB, #5C6FCC)',
              boxShadow: '0 4px 16px rgba(71,123,219,0.35)',
            }}
          >
            Start a conversation <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
