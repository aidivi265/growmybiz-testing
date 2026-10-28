import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { portfolioItems } from '@/data';

const GRADIENTS = [
  'linear-gradient(145deg, #0F1C31 0%, #1A2B4A 60%, #243B66 100%)',
  'linear-gradient(145deg, #0C2620 0%, #153E34 60%, #1A4E44 100%)',
  'linear-gradient(145deg, #1A1830 0%, #252248 60%, #2E2B5A 100%)',
];

const ACCENT_COLORS = ['#477BDB', '#32A88A', '#6477C8'];

export default function PortfolioPreview() {
  const featured = portfolioItems.filter((p) => p.featured && p.published).slice(0, 3);

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;
  const mainGrad = GRADIENTS[0];
  const mainAccent = ACCENT_COLORS[0];

  return (
    <section className="section-pad-lg" id="portfolio" style={{ background: '#F7F9FC' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 mb-12">
          <div>
            <span className="eyebrow block mb-4">Our work</span>
            <h2
              style={{
                fontFamily: "var(--syne), var(--font-syne), sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#0F1C31',
              }}
            >
              What we&apos;ve built.
            </h2>
            <p className="text-[#6B7E95] text-sm mt-2 max-w-[420px]">
              Concept projects and frameworks — labelled clearly. Client work added with permission.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
            style={{ color: '#477BDB' }}
          >
            View all work <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Editorial Layout: 1 big + 2 side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

          {/* Main large card */}
          <Link href={`/portfolio/${main.slug}`} className="group block">
            <article
              className="rounded-[20px] overflow-hidden relative"
              style={{
                background: mainGrad,
                aspectRatio: '16/10',
                boxShadow: '0 16px 56px rgba(15,28,49,0.18)',
              }}
            >
              {/* Grid texture */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              {/* Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none"
                style={{ background: `${mainAccent}30` }}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'rgba(71,123,219,0.12)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  <ArrowUpRight size={22} className="text-white" />
                </div>
              </div>

              {/* Top meta */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-white"
                  style={{ background: `${mainAccent}60`, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {main.category}
                </span>
                <span className="text-white/30 text-xs">{main.year}</span>
              </div>

              {/* Bottom content */}
              <div
                className="absolute bottom-0 inset-x-0 p-6"
                style={{ background: 'linear-gradient(to top, rgba(15,28,49,0.9) 0%, transparent 100%)' }}
              >
                <p className="text-white/40 text-xs mb-1">{main.client}</p>
                <h3
                  className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-[#477BDB] transition-colors"
                  style={{ fontFamily: "var(--syne), var(--font-syne), sans-serif" }}
                >
                  {main.title}
                </h3>
                <p className="text-white/50 text-sm line-clamp-1">{main.challenge}</p>
                {main.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {main.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded-md text-white/50"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Link>

          {/* Side stack — 2 smaller cards */}
          <div className="flex flex-col gap-5">
            {rest.map((item, i) => {
              const g = GRADIENTS[(i + 1) % GRADIENTS.length];
              const ac = ACCENT_COLORS[(i + 1) % ACCENT_COLORS.length];
              return (
                <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block flex-1">
                  <article
                    className="h-full rounded-[20px] overflow-hidden relative"
                    style={{
                      background: g,
                      minHeight: '210px',
                      boxShadow: '0 8px 32px rgba(15,28,49,0.14)',
                    }}
                  >
                    {/* Dot pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    {/* Hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: `${ac}15` }}
                    />

                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ background: `${ac}55`, border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <ArrowUpRight size={14} className="text-white" />
                    </div>

                    {/* Bottom */}
                    <div
                      className="absolute bottom-0 inset-x-0 p-4"
                      style={{ background: 'linear-gradient(to top, rgba(15,28,49,0.85) 0%, transparent 100%)' }}
                    >
                      <p className="text-white/35 text-[10px] mb-0.5">{item.client}</p>
                      <h3
                        className="text-white font-bold text-[0.9375rem] leading-snug group-hover:text-white transition-colors"
                        style={{ fontFamily: "var(--syne), var(--font-syne), sans-serif" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              );
            })}

            {/* "See all" promo tile */}
            <Link href="/portfolio" className="group block">
              <div
                className="rounded-[20px] flex flex-col items-center justify-center gap-3 transition-all duration-200"
                style={{
                  minHeight: '80px',
                  background: 'rgba(255,255,255,0.70)',
                  border: '1.5px dashed #C8D3E0',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                <p className="text-[#6B7E95] text-sm font-semibold group-hover:text-[#477BDB] transition-colors">
                  View full portfolio →
                </p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
