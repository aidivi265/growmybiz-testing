import Link from 'next/link';
import { blogPosts as defaultBlogPosts } from '@/data/insights';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import type { BlogPost } from '@/types';

const CAT_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'Web & Digital Strategy': { bg: 'rgba(0,240,255,0.12)', text: '#38BDF8', dot: '#00F0FF' },
  'SEO':                    { bg: 'rgba(16,185,129,0.12)', text: '#34D399', dot: '#10B981' },
  'Design & Branding':      { bg: 'rgba(168,85,247,0.12)', text: '#C084FC', dot: '#A855F7' },
  'AI & Automation':        { bg: 'rgba(0,240,255,0.14)', text: '#67E8F9', dot: '#00F0FF' },
  'Business & Strategy':    { bg: 'rgba(56,189,248,0.12)', text: '#7DD3FC', dot: '#38BDF8' },
};
const DEFAULT_CAT = { bg: 'rgba(0,240,255,0.12)', text: '#38BDF8', dot: '#00F0FF' };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface InsightsPreviewProps {
  posts?: BlogPost[];
}

export default function InsightsPreview({ posts: propPosts }: InsightsPreviewProps) {
  const pool = propPosts && propPosts.length > 0 ? propPosts : defaultBlogPosts;
  const posts = pool.filter((p) => p.featured && p.published).slice(0, 3);
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const featCat = CAT_CONFIG[featured.category] ?? DEFAULT_CAT;

  return (
    <section
      className="section-pad-lg relative overflow-hidden bg-[#040812] border-t border-white/[0.08]"
      id="insights"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 left-1/3 w-[450px] h-[450px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="reveal-on-scroll grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider mb-4">
              <Sparkles size={12} className="text-cyan-400" />
              <span>KNOWLEDGE &amp; RESEARCH</span>
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
              Useful Thinking for<br />
              <span
                style={{
                  background: 'linear-gradient(120deg, #00F0FF 0%, #A855F7 50%, #38BDF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                High-Growth Businesses.
              </span>
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>All articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Editorial layout: 1 feature + side stack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Feature post — large card */}
          <Link href={`/insights/${featured.slug}`} className="reveal-on-scroll stagger-1 group block">
            <article
              className="h-full rounded-[22px] overflow-hidden border border-white/10 bg-[#0B1325]/85 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col"
            >
              {/* Cover image area */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: '16/7',
                  background: `linear-gradient(135deg, ${featCat.bg} 0%, rgba(11,19,37,0.95) 100%)`,
                }}
              >
                {/* Large decorative letter */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                  <span
                    style={{
                      fontFamily: SYNE_FONT,
                      fontWeight: 800,
                      fontSize: 'clamp(80px, 14vw, 140px)',
                      lineHeight: 1,
                      color: featCat.dot,
                      opacity: 0.12,
                    }}
                  >
                    {featured.category[0]}
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold"
                    style={{
                      background: featCat.bg,
                      color: featCat.text,
                      border: `1px solid ${featCat.dot}40`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: featCat.dot }} />
                    {featured.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mb-3">
                  <span>{formatDate(featured.publishedAt || '')}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featured.readTime || '5 min read'}
                  </span>
                </div>

                <h3
                  className="font-bold text-white text-lg sm:text-xl leading-snug mb-3 group-hover:text-cyan-300 transition-colors"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  {featured.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                  {featured.excerpt}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:gap-3 transition-all pt-3 border-t border-white/[0.08]">
                  <span>Read article</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </article>
          </Link>

          {/* Side stack — smaller cards */}
          <div className="flex flex-col gap-4">
            {rest.map((post, i) => {
              const cat = CAT_CONFIG[post.category] ?? DEFAULT_CAT;
              return (
                <Link key={post.id} href={`/insights/${post.slug}`} className={`reveal-on-scroll stagger-${i + 2} group block flex-1`}>
                  <article
                    className="h-full rounded-2xl p-5 border border-white/10 bg-[#0B1325]/85 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)] transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                          style={{
                            background: cat.bg,
                            color: cat.text,
                            border: `1px solid ${cat.dot}30`,
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {post.readTime || '4 min'}
                        </span>
                      </div>

                      <h4
                        className="font-bold text-white text-sm leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mt-2"
                        style={{ fontFamily: SYNE_FONT }}
                      >
                        {post.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 mt-4">
                      <span>Read insight</span>
                      <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
