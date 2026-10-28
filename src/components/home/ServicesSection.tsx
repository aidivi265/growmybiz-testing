import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { services } from '@/data/services';
import { Icon } from '@/components/Icon';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

// Different card sizes — breaks the boring uniform grid
const CARD_STYLES = [
  { span: 'md:col-span-2', tall: false },   // 1 — wide
  { span: 'md:col-span-1', tall: false },   // 2
  { span: 'md:col-span-1', tall: false },   // 3
  { span: 'md:col-span-1', tall: false },   // 4
  { span: 'md:col-span-2', tall: false },   // 5 — wide
  { span: 'md:col-span-1', tall: false },   // 6
];

export default function ServicesSection() {
  return (
    <section className="section-pad-lg" id="services" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="eyebrow block mb-4">What we do</span>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.028em',
                color: '#0F1C31',
              }}
            >
              Six disciplines.<br />
              <span style={{
                background: 'linear-gradient(120deg,#477BDB,#6477C8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                One connected team.
              </span>
            </h2>
          </div>
          <Link href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 mb-1 transition-colors hover:opacity-70"
            style={{ color: '#477BDB' }}>
            View all services <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Services grid — asymmetric 3-col ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {services.map((svc, i) => {
            const cs = CARD_STYLES[i % CARD_STYLES.length];
            const isWide = cs.span === 'md:col-span-2';
            return (
              <Link prefetch={false}
                key={svc.id}
                href={`/services/${svc.slug}`}
                className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 ${cs.span}`}
                style={{
                  background: '#FAFBFD',
                  border: '1px solid #E8EDF4',
                  padding: isWide ? '28px' : '24px',
                  minHeight: isWide ? '170px' : '180px',
                  boxShadow: '0 1px 4px rgba(15,28,49,0.04)',
                }}
              >
                {/* Hover: coloured top accent line */}
                <div
                  className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, ${svc.color}, ${svc.color}80)` }}
                />

                {/* Hover shadow using the service colour */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ boxShadow: `0 12px 40px ${svc.color}18` }}
                />

                {/* Index number — faint watermark */}
                <span
                  className="absolute top-3 right-4 select-none pointer-events-none"
                  style={{
                    fontFamily: SYNE_FONT,
                    fontWeight: 800,
                    fontSize: '3rem',
                    color: svc.color,
                    opacity: 0.06,
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${svc.color}18` }}
                >
                  <Icon name={svc.icon} size={18} style={{ color: svc.color }} />
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-[#0F1C31] mb-2 transition-colors"
                  style={{
                    fontFamily: INTER_FONT,
                    fontSize: isWide ? '1.0625rem' : '0.9375rem',
                    lineHeight: 1.3,
                  }}
                >
                  {svc.title}
                </h3>

                <p className="text-[#6B7E95] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                  {svc.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {svc.offerings.slice(0, isWide ? 4 : 3).map(o => (
                    <span key={o.id} className="tag">{o.title}</span>
                  ))}
                  {svc.offerings.length > (isWide ? 4 : 3) && (
                    <span className="tag">+{svc.offerings.length - (isWide ? 4 : 3)}</span>
                  )}
                </div>

                {/* Arrow — appears on hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: svc.color, color: '#fff', boxShadow: `0 4px 12px ${svc.color}50` }}
                  >
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA bar ── */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-white/60 text-sm">
            Not sure which service fits?{' '}
            <span className="text-white/40">Tell us your goal and we will suggest the right approach.</span>
          </p>
          <Link href="/contact" className="btn btn-primary btn-sm shrink-0">
            Let&apos;s talk <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
