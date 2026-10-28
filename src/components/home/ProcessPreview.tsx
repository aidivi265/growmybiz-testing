import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '@/data';
import { Icon } from '@/components/Icon';

const STEP_COLORS = [
  { accent: '#477BDB', bg: 'rgba(71,123,219,0.12)', border: 'rgba(71,123,219,0.25)' },
  { accent: '#6477C8', bg: 'rgba(100,119,200,0.12)', border: 'rgba(100,119,200,0.25)' },
  { accent: '#32A88A', bg: 'rgba(50,168,138,0.12)', border: 'rgba(50,168,138,0.25)' },
  { accent: '#477BDB', bg: 'rgba(71,123,219,0.12)', border: 'rgba(71,123,219,0.25)' },
  { accent: '#6477C8', bg: 'rgba(100,119,200,0.12)', border: 'rgba(100,119,200,0.25)' },
  { accent: '#32A88A', bg: 'rgba(50,168,138,0.12)', border: 'rgba(50,168,138,0.25)' },
];

export default function ProcessPreview() {
  return (
    <section
      className="section-pad-lg relative overflow-hidden"
      id="process"
      style={{ background: '#F7F9FC' }}
    >
      {/* subtle background grid */}
      <div className="absolute inset-0 cross-bg opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header: left-aligned, asymmetric ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end mb-16">
          <div>
            <span className="eyebrow eyebrow-teal block mb-4">How we work</span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#0F1C31',
              }}
            >
              Clear steps.<br />
              <span
                style={{
                  background: 'linear-gradient(120deg,#32A88A,#477BDB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                No surprises.
              </span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-[#6B7E95] text-sm leading-relaxed mb-4 max-w-[320px] lg:ml-auto">
              A six-step delivery process that keeps scope, communication and expectations aligned from start to finish.
            </p>
            <Link href="/process" className="btn btn-outline btn-sm">
              Full process breakdown <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Steps: horizontal scroll on mobile, grid on desktop ── */}
        <div className="relative">
          {/* Horizontal connector line — desktop only, sits behind the circles */}
          <div
            className="hidden lg:block absolute h-px pointer-events-none"
            style={{
              top: '26px',
              left: '8.33%',
              right: '8.33%',
              background: 'linear-gradient(90deg, transparent 0%, #DDE3EC 8%, #DDE3EC 92%, transparent 100%)',
              zIndex: 0,
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-3 relative z-10">
            {processSteps.map((step, i) => {
              const c = STEP_COLORS[i % STEP_COLORS.length];
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Number + icon stack */}
                  <div className="relative mb-4">
                    {/* Step number circle — sits on the connector line */}
                    <div
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center border-2 bg-white relative z-10 transition-all duration-200 group-hover:scale-105"
                      style={{ borderColor: c.border, boxShadow: `0 0 0 6px #F7F9FC` }}
                    >
                      <span
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          color: c.accent,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {step.number}
                      </span>
                    </div>
                    {/* Small icon below */}
                    <div
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: c.bg, border: `1px solid ${c.border}` }}
                    >
                      <Icon name={step.icon} size={11} style={{ color: c.accent }} />
                    </div>
                  </div>

                  <h3
                    className="font-bold text-[#0F1C31] text-sm mb-1.5 leading-snug"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#6B7E95] text-xs leading-relaxed line-clamp-3">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div
          className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(50,168,138,0.15)', border: '1px solid rgba(50,168,138,0.25)' }}>
              <span style={{ color: '#32A88A', fontSize: '1.1rem' }}>✓</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Transparent from day one</p>
              <p className="text-white/40 text-xs">Scope, milestones and deliverables are agreed in writing before any work begins.</p>
            </div>
          </div>
          <Link href="/contact" className="btn btn-primary btn-sm shrink-0">
            Start a conversation <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
