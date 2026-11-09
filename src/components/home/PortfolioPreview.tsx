import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Globe, Sparkles } from 'lucide-react';
import { portfolioItems as defaultPortfolioItems } from '@/data/portfolio';
import { SYNE_FONT } from '@/lib/fonts';
import type { PortfolioItem } from '@/types';

const ACCENT_COLORS = ['#00F0FF', '#A855F7', '#38BDF8'];

interface PortfolioPreviewProps {
  projects?: PortfolioItem[];
}

export default function PortfolioPreview({ projects }: PortfolioPreviewProps) {
  const pool = projects && projects.length > 0 ? projects : defaultPortfolioItems;
  let featured = pool.filter((p) => p.featured && p.published).slice(0, 3);
  if (featured.length === 0) {
    featured = pool.filter((p) => p.published).slice(0, 3);
  }

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;
  const mainAccent = ACCENT_COLORS[0];

  return (
    <section className="section-pad-lg relative overflow-hidden bg-[#030712] border-t border-white/[0.08]" id="portfolio">
      {/* Ambient Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">

        {/* ── Header ── */}
        <div className="reveal-on-scroll grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
              <Sparkles size={12} className="text-cyan-400" />
              <span>PROVEN PRODUCTION SYSTEMS</span>
            </div>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#FFFFFF',
              }}
            >
              Proven Work &amp; Verified Impact.
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-[480px]">
              Scalable technical platforms, conversion suites, and autonomous workflows engineered for measurable business expansion.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View all case studies</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Editorial Layout: 1 big + 2 side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* Main large card */}
          <Link href={`/portfolio/${main.slug}`} prefetch={false} className="reveal-on-scroll stagger-1 group block">
            <article
              className="rounded-[22px] overflow-hidden relative border border-white/10 bg-[#0B1325]/90 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,240,255,0.18)] transition-all duration-300"
              style={{
                aspectRatio: '16/10',
              }}
            >
              {/* Actual Project Mockup Graphic */}
              <Image
                src={main.thumbnail}
                alt={main.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                unoptimized={main.thumbnail.startsWith('http')}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                style={{ background: 'rgba(0,240,255,0.12)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-cyan-400/90 text-slate-950 backdrop-blur-md border border-cyan-200"
                >
                  <ArrowUpRight size={22} />
                </div>
              </div>

              {/* Top meta */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-slate-950 shadow-md font-mono"
                    style={{ background: mainAccent }}
                  >
                    {main.category}
                  </span>
                  {main.liveUrl && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-slate-950 backdrop-blur-sm border border-emerald-400 shadow-sm font-mono">
                      <Globe size={10} /> Live Site
                    </span>
                  )}
                  {!main.isConcept && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 backdrop-blur-sm border border-cyan-500/40 shadow-sm font-mono">
                      Client Delivery
                    </span>
                  )}
                  {main.isConcept && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 backdrop-blur-sm border border-purple-500/40 shadow-sm font-mono">
                      Framework Demo
                    </span>
                  )}
                </div>
                <span className="text-white/80 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {main.year}
                </span>
              </div>

              {/* Bottom content with vignette */}
              <div
                className="absolute bottom-0 inset-x-0 p-6 pt-16"
                style={{ background: 'linear-gradient(to top, rgba(4,8,18,0.98) 0%, rgba(4,8,18,0.85) 50%, transparent 100%)' }}
              >
                <p className="text-cyan-400 text-xs font-mono font-bold mb-1 uppercase tracking-wider">{main.client}</p>
                <h3
                  className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-cyan-300 transition-colors"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  {main.title}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-1">{main.outcome}</p>
                {main.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {main.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md text-slate-300"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
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
                <Link key={item.id} href={`/portfolio/${item.slug}`} className={`reveal-on-scroll stagger-${i + 2} group block flex-1`}>
                  <article
                    className="h-full rounded-[22px] overflow-hidden relative border border-white/10 bg-[#0B1325]/90 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300"
                    style={{
                      minHeight: '210px',
                    }}
                  >
                    {/* Real SVG preview image */}
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      unoptimized={item.thumbnail.startsWith('http')}
                    />

                    {/* Category, Live & Concept tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-slate-950 shadow-md"
                        style={{ background: ac }}
                      >
                        {item.category}
                      </span>
                      {item.liveUrl && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 backdrop-blur-sm border border-emerald-400 shadow-sm">
                          <Globe size={9} /> Live
                        </span>
                      )}
                      {!item.isConcept && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 backdrop-blur-sm border border-cyan-500/40 shadow-sm">
                          Client
                        </span>
                      )}
                      {item.isConcept && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 backdrop-blur-sm border border-purple-500/40 shadow-sm">
                          Demo
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    >
                      <ArrowUpRight size={14} />
                    </div>

                    {/* Bottom vignette */}
                    <div
                      className="absolute bottom-0 inset-x-0 p-4 pt-10"
                      style={{ background: 'linear-gradient(to top, rgba(4,8,18,0.98) 0%, rgba(4,8,18,0.80) 60%, transparent 100%)' }}
                    >
                      <p className="text-cyan-400 text-[10px] font-mono font-bold mb-0.5 uppercase tracking-wide">{item.client}</p>
                      <h3
                        className="text-white font-bold text-[0.9375rem] leading-snug group-hover:text-cyan-300 transition-colors line-clamp-1"
                        style={{ fontFamily: SYNE_FONT }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-1">{item.outcome}</p>
                    </div>
                  </article>
                </Link>
              );
            })}

            {/* "See all" promo tile */}
            <Link href="/portfolio" className="group block">
              <div
                className="rounded-[20px] flex items-center justify-between transition-all duration-200 border border-dashed border-cyan-500/30 hover:border-cyan-400 bg-white/[0.02] hover:bg-white/[0.05] p-4 sm:p-5"
              >
                <div>
                  <p className="text-white text-xs font-bold font-mono">Explore all case studies &rarr;</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Full-Stack Web, AI Agents &amp; Conversion Systems</p>
                </div>
                <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
