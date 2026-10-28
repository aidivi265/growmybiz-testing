import Link from 'next/link';
import { blogPosts } from '@/data';
import { ArrowRight, Clock } from 'lucide-react';

const CAT_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'Web & Digital Strategy': { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'SEO':                    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
  'Design & Branding':      { bg: '#EEF0FA', text: '#4151AA', dot: '#6477C8' },
  'AI & Automation':        { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'Business & Strategy':    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
};
const DEFAULT_CAT = { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' };

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function InsightsPreview() {
  const posts = blogPosts.filter((p) => p.featured && p.published).slice(0, 3);
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const featCat = CAT_CONFIG[featured.category] ?? DEFAULT_CAT;

  return (
    <section
      className="section-pad-lg relative overflow-hidden"
      id="insights"
      style={{ background: '#F7F9FC' }}
    >
      <div className="absolute inset-0 dot-bg opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 mb-12">
          <div>
            <span className="eyebrow block mb-4">Insights</span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#0F1C31',
              }}
            >
              Useful thinking for<br />
              <span
                style={{
                  background: 'linear-gradient(120deg,#477BDB,#6477C8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                growing businesses.
              </span>
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
            style={{ color: '#477BDB' }}
          >
            All articles <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Editorial layout: 1 feature + side stack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Feature post — large card */}
          <Link href={`/insights/${featured.slug}`} className="group block">
            <article
              className="h-full rounded-[20px] overflow-hidden border transition-all duration-200 group-hover:shadow-[0_12px_48px_rgba(15,28,49,0.12)] group-hover:-translate-y-1"
              style={{ background: '#fff', borderColor: '#DDE3EC' }}
            >
              {/* Cover image area */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: '16/7',
                  background: `linear-gradient(135deg, ${featCat.bg} 0%, #fff 100%)`,
                }}
              >
                {/* Large decorative letter */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(80px, 14vw, 140px)',
                      lineHeight: 1,
                      color: featCat.dot,
                      opacity: 0.06,
                    }}
                  >
                    {featured.category[0]}
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: featCat.bg,
                      color: featCat.text,
                      border: `1px solid ${featCat.dot}30`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: featCat.dot }} />
                    {featured.category}
                  </span>
                </div>
                {/* Read time */}
                <div
                  className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: '#6B7E95' }}
                >
                  <Clock size={11} />
                  {featured.readTime} min
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <p className="text-[#A4B3C4] text-xs mb-3">{formatDate(featured.publishedAt)}</p>
                <h3
                  className="font-bold text-[#0F1C31] leading-snug mb-3 group-hover:text-[#477BDB] transition-colors"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  }}
                >
                  {featured.title}
                </h3>
                <p className="text-[#6B7E95] text-sm leading-relaxed line-clamp-3 mb-5">
                  {featured.excerpt}
                </p>
                <div
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: '#477BDB' }}
                >
                  Read article <ArrowRight size={13} />
                </div>
              </div>
            </article>
          </Link>

          {/* Side stack — compact post list */}
          <div className="flex flex-col gap-4">
            {rest.map((post) => {
              const cat = CAT_CONFIG[post.category] ?? DEFAULT_CAT;
              return (
                <Link key={post.id} href={`/insights/${post.slug}`} className="group block">
                  <article
                    className="flex gap-4 p-4 rounded-2xl border transition-all duration-200 group-hover:shadow-[0_4px_20px_rgba(15,28,49,0.08)] group-hover:-translate-y-0.5"
                    style={{ background: '#fff', borderColor: '#DDE3EC' }}
                  >
                    {/* Color strip */}
                    <div
                      className="w-1 rounded-full shrink-0 self-stretch"
                      style={{ background: cat.dot }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: cat.bg, color: cat.text }}
                        >
                          {post.category}
                        </span>
                        <span className="text-[#A4B3C4] text-[10px] flex items-center gap-1">
                          <Clock size={9} /> {post.readTime}m
                        </span>
                      </div>
                      <h3
                        className="text-[#0F1C31] font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#477BDB] transition-colors"
                      >
                        {post.title}
                      </h3>
                      <p className="text-[#A4B3C4] text-[11px] mt-1.5">{formatDate(post.publishedAt)}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-[#DDE3EC] group-hover:text-[#477BDB] transition-colors shrink-0 mt-1"
                    />
                  </article>
                </Link>
              );
            })}

            {/* CTA nudge — dark card for contrast on light section */}
            <div
              className="mt-auto p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Subtle grid */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative z-10">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: '#32A88A' }}
                >
                  <span className="w-3 h-px bg-[#32A88A]" />
                  Get in touch
                </span>
                <p
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    marginBottom: '6px',
                  }}
                >
                  Ready to grow your digital presence?
                </p>
                <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.75rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  Tell us what you need. We will suggest the right approach.
                </p>
                <Link href="/contact" className="btn btn-primary btn-sm w-full justify-center">
                  Start a Project
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
