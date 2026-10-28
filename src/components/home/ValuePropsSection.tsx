import { valueProps } from '@/data';
import { Icon } from '@/components/Icon';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

const ACCENT = [
  { color: '#477BDB', bg: 'rgba(71,123,219,0.15)', border: 'rgba(71,123,219,0.22)' },
  { color: '#32A88A', bg: 'rgba(50,168,138,0.15)', border: 'rgba(50,168,138,0.22)' },
  { color: '#6477C8', bg: 'rgba(100,119,200,0.15)', border: 'rgba(100,119,200,0.22)' },
  { color: '#0EA5C8', bg: 'rgba(14,165,200,0.15)',  border: 'rgba(14,165,200,0.22)'  },
];

export default function ValuePropsSection() {
  return (
    <section
      className="section-pad relative overflow-hidden"
      id="why"
      style={{ background: 'linear-gradient(155deg, #0F1C31 0%, #152340 50%, #1A2B4A 100%)' }}
    >
      {/* Dot texture */}
      <div className="absolute inset-0 dot-bg-dark opacity-60" />

      {/* Decorative circle — top right */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #477BDB 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-start">

          {/* ── Left — statement ── */}
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow eyebrow-teal block mb-6">Why Growmybizz</span>

            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.028em',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              Built around<br />your outcomes,<br />
              <span style={{
                background: 'linear-gradient(120deg, #32A88A 0%, #477BDB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                not our templates.
              </span>
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: '340px', marginBottom: '2rem', fontSize: '0.9375rem' }}>
              These principles must be earned through delivery. We state them so you can hold us to them.
            </p>

            <Link href="/about" className="btn btn-ghost-white btn-md">
              About us <ArrowRight size={14} />
            </Link>

            {/* Small horizontal rule */}
            <div className="mt-10 h-px w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <p className="mt-4 text-white/20 text-xs leading-relaxed">
              Every commitment below applies<br />on every project, no exceptions.
            </p>
          </div>

          {/* ── Right — 4 principle cards ── */}
          <div className="space-y-3">
            {valueProps.map((vp, i) => {
              const a = ACCENT[i % ACCENT.length];
              return (
                <div
                  key={vp.id}
                  className="group flex items-start gap-5 p-6 rounded-2xl transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  // Pure CSS hover via Tailwind — no JS handler
                >
                  {/* Number + icon */}
                  <div className="shrink-0 flex flex-col items-center gap-2 pt-0.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{ background: a.bg, border: `1px solid ${a.border}` }}
                    >
                      <Icon name={vp.icon} size={18} style={{ color: a.color }} />
                    </div>
                    <span style={{
                      fontFamily: SYNE_FONT,
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      color: 'rgba(255,255,255,0.18)',
                      letterSpacing: '0.06em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-bold text-white mb-1.5"
                      style={{ fontFamily: INTER_FONT, fontSize: '0.9375rem', lineHeight: 1.3 }}
                    >
                      {vp.title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                      {vp.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
