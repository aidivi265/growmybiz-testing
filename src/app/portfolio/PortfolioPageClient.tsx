'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { portfolioItems, portfolioCategories } from '@/data';
import { Badge, Breadcrumb } from '@/components/ui';

export default function PortfolioPageClient() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? portfolioItems.filter((p) => p.published)
      : portfolioItems.filter((p) => p.published && p.category === active);

  return (
    <>
      {/* Page Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]}
          />
          <div className="mt-6 max-w-2xl">
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our work</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
              What we've built.
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Concept projects and frameworks are labelled clearly. Client work is added with permission and described honestly.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  active === cat
                    ? 'text-white'
                    : 'bg-[#F1F5F9] text-[#4A5568] hover:text-[#243247] hover:bg-[#E2E8F0]'
                }`}
                style={active === cat ? { background: 'linear-gradient(135deg,#477BDB,#6477C8)' } : undefined}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-[#F8FAFC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-sm">No projects in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group block"
                >
                  <article className="rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#c8d3e0] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10 transition-all duration-200 bg-white">
                    {/* Thumbnail */}
                    <div
                      className="aspect-video relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${
                          ['#0f1117', '#0d1420', '#0d0d14', '#0a0f1e', '#120d1a', '#07100d'][i % 6]
                        } 0%, ${['#1a1a2e', '#0d2137', '#150d2e', '#0d1a30', '#1d0d2a', '#0d2420'][i % 6]} 100%)`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                          backgroundSize: '40px 40px',
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="accent" size="sm">{item.category}</Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 text-white/25 text-xs">{item.year}</div>
                      <div className="absolute inset-0 bg-[#477BDB]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <ExternalLink size={16} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-[#718096] text-xs mb-1.5">{item.client}</p>
                     <h2 className="text-[#243247] font-semibold text-base mb-2 group-hover:text-[#477BDB] transition-colors">
                       {item.title}
                     </h2>
                     <p className="text-[#718096] text-sm line-clamp-2">{item.challenge}</p>

                     {/* Tech tags */}
                     <div className="mt-4 flex flex-wrap gap-1.5">
                       {item.technologies.slice(0, 3).map((tech) => (
                         <span
                           key={tech}
                           className="text-xs px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#4A5568] border border-[#E2E8F0]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Disclosure note */}
          <div className="mt-12 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-[#718096] text-xs leading-relaxed">
              <strong className="text-[#4A5568]">Portfolio note:</strong> Concept and demonstration projects are labelled as such. We do not publish fabricated client logos, testimonials, or results. Client work is added only with explicit permission and described with honest context.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
