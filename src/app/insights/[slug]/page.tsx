import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { blogPosts as defaultBlogPosts } from '@/data';
import { fetchInsights, fetchInsightBySlug } from '@/lib/dal';
import { Breadcrumb } from '@/components/ui';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dynamicPosts = await fetchInsights();
  const pool = dynamicPosts && dynamicPosts.length > 0 ? dynamicPosts : defaultBlogPosts;
  return pool.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await fetchInsightBySlug(slug)) || defaultBlogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const CAT_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'Web & Digital Strategy': { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'SEO':                    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
  'Design & Branding':      { bg: '#EEF0FA', text: '#4151AA', dot: '#6477C8' },
  'AI & Automation':        { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' },
  'Business & Strategy':    { bg: '#E6F5F1', text: '#1E7A62', dot: '#32A88A' },
};
const DEFAULT_CAT = { bg: '#EBF1FB', text: '#2A5DBF', dot: '#477BDB' };

// Rich markdown inline token renderer (bold, italic, links, code)
function renderInline(text: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      const isInternal = match[3].startsWith('/') || match[3].startsWith('#');
      tokens.push(
        isInternal ? (
          <Link key={match.index} href={match[3]} className="text-[#477BDB] font-semibold hover:underline">
            {match[2]}
          </Link>
        ) : (
          <a
            key={match.index}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#477BDB] font-semibold hover:underline"
          >
            {match[2]}
          </a>
        )
      );
    } else if (match[4]) {
      tokens.push(
        <strong key={match.index} className="font-bold text-[#0F1C31]">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      tokens.push(
        <em key={match.index} className="italic text-[#3D4F63]">
          {match[5]}
        </em>
      );
    } else if (match[6]) {
      tokens.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] font-mono text-[0.875em] text-[#0F1C31]"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

// Rich markdown-like block renderer
function renderContent(content: string) {
  return content.split('\n\n').map((block, i) => {
    if (block.startsWith('# ')) {
      return (
        <h1 key={i} style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.025em', color: '#0F1C31', marginTop: '2.5rem', marginBottom: '0.875rem' }}>
          {renderInline(block.slice(2))}
        </h1>
      );
    }
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', color: '#0F1C31', marginTop: '2.2rem', marginBottom: '0.75rem' }}>
          {renderInline(block.slice(3))}
        </h2>
      );
    }
    if (block.startsWith('### ')) {
      return (
        <h3 key={i} style={{ fontFamily: SYNE_FONT, fontWeight: 700, fontSize: '1.15rem', color: '#0F1C31', marginTop: '1.8rem', marginBottom: '0.625rem' }}>
          {renderInline(block.slice(4))}
        </h3>
      );
    }
    if (block.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-[#477BDB] pl-4 py-2 my-4 bg-[#F8FAFC] rounded-r-xl text-[#3D4F63] italic text-[0.95rem] leading-relaxed"
        >
          {renderInline(block.slice(2).replace(/\n>\s*/g, ' '))}
        </blockquote>
      );
    }
    if (block.startsWith('- ') || block.includes('\n- ')) {
      const items = block.split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
      return (
        <ul key={i} style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1rem 0' }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#3D4F63', fontSize: '0.9375rem', marginBottom: '0.5rem', lineHeight: 1.7 }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#477BDB', marginTop: '0.6rem', flexShrink: 0, display: 'block' }} />
              <div>{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    }
    if (block.match(/^\d+\./)) {
      const items = block.split('\n').filter((l) => l.match(/^\d+\./)).map((l) => l.replace(/^\d+\.\s/, ''));
      return (
        <ol key={i} style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1rem 0' }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#3D4F63', fontSize: '0.9375rem', marginBottom: '0.5rem', lineHeight: 1.7 }}>
              <span style={{ fontFamily: SYNE_FONT, fontWeight: 800, color: '#477BDB', fontSize: '0.875rem', flexShrink: 0, minWidth: '1.25rem' }}>{j + 1}.</span>
              <div>{renderInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    if (block.trim() === '') return null;
    return (
      <p key={i} style={{ color: '#3D4F63', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1rem' }}>
        {renderInline(block)}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [fetchedPost, allPosts] = await Promise.all([
    fetchInsightBySlug(slug),
    fetchInsights(),
  ]);

  const post = fetchedPost || defaultBlogPosts.find((p) => p.slug === slug);
  if (!post || !post.published) notFound();

  const cat = CAT_CONFIG[post.category] ?? DEFAULT_CAT;

  const pool = allPosts && allPosts.length > 0 ? allPosts : defaultBlogPosts;
  const related = pool
    .filter((p) => p.published && p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb
            dark
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
              { label: post.title },
            ]}
          />
          <div className="mt-7 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.dot}30` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.dot }} />
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Clock size={11} />
                {post.readTime} min read
              </div>
              <div className="text-white/35 text-xs">{formatDate(post.publishedAt)}</div>
            </div>
            <h1
              style={{
                fontFamily: SYNE_FONT,
                fontSize: 'clamp(1.9rem, 4vw, 2.75rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
              }}
            >
              {post.title}
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-4 max-w-2xl">{post.excerpt}</p>
          </div>
        </div>
      </div>

      {/* ── Article ── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-14">

            {/* ── Article body ── */}
            <article className="lg:col-span-3">
              {renderContent(post.content)}

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-[#DDE3EC] flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full border border-[#DDE3EC] text-[#6B7E95] hover:border-[#C8D2DF] hover:text-[#3D4F63] transition-colors cursor-default"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Author strip */}
              <div
                className="mt-6 p-5 rounded-2xl flex items-center gap-4"
                style={{ background: '#F7F9FC', border: '1px solid #DDE3EC' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}
                >
                  <span style={{ fontFamily: SYNE_FONT, fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>G</span>
                </div>
                <div>
                  <p className="font-semibold text-[#0F1C31] text-sm">{post.author}</p>
                  <p className="text-xs text-[#6B7E95]">Growmybizz — Digital Growth Partner</p>
                </div>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="space-y-5">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-sm text-[#6B7E95] hover:text-[#477BDB] transition-colors"
              >
                <ArrowLeft size={13} />
                All articles
              </Link>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3
                    className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-4"
                    style={{ fontFamily: INTER_FONT }}
                  >
                    Related articles
                  </h3>
                  <div className="space-y-3">
                    {related.map((r) => {
                      const rc = CAT_CONFIG[r.category] ?? DEFAULT_CAT;
                      return (
                        <Link key={r.id} href={`/insights/${r.slug}`} className="group block">
                          <div
                            className="p-4 rounded-xl border transition-all duration-150"
                            style={{ borderColor: '#DDE3EC' }}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <span
                                className="w-1 h-1 rounded-full shrink-0 mt-1.5"
                                style={{ background: rc.dot }}
                              />
                              <p
                                className="text-xs font-semibold text-[#0F1C31] group-hover:text-[#477BDB] transition-colors leading-snug line-clamp-2"
                              >
                                {r.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#A4B3C4] text-[10px] pl-3">
                              <Clock size={9} />
                              {r.readTime} min read
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA card */}
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)' }}
              >
                <p
                  className="text-white font-bold mb-1.5 leading-snug"
                  style={{ fontFamily: SYNE_FONT, fontSize: '0.9375rem' }}
                >
                  Ready to apply this?
                </p>
                <p className="text-white/45 text-xs mb-4 leading-relaxed">
                  Talk to us about how we can help your business specifically.
                </p>
                <Link href="/contact" className="btn btn-primary btn-sm w-full">
                  Start a conversation <ArrowRight size={12} />
                </Link>
              </div>

              {/* Share nudge */}
              <div
                className="p-4 rounded-xl border border-[#DDE3EC] text-center"
                style={{ background: '#F7F9FC' }}
              >
                <p className="text-[#6B7E95] text-xs mb-2">Found this useful?</p>
                <p className="text-[#0F1C31] text-xs font-semibold">Share it with someone who might benefit.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
