'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts, blogCategories } from '@/data';
import { Breadcrumb } from '@/components/ui';

const CAT_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'All':                    { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'Web & Digital Strategy': { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'SEO':                    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
  'Design & Branding':      { bg: '#EEF0FA', text: '#4151AA', dot: '#6477C8' },
  'AI & Automation':        { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'Business & Strategy':    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
};
const DEFAULT_CAT = { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function InsightsPageClient() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? blogPosts.filter((p) => p.published)
      : blogPosts.filter((p) => p.published && p.category === active);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'Insights' }]} />
          <div className="mt-7 max-w-2xl">
            <span className="section-label block mb-4">Insights</span>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Practical thinking<br />for growing businesses.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-lg">
              Guides, frameworks and honest thinking on web, design, marketing, AI and strategy.
            </p>
          </div>

          {/* ── Filter pills ── */}
          <div className="mt-8 flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
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

      {/* ── Content ── */}
      <div className="bg-[#F7F9FC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EBF1FB' }}>
                <span style={{ color: '#477BDB', fontSize: '1.5rem' }}>○</span>
              </div>
              <p className="text-[#6B7E95] text-sm font-medium">No articles in this category yet.</p>
              <button onClick={() => setActive('All')} className="mt-4 btn btn-outline btn-sm">
                View all articles
              </button>
            </div>
          ) : (
            <>
              {/* ── Featured post ── */}
              {featured && (() => {
                const cat = CAT_CONFIG[featured.category] ?? DEFAULT_CAT;
                return (
                  <Link href={`/insights/${featured.slug}`} className="group block mb-8">
                    <article
                      className="rounded-2xl overflow-hidden border border-[#DDE3EC] hover:border-[#C8D2DF] hover:shadow-[0_12px_48px_rgba(15,28,49,0.10)] transition-all duration-200 bg-white grid grid-cols-1 lg:grid-cols-5"
                    >
                      {/* Cover */}
                      <div
                        className="lg:col-span-2 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${cat.bg} 0%, #fff 100%)`,
                          minHeight: '220px',
                        }}
                      >
                        {/* Big letter decor */}
                        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                          <span
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              fontWeight: 800,
                              fontSize: 'clamp(80px, 12vw, 130px)',
                              color: cat.dot,
                              opacity: 0.07,
                              lineHeight: 1,
                            }}
                          >
                            {featured.category.charAt(0)}
                          </span>
                        </div>
                        {/* Featured badge */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.dot}30` }}
                          >
                            {featured.category}
                          </span>
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: '#0F1C31', color: '#fff' }}
                          >
                            Featured
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="lg:col-span-3 p-7 lg:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3 text-xs text-[#A4B3C4]">
                          <span className="flex items-center gap-1"><Clock size={11} />{featured.readTime} min read</span>
                          <span>·</span>
                          <span>{formatDate(featured.publishedAt)}</span>
                        </div>
                        <h2
                          className="text-xl lg:text-2xl font-bold text-[#0F1C31] mb-3 group-hover:text-[#477BDB] transition-colors leading-snug"
                          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
                        >
                          {featured.title}
                        </h2>
                        <p className="text-[#6B7E95] leading-relaxed mb-5 line-clamp-3 text-sm">{featured.excerpt}</p>
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#477BDB' }}>
                          Read article <ArrowRight size={13} />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })()}

              {/* ── Rest of posts ── */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((post) => {
                    const cat = CAT_CONFIG[post.category] ?? DEFAULT_CAT;
                    return (
                      <Link key={post.id} href={`/insights/${post.slug}`} className="group block">
                        <article className="h-full bg-white rounded-2xl border border-[#DDE3EC] overflow-hidden hover:border-[#C8D2DF] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,28,49,0.10)] transition-all duration-200">
                          {/* Cover */}
                          <div
                            className="aspect-[16/7] relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${cat.bg} 0%, #fff 100%)` }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                              <span
                                style={{
                                  fontFamily: "'Syne', sans-serif",
                                  fontWeight: 800,
                                  fontSize: '5rem',
                                  color: cat.dot,
                                  opacity: 0.08,
                                  lineHeight: 1,
                                }}
                              >
                                {post.category.charAt(0)}
                              </span>
                            </div>
                            <div className="absolute top-3 left-3">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.dot}25` }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.dot }} />
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-2.5 text-xs text-[#A4B3C4]">
                              <Clock size={11} />
                              <span>{post.readTime} min</span>
                              <span className="opacity-50">·</span>
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            <h3
                              className="font-bold text-[#0F1C31] text-[0.9375rem] leading-snug mb-2 group-hover:text-[#477BDB] transition-colors line-clamp-2"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {post.title}
                            </h3>
                            <p className="text-xs text-[#6B7E95] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                            <div className="mt-3.5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#477BDB' }}>
                              Read <ArrowRight size={11} />
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
