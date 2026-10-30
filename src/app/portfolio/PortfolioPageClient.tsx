'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Globe, ExternalLink, Search, X, Sparkles, Filter, Layers } from 'lucide-react';
import { portfolioItems as defaultPortfolioItems } from '@/data/portfolio';
import { Breadcrumb } from '@/components/ui';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';
import type { PortfolioItem } from '@/types';

const THUMB_ACCENTS = ['#477BDB', '#32A88A', '#6477C8', '#8B5CF6', '#0EA5E9', '#F43F5E'];

interface ServiceDefinition {
  slug: string;
  name: string;
  shortName: string;
  aliases: string[];
}

const KNOWN_SERVICES: ServiceDefinition[] = [
  {
    slug: 'web-app-development',
    name: 'Web & App Development',
    shortName: 'Web & App',
    aliases: ['web-app-development', 'web & app development', 'web development', 'web and app development', 'web', 'app', 'ecommerce'],
  },
  {
    slug: 'design-branding',
    name: 'Design & Branding',
    shortName: 'Design & Branding',
    aliases: ['design-branding', 'design & branding', 'branding', 'design', 'ui/ux'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing & Paid Ads',
    shortName: 'Digital Marketing',
    aliases: ['digital-marketing', 'digital marketing', 'digital marketing & paid ads', 'performance marketing', 'paid ads', 'marketing', 'seo'],
  },
  {
    slug: 'video-content',
    name: 'Video & Content',
    shortName: 'Video & Content',
    aliases: ['video-content', 'video & content', 'video production', 'content production', 'video', 'content'],
  },
  {
    slug: 'ai-automation',
    name: 'AI & Business Automation',
    shortName: 'AI & Automation',
    aliases: ['ai-automation', 'ai & business automation', 'ai & automation', 'automation', 'chatbots', 'ai'],
  },
  {
    slug: 'other-digital-services',
    name: 'Other Digital Services',
    shortName: 'Other Services',
    aliases: ['other-digital-services', 'other digital services', 'other services', 'maintenance'],
  },
];

function matchesService(item: PortfolioItem, serviceSlug: string): boolean {
  if (serviceSlug === 'All') return true;

  // Direct serviceSlug match
  if (item.serviceSlug && item.serviceSlug.toLowerCase() === serviceSlug.toLowerCase()) {
    return true;
  }

  // Definition aliases match
  const def = KNOWN_SERVICES.find((s) => s.slug === serviceSlug);
  if (!def) {
    return (item.category || '').toLowerCase() === serviceSlug.toLowerCase();
  }

  const catLower = (item.category || '').toLowerCase();
  const itemSlugLower = (item.serviceSlug || '').toLowerCase();

  return def.aliases.some((alias) => catLower.includes(alias) || itemSlugLower.includes(alias));
}

export default function PortfolioPageClient({ initialItems }: { initialItems?: PortfolioItem[] }) {
  const items = initialItems && initialItems.length > 0 ? initialItems : defaultPortfolioItems;

  const [activeService, setActiveService] = useState<string>('All');
  const [activeNiche, setActiveNiche] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishedItems = useMemo(() => {
    return items.filter((p) => p.published !== false);
  }, [items]);

  // Dynamically calculate which services have at least 1 published project
  const availableServices = useMemo(() => {
    const list: { slug: string; name: string; shortName: string; count: number }[] = [];

    // Check known services
    for (const service of KNOWN_SERVICES) {
      const count = publishedItems.filter((p) => matchesService(p, service.slug)).length;
      if (count > 0) {
        list.push({
          slug: service.slug,
          name: service.name,
          shortName: service.shortName,
          count,
        });
      }
    }

    // Capture any custom category added in CMS that does not map to KNOWN_SERVICES
    const unmapped = publishedItems.filter((p) => !KNOWN_SERVICES.some((s) => matchesService(p, s.slug)));
    const customCats = Array.from(new Set(unmapped.map((p) => p.category).filter(Boolean)));
    for (const cat of customCats) {
      const count = publishedItems.filter((p) => p.category === cat).length;
      if (count > 0) {
        list.push({
          slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: cat,
          shortName: cat,
          count,
        });
      }
    }

    return list;
  }, [publishedItems]);

  // Current service projects
  const currentServiceProjects = useMemo(() => {
    if (activeService === 'All') return publishedItems;
    return publishedItems.filter((p) => matchesService(p, activeService));
  }, [publishedItems, activeService]);

  // Sub-categories / Niches inside the currently selected service
  const availableNiches = useMemo(() => {
    const map = new Map<string, number>();

    for (const p of currentServiceProjects) {
      const ind = p.industry?.trim();
      if (ind) {
        map.set(ind, (map.get(ind) || 0) + 1);
      }
    }

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [currentServiceProjects]);

  // Final filtered list of projects based on Service + Niche + Search
  const filtered = useMemo(() => {
    let result = currentServiceProjects;

    // Filter by niche
    if (activeNiche !== 'All') {
      result = result.filter((p) => p.industry === activeNiche);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.industry && p.industry.toLowerCase().includes(q)) ||
          (p.challenge && p.challenge.toLowerCase().includes(q)) ||
          (p.outcome && p.outcome.toLowerCase().includes(q)) ||
          (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(q))) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        );
      });
    }

    return result;
  }, [currentServiceProjects, activeNiche, searchQuery]);

  const handleSelectService = (slug: string) => {
    setActiveService(slug);
    setActiveNiche('All');
  };

  const handleResetFilters = () => {
    setActiveService('All');
    setActiveNiche('All');
    setSearchQuery('');
  };

  const activeServiceObj = availableServices.find((s) => s.slug === activeService);
  const isFiltered = activeService !== 'All' || activeNiche !== 'All' || Boolean(searchQuery.trim());

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

          {/* ── Level 1 Filter: Active Services Only ── */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => handleSelectService('All')}
                className={`filter-pill shrink-0 cursor-pointer ${activeService === 'All' ? 'filter-pill-active' : ''}`}
              >
                <span>All Disciplines</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/15 font-mono">
                  {publishedItems.length}
                </span>
              </button>

              {availableServices.map((s) => (
                <button
                  type="button"
                  key={s.slug}
                  onClick={() => handleSelectService(s.slug)}
                  className={`filter-pill shrink-0 cursor-pointer transition-all ${
                    activeService === s.slug ? 'filter-pill-active' : ''
                  }`}
                >
                  <span>{s.shortName}</span>
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/15 font-mono">
                    {s.count}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Level 2 Filter: Categories / Niches inside Selected Service ── */}
            {availableNiches.length > 0 && (
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md animate-fadeIn">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
                    <Layers size={13} />
                    <span>
                      {activeServiceObj ? `${activeServiceObj.shortName} Categories & Industries` : 'Filter by Industry / Niche'}
                    </span>
                  </div>
                  {activeNiche !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setActiveNiche('All')}
                      className="text-[11px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <X size={11} /> Reset category
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveNiche('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                      activeNiche === 'All'
                        ? 'bg-[#477BDB] text-white shadow-md shadow-blue-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>All {activeServiceObj ? activeServiceObj.shortName : 'Niches'}</span>
                    <span className="ml-1.5 text-[10px] opacity-75 font-mono">({currentServiceProjects.length})</span>
                  </button>

                  {availableNiches.map((niche) => (
                    <button
                      type="button"
                      key={niche.name}
                      onClick={() => setActiveNiche(niche.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                        activeNiche === niche.name
                          ? 'bg-[#32A88A] text-white shadow-md shadow-emerald-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{niche.name}</span>
                      <span className="ml-1.5 text-[10px] opacity-75 font-mono">({niche.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Instant Keyword Search Bar ── */}
            <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case studies, clients, technologies..."
                  className="w-full bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/15 focus:border-[#477BDB] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 outline-none transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status & Clear filters */}
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span>
                  Showing <strong className="text-white">{filtered.length}</strong> of{' '}
                  <span className="text-white/80">{publishedItems.length}</span> projects
                </span>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    <X size={11} /> Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="bg-[#F7F9FC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#DDE3EC] shadow-sm max-w-xl mx-auto p-8">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner"
                style={{ background: '#EBF1FB' }}
              >
                <Filter size={24} className="text-[#477BDB]" />
              </div>
              <h3 className="text-base font-bold text-[#0F1C31] mb-1">No Projects Match Selected Filters</h3>
              <p className="text-[#6B7E95] text-xs leading-relaxed max-w-sm mx-auto">
                No case studies found for the active service or niche combination. Try resetting your search or viewing all disciplines.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 btn btn-primary btn-sm cursor-pointer shadow-md shadow-blue-500/20"
              >
                Reset all filters ({publishedItems.length} available)
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
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          unoptimized={item.thumbnail.startsWith('http')}
                        />

                        {/* Category, Niche, Live & Concept tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-md"
                            style={{
                              background: `${accent}E0`,
                              border: '1px solid rgba(255,255,255,0.25)',
                            }}
                          >
                            {item.category}
                          </span>
                          {item.industry && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/65 text-white/95 backdrop-blur-sm border border-white/15">
                              {item.industry}
                            </span>
                          )}
                          {item.liveUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-sm border border-emerald-400/40 shadow-sm">
                              <Globe size={10} /> Live Site
                            </span>
                          )}
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
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[#32A88A] text-xs font-bold uppercase tracking-wider">{item.client}</p>
                            {item.liveUrl && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <span>Live</span>
                                <ExternalLink size={10} />
                              </span>
                            )}
                          </div>
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
