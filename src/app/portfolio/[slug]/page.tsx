import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';
import { portfolioItems } from '@/data';
import { Section, Badge, Breadcrumb } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return portfolioItems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.challenge,
  };
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item || !item.published) notFound();

  return (
    <>
      {/* Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[
              { label: 'Home', href: '/' },
              { label: 'Portfolio', href: '/portfolio' },
              { label: item.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="accent">{item.category}</Badge>
              {item.client === 'Concept Project' && (
                <Badge variant="warning">Concept Project</Badge>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 tracking-tight">
              {item.title}
            </h1>
            <p className="text-white/40 text-sm">{item.client} · {item.year}</p>
          </div>
        </div>
      </div>

      {/* Placeholder thumbnail */}
      <div
        className="w-full aspect-[16/6] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d14 0%, #111128 50%, #0d1420 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/10 text-[120px] font-bold leading-none select-none">
            {item.title[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Challenge */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#477BDB] mb-3">Challenge</h2>
              <p className="text-[#1f2328] leading-relaxed">{item.challenge}</p>
            </div>
            {/* Approach */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#477BDB] mb-3">Approach</h2>
              <p className="text-[#1f2328] leading-relaxed">{item.approach}</p>
            </div>
            {/* Outcome */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#477BDB] mb-3">Outcome</h2>
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                <p className="text-amber-800 text-sm leading-relaxed">{item.outcome}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deliverables */}
            <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="text-sm font-semibold text-[#243247] mb-3">Deliverables</h3>
              <ul className="space-y-2">
                {item.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-[#718096]">
                    <span className="w-1 h-1 rounded-full bg-[#477BDB] mt-2 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="p-5 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#243247] mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[#4A5568] bg-[#F1F5F9]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="p-5 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#243247] mb-3 flex items-center gap-1.5">
                <Tag size={12} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-xs text-[#718096]">#{t}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-medium transition-colors"
              style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
            >
              Start a similar project
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
