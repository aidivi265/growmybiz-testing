import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data';
import { Badge, Breadcrumb } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// Minimal markdown-ish renderer (no external deps)
function renderContent(content: string) {
  return content
    .split('\n\n')
    .map((block, i) => {
      if (block.startsWith('# ')) {
        return (
          <h1 key={i} className="text-3xl font-bold text-[#243247] mt-10 mb-5 tracking-tight">
            {block.slice(2)}
          </h1>
        );
      }
      if (block.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold text-[#243247] mt-8 mb-3">
            {block.slice(3)}
          </h2>
        );
      }
      if (block.startsWith('**')) {
        return (
          <p key={i} className="font-semibold text-[#243247] mb-3 leading-relaxed">
            {block.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (block.startsWith('- ') || block.includes('\n- ')) {
        const items = block.split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
        return (
          <ul key={i} className="list-none space-y-2 mb-4">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-[#1f2328]">
                <span className="w-1 h-1 rounded-full bg-[#477BDB] mt-2.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        );
      }
      if (block.match(/^\d+\./)) {
        const items = block.split('\n').filter((l) => l.match(/^\d+\./)).map((l) => l.replace(/^\d+\.\s/, ''));
        return (
          <ol key={i} className="list-none space-y-2 mb-4">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-[#1f2328]">
                <span className="text-[#477BDB] font-bold shrink-0">{j + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        );
      }
      if (block.trim() === '') return null;
      return (
        <p key={i} className="text-[#1f2328] leading-relaxed mb-4">
          {block}
        </p>
      );
    });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post || !post.published) notFound();

  const related = blogPosts
    .filter((p) => p.published && p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      {/* Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
              { label: post.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge variant="accent">{post.category}</Badge>
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Clock size={11} />
                {post.readTime} min read
              </div>
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-white/50 text-base leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Content */}
          <article className="lg:col-span-3 prose-custom">
            {renderContent(post.content)}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full border border-[#E2E8F0] text-[#718096]">
                  #{t}
                </span>
              ))}
            </div>

            {/* Author */}
            <div className="mt-6 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#477BDB]/20 flex items-center justify-center shrink-0">
                <span className="text-[#477BDB] text-sm font-bold">G</span>
              </div>
              <div>
                <p className="font-semibold text-[#243247] text-sm">{post.author}</p>
                <p className="text-xs text-[#718096]">Full-service digital agency</p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Link
              href="/insights"
              className="flex items-center gap-2 text-sm text-[#718096] hover:text-[#477BDB] transition-colors"
            >
              <ArrowLeft size={13} />
              All articles
            </Link>

            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#243247] mb-4">Related articles</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/insights/${r.slug}`} className="group block">
                      <div className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#d0d7de] transition-colors">
                        <p className="text-xs font-semibold text-[#243247] mb-1 group-hover:text-[#477BDB] transition-colors leading-snug line-clamp-2">
                          {r.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#718096]">
                          <Clock size={10} />
                          {r.readTime} min read
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="p-5 rounded-2xl bg-[#0d0d14] border border-white/[0.06]">
              <p className="text-white text-sm font-semibold mb-2">Ready to apply this?</p>
              <p className="text-white/40 text-xs mb-4 leading-relaxed">
                Talk to us about how we can help your business specifically.
              </p>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 text-xs text-[#477BDB] hover:text-[#3366C8] font-medium transition-colors"
              >
                Start a conversation <ArrowRight size={11} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
