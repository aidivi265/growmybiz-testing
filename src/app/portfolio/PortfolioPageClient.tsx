'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { portfolioItems, portfolioCategories } from '@/data';
import { Breadcrumb } from '@/components/ui';

const THUMB_GRADIENTS = [
  'linear-gradient(145deg, #0F1C31 0%, #1A2B4A 60%, #243B66 100%)',
  'linear-gradient(145deg, #0C2620 0%, #153E34 60%, #1A4E44 100%)',
  'linear-gradient(145deg, #1A1830 0%, #252248 60%, #2E2B5A 100%)',
  'linear-gradient(145deg, #1A1020 0%, #2A1840 60%, #362055 100%)',
  'linear-gradient(145deg, #0A1820 0%, #102535 60%, #1A3848 100%)',
  'linear-gradient(145deg, #200A10 0%, #38101C 60%, #4A1828 100%)',
];
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
                fontFamily: "var(--syne), var(--font-syne), sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              What we&apos;ve built.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-lg">
              Concept projects and frameworks are labelled clearly. Client work is added with permission.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => {
                const grad = THUMB_GRADIENTS[i % THUMB_GRADIENTS.length];
                const accent = THUMB_ACCENTS[i % THUMB_ACCENTS.length];
                return (
                  <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block">
                    <article className="rounded-2xl overflow-hidden border border-[#DDE3EC] hover:border-[#C8D2DF] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,28,49,0.12)] transition-all duration-200 bg-white">
                      {/* Thumbnail */}
                      <div
                        className="aspect-video relative overflow-hidden"
                        style={{ background: grad }}
                      >
                        {/* Grid texture */}
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                          }}
                        />
                        {/* Glow */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[50px] pointer-events-none"
                          style={{ background: `${accent}40` }}
                        />
                        {/* First letter monogram */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                          <span
                            style={{
                              fontFamily: "var(--syne), var(--font-syne), sans-serif",
                              fontWeight: 800,
                              fontSize: '5rem',
                              color: `${accent}20`,
                              letterSpacing: '-0.05em',
                            }}
                          >
                            {item.title.charAt(0)}
                          </span>
                        </div>
                        {/* Category tag */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                            style={{
                              background: `${accent}70`,
                              backdropFilter: 'blur(6px)',
                              border: '1px solid rgba(255,255,255,0.18)',
                            }}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 right-3 text-white/25 text-[11px]">{item.year}</div>
                        {/* Hover overlay */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                          style={{ background: `${accent}18` }}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255,255,255,0.25)',
                            }}
                          >
                            <ArrowUpRight size={18} className="text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-[#A4B3C4] text-xs mb-1 font-medium">{item.client}</p>
                        <h2
                          className="text-[#0F1C31] font-bold text-[0.9375rem] mb-2 group-hover:text-[#477BDB] transition-colors leading-snug"
                          style={{ fontFamily: "var(--inter), var(--font-inter), sans-serif" }}
                        >
                          {item.title}
                        </h2>
                        <p className="text-[#6B7E95] text-sm line-clamp-2">{item.challenge}</p>
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {item.technologies.slice(0, 3).map((tech) => (
                            <span key={tech} className="tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Disclosure note */}
          <div className="mt-10 flex items-start gap-3 p-4 rounded-xl border border-[#DDE3EC] bg-white">
            <div className="w-5 h-5 rounded-full bg-[#EBF1FB] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#477BDB] text-[10px] font-bold">i</span>
            </div>
            <p className="text-[#6B7E95] text-xs leading-relaxed">
              <strong className="text-[#3D4F63] font-semibold">Portfolio note:</strong> Concept and demonstration projects are labelled as such. We do not publish fabricated client logos, testimonials, or results. Client work is added only with explicit permission.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
