import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { services } from '@/data';
import { Icon } from '@/components/Icon';

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
    <section className="section-pad-lg bg-white" id="services">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="eyebrow block mb-4">What we do</span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 mb-1"
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
              <Link
                key={svc.id}
                href={`/services/${svc.slug}`}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,28,49,0.10)] ${cs.span}`}
                style={{
                  background: '#FAFBFD',
                  border: '1px solid #DDE3EC',
                  padding: isWide ? '28px 28px' : '24px 24px',
                  minHeight: '160px',
                }}
              >
                {/* Index number — top right, very faint */}
                <span
                  className="absolute top-4 right-5 select-none pointer-events-none"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: '3.5rem',
                    color: '#0F1C31',
                    opacity: 0.025,
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Active border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ border: `1.5px solid ${svc.color}40` }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${svc.color}15` }}
                >
                  <Icon name={svc.icon} size={18} style={{ color: svc.color }} />
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-[#0F1C31] mb-2 group-hover:text-[#477BDB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isWide ? '1.0625rem' : '0.9375rem',
                    lineHeight: 1.3,
                  }}
                >
                  {svc.title}
                </h3>

                <p className="text-[#6B7E95] text-sm leading-relaxed mb-4 line-clamp-2">
                  {svc.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {svc.offerings.slice(0, isWide ? 4 : 3).map(o => (
                    <span key={o.id} className="tag">{o.title}</span>
                  ))}
                  {svc.offerings.length > (isWide ? 4 : 3) && (
                    <span className="tag">+{svc.offerings.length - (isWide ? 4 : 3)}</span>
                  )}
                </div>

                {/* Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: svc.color, color: '#fff' }}
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
          className="mt-6 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
          style={{ background: '#F0F4F8', border: '1px solid #DDE3EC' }}
        >
          <p className="text-[#3D4F63] text-sm">
            Not sure which fits?{' '}
            <span className="text-[#6B7E95]">Tell us your goal and we will suggest the right approach.</span>
          </p>
          <Link href="/contact" className="btn btn-dark btn-sm shrink-0">
            Let&apos;s talk <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
