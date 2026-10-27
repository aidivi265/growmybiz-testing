'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts, blogCategories } from '@/data';
import { Badge, Breadcrumb } from '@/components/ui';

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
      {/* Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Insights' }]}
          />
          <div className="mt-6 max-w-2xl">
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Insights</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
              Practical thinking<br />for growing businesses.
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Guides, frameworks and honest thinking on web, design, marketing, AI and strategy.
            </p>
          </div>

          {/* Category filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
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

      <div className="bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {filtered.length === 0 ? (
            <p className="text-[#718096] text-sm text-center py-16">No articles in this category yet.</p>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link href={`/insights/${featured.slug}`} className="group block mb-10">
                  <article className="rounded-2xl border border-[#e5e7eb] hover:border-[#d0d7de] hover:shadow-xl hover:shadow-black/[0.06] transition-all duration-200 overflow-hidden grid grid-cols-1 lg:grid-cols-5">
                    {/* Cover */}
                    <div className="lg:col-span-2 aspect-video lg:aspect-auto bg-gradient-to-br from-[#0d0d14] to-[#111128] flex items-center justify-center relative">
                      <span className="text-white/10 text-[80px] font-bold">{featured.category[0]}</span>
                      <div className="absolute top-4 left-4">
                        <Badge variant="accent">Featured</Badge>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="lg:col-span-3 p-7 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="default" size="sm">{featured.category}</Badge>
                        <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                          <Clock size={11} />
                          {featured.readTime} min read
                        </div>
                        <span className="text-xs text-[#718096]">
                          {new Date(featured.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-[#243247] mb-3 group-hover:text-[#477BDB] transition-colors leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-[#718096] leading-relaxed mb-5 line-clamp-3">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-[#477BDB] font-medium">
                        Read article <ArrowRight size={13} />
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Rest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link key={post.id} href={`/insights/${post.slug}`} className="group block">
                    <article className="h-full rounded-2xl border border-[#E2E8F0] hover:border-[#d0d7de] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 overflow-hidden">
                      {/* Cover */}
                      <div className="aspect-[16/7] bg-gradient-to-br from-[#F8FAFC] to-[#eaecef] flex items-center justify-center relative">
                        <span className="text-[#e0e4e8] text-5xl font-bold">{post.category[0]}</span>
                        <div className="absolute top-3 left-3">
                          <Badge variant="accent" size="sm">{post.category}</Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Clock size={11} className="text-[#718096]" />
                          <span className="text-xs text-[#718096]">{post.readTime} min read</span>
                          <span className="text-xs text-[#718096]/40">·</span>
                          <span className="text-xs text-[#718096]">
                            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#243247] text-sm leading-snug mb-2 group-hover:text-[#477BDB] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#718096] line-clamp-2">{post.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
