import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { portfolioItems } from '@/data/portfolio';
import { SYNE_FONT } from '@/lib/fonts';

const ACCENT_COLORS = ['#477BDB', '#32A88A', '#6477C8'];

export default function PortfolioPreview() {
  const featured = portfolioItems.filter((p) => p.featured && p.published).slice(0, 3);

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;
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
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#0F1C31',
              }}
            >
              Proven work &amp; verified outcomes.
            </h2>
            <p className="text-[#6B7E95] text-sm mt-2 max-w-[460px]">
              Direct client engagements and scalable technical systems built around measurable revenue impact.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
            style={{ color: '#477BDB' }}
          >
            View all case studies <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Editorial Layout: 1 big + 2 side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* Main large card */}
          <Link href={`/portfolio/${main.slug}`} prefetch={false} className="group block">
            <article
              className="rounded-[22px] overflow-hidden relative border border-[#DDE3EC] bg-[#0A1320]"
              style={{
                aspectRatio: '16/10',
                boxShadow: '0 16px 56px rgba(15,28,49,0.18)',
              }}
            >
              {/* Actual Project Mockup Graphic */}
              <img
                src={main.thumbnail}
                alt={main.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                style={{ background: 'rgba(71,123,219,0.15)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
                >
                  <ArrowUpRight size={22} className="text-white" />
                </div>
              </div>

              {/* Top meta */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-white shadow-md"
                    style={{ background: `${mainAccent}E0`, border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    {main.category}
                  </span>
                  {main.isConcept && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/85 text-white backdrop-blur-sm border border-amber-300/40 shadow-sm">
                      Concept Demo
                    </span>
                  )}
                </div>
                <span className="text-white/60 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                  {main.year}
                </span>
              </div>

              {/* Bottom content with vignette */}
              <div
                className="absolute bottom-0 inset-x-0 p-6 pt-16"
                style={{ background: 'linear-gradient(to top, rgba(10,18,32,0.98) 0%, rgba(10,18,32,0.85) 50%, transparent 100%)' }}
              >
                <p className="text-[#4DD8B0] text-xs font-bold mb-1 uppercase tracking-wider">{main.client}</p>
                <h3
                  className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-[#6AADFF] transition-colors"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  {main.title}
                </h3>
                <p className="text-white/70 text-sm line-clamp-1">{main.outcome}</p>
                {main.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {main.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2.5 py-0.5 rounded-md text-white/70 font-medium"
                        style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
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
              const ac = ACCENT_COLORS[(i + 1) % ACCENT_COLORS.length];
              return (
                <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block flex-1">
                  <article
                    className="h-full rounded-[22px] overflow-hidden relative border border-[#DDE3EC] bg-[#0A1320]"
                    style={{
                      minHeight: '210px',
                      boxShadow: '0 8px 32px rgba(15,28,49,0.14)',
                    }}
                  >
                    {/* Real SVG preview image */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Category & Concept tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-md"
                        style={{ background: `${ac}E0`, border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        {item.category}
                      </span>
                      {item.isConcept && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/85 text-white backdrop-blur-sm border border-amber-300/40 shadow-sm">
                          Demo
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm border border-white/20"
                    >
                      <ArrowUpRight size={14} className="text-white" />
                    </div>

                    {/* Bottom vignette */}
                    <div
                      className="absolute bottom-0 inset-x-0 p-4 pt-10"
                      style={{ background: 'linear-gradient(to top, rgba(10,18,32,0.98) 0%, rgba(10,18,32,0.80) 60%, transparent 100%)' }}
                    >
                      <p className="text-[#4DD8B0] text-[10px] font-bold mb-0.5 uppercase tracking-wide">{item.client}</p>
                      <h3
                        className="text-white font-bold text-[0.9375rem] leading-snug group-hover:text-[#6AADFF] transition-colors line-clamp-1"
                        style={{ fontFamily: SYNE_FONT }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1 line-clamp-1">{item.outcome}</p>
                    </div>
                  </article>
                </Link>
              );
            })}

            {/* "See all" promo tile */}
            <Link href="/portfolio" className="group block">
              <div
                className="rounded-[20px] flex items-center justify-between transition-all duration-200 hover:border-[#477BDB] hover:bg-white"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1.5px dashed #C8D3E0',
                  padding: '16px 20px',
                }}
              >
                <div>
                  <p className="text-[#0F1C31] text-xs font-bold">Explore all 6 case studies</p>
                  <p className="text-[#6B7E95] text-[11px]">Web, Design, Marketing &amp; AI</p>
                </div>
                <ArrowRight size={16} className="text-[#477BDB] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
