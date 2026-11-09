'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { PortfolioItem } from '@/types';
import { SYNE_FONT } from '@/lib/fonts';

interface ServiceNicheShowcaseProps {
  serviceSlug?: string;
  serviceTitle: string;
  categories: string[];
  projects: PortfolioItem[];
  accentColor?: string;
}

function projectMatchesCategory(project: PortfolioItem, category: string, serviceSlug?: string): boolean {
  // If the project is linked to a specific service, only match on that service's page
  if (serviceSlug && project.serviceSlug && project.serviceSlug !== serviceSlug) {
    return false;
  }

  const norm = category.toLowerCase().trim();
  const pIndustry = (project.industry || '').toLowerCase().trim();
  const pTags = (project.tags || []).map((t) => t.toLowerCase().trim());
  const pTitle = (project.title || '').toLowerCase();
  const pClient = (project.client || '').toLowerCase();

  // 1. Direct industry match (highest confidence)
  if (pIndustry && (pIndustry === norm || pIndustry.includes(norm) || norm.includes(pIndustry))) {
    return true;
  }

  // 2. Keyword segment matching (e.g. "hospital", "clinic", "cafe", "restaurant", "ecommerce", "real estate")
  const keywords = norm
    .split(/[,/&]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 2);

  return keywords.some(
    (k) =>
      (pIndustry && pIndustry.includes(k)) ||
      pTags.some((t) => t.includes(k) || k.includes(t)) ||
      pTitle.includes(k) ||
      pClient.includes(k)
  );
}

export default function ServiceNicheShowcase({
  serviceSlug,
  serviceTitle,
  categories,
  projects,
  accentColor = '#477BDB',
}: ServiceNicheShowcaseProps) {
  // RULE: Only keep categories that have at least one uploaded, published project
  const activeCategoriesWithProjects = categories.filter((cat) =>
    projects.some((p) => p.published && projectMatchesCategory(p, cat, serviceSlug))
  );

  const [activeTab, setActiveTab] = useState<string>('All');

  // If no category has a project, DO NOT RENDER the section
  if (activeCategoriesWithProjects.length === 0) {
    return null;
  }

  // Filter projects based on active tab
  const filteredProjects =
    activeTab === 'All'
      ? projects.filter(
          (p) =>
            p.published &&
            activeCategoriesWithProjects.some((cat) => projectMatchesCategory(p, cat, serviceSlug))
        )
      : projects.filter((p) => p.published && projectMatchesCategory(p, activeTab, serviceSlug));

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden" style={{ background: '#09101D' }}>
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/10 bg-white/5 text-white/80">
            <Sparkles size={12} style={{ color: accentColor }} />
            <span>Tailored Industry Solutions</span>
          </div>
          <h2
            style={{
              fontFamily: SYNE_FONT,
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
            }}
          >
            Specialized for your industry.<br />
            <span
              style={{
                background: `linear-gradient(120deg, ${accentColor}, #ffffff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Proven across specific verticals.
            </span>
          </h2>
          <p className="text-white/50 text-sm mt-3 leading-relaxed">
            Every vertical requires specific user journeys, conversion cues, and architectural standards.
            Explore our delivered work and capabilities across proven sectors.
          </p>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'All'
                ? 'text-white shadow-lg'
                : 'text-white/60 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/5'
            }`}
            style={{
              background: activeTab === 'All' ? accentColor : undefined,
              boxShadow: activeTab === 'All' ? `0 4px 18px ${accentColor}40` : undefined,
            }}
          >
            <span>All Verticals</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'All' ? 'bg-black/20 text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              {filteredProjects.length}
            </span>
          </button>

          {activeCategoriesWithProjects.map((cat) => {
            const count = projects.filter((p) => p.published && projectMatchesCategory(p, cat)).length;
            const isSelected = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'text-white shadow-lg'
                    : 'text-white/60 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/5'
                }`}
                style={{
                  background: isSelected ? accentColor : undefined,
                  boxShadow: isSelected ? `0 4px 18px ${accentColor}40` : undefined,
                }}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid for Active Industry Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col justify-between hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              {/* Thumbnail image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09101D] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {item.client}
                  </span>
                  {item.year && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 backdrop-blur-md text-white/70">
                      {item.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-white font-bold text-base leading-snug mb-2 group-hover:text-white transition-colors"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  {item.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                  {item.challenge || item.solution}
                </p>

                {/* Outcome Highlight */}
                {item.outcome && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-5 flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-white/80 font-medium leading-snug line-clamp-2">
                      {item.outcome}
                    </span>
                  </div>
                )}

                {/* Card footer CTA */}
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/5 text-xs font-semibold text-white/70 group-hover:text-white transition-colors"
                >
                  <span>Explore Case Study</span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:translate-x-0.5"
                    style={{ background: `${accentColor}25`, color: accentColor }}
                  >
                    <ArrowUpRight size={13} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Need a custom solution for your vertical?</p>
            <p className="text-white/40 text-xs mt-0.5">We engineer bespoke platforms tailored to your business model.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md shrink-0 flex items-center gap-1.5 hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #6477C8)` }}
          >
            <span>Discuss {serviceTitle} Project</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
