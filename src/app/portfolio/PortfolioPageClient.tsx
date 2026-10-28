'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { portfolioItems, portfolioCategories } from '@/data/portfolio';
import { Breadcrumb } from '@/components/ui';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

const THUMB_ACCENTS = ['#477BDB', '#32A88A', '#6477C8', '#8B5CF6', '#0EA5E9', '#F43F5E'];

export default function PortfolioPageClient() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? portfolioItems.filter((p) => p.published)
      : portfolioItems.filter((p) => p.published && p.category === active);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]} />
          <div className="mt-7 max-w-2xl">
            <span className="section-label block mb-4">Our work</span>
            <h1
              style={{
                fontFamily: SYNE_FONT,
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Proven work &amp; case studies.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-lg">
              Explore client engagements and technical frameworks engineered around conversion rate, brand equity, and business growth.
            </p>
          </div>

          {/* ── Filter pills ── */}
          <div className="mt-8 flex flex-wrap gap-2">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`filter-pill ${active === cat ? 'filter-pill-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="bg-[#F7F9FC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: '#EBF1FB' }}
              >
                <span style={{ color: '#477BDB', fontSize: '1.5rem' }}>○</span>
              </div>
              <p className="text-[#6B7E95] text-sm font-medium">No projects in this category yet.</p>
              <button
                onClick={() => setActive('All')}
                className="mt-4 btn btn-outline btn-sm"
              >
                View all work
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => {
                const accent = THUMB_ACCENTS[i % THUMB_ACCENTS.length];
                return (
                  <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block">
                    <article className="rounded-2xl overflow-hidden border border-[#DDE3EC] hover:border-[#C8D2DF] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(15,28,49,0.12)] transition-all duration-300 bg-white flex flex-col h-full">
                      {/* Real Mockup Visual */}
                      <div className="aspect-video relative overflow-hidden bg-[#0C1626]">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Category & Concept tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-md"
                            style={{
                              background: `${accent}E0`,
                              border: '1px solid rgba(255,255,255,0.25)',
                            }}
                          >
                            {item.category}
                          </span>
                          {item.isConcept && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/85 text-white backdrop-blur-sm border border-amber-300/40 shadow-sm">
                              Concept Demo
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                          {item.year}
                        </div>

                        {/* Hover overlay icon */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-black/30 backdrop-blur-xs"
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg"
                          >
                            <ArrowUpRight size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[#32A88A] text-xs font-bold uppercase tracking-wider mb-1.5">{item.client}</p>
                          <h2
                            className="text-[#0F1C31] font-bold text-base mb-2 group-hover:text-[#477BDB] transition-colors leading-snug"
                            style={{ fontFamily: INTER_FONT }}
                          >
                            {item.title}
                          </h2>
                          <p className="text-[#6B7E95] text-xs leading-relaxed line-clamp-2">{item.challenge}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#F0F4F8]">
                          <p className="text-[11px] text-[#243B66] font-semibold mb-2.5 line-clamp-1">
                            <span className="text-[#32A88A]">Outcome:</span> {item.outcome}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.technologies.slice(0, 3).map((tech) => (
                              <span key={tech} className="tag text-[10px] py-0.5 px-2">{tech}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Trust signal / transparency note */}
          <div className="mt-12 flex items-start gap-3 p-5 rounded-2xl border border-[#DDE3EC] bg-white shadow-sm">
            <div className="w-6 h-6 rounded-full bg-[#EBF1FB] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#477BDB] text-xs font-bold">✓</span>
            </div>
            <div>
              <p className="text-[#0F1C31] text-xs font-bold mb-0.5">Transparent Proof Standards</p>
              <p className="text-[#6B7E95] text-xs leading-relaxed">
                All metrics reported above reflect verified outcomes from client deployments and pilot engagements. We do not publish fabricated logos or hypothetical performance claims.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
