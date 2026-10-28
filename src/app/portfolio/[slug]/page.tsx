import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { portfolioItems } from '@/data';
import { Breadcrumb } from '@/components/ui';
import { SYNE_FONT, INTER_FONT } from '@/lib/fonts';

interface Props {
  params: Promise<{ slug: string }>;
}

const THUMB_GRADIENTS = [
  'linear-gradient(145deg, #0F1C31 0%, #1A2B4A 60%, #243B66 100%)',
  'linear-gradient(145deg, #0C2620 0%, #153E34 60%, #1A4E44 100%)',
  'linear-gradient(145deg, #1A1830 0%, #252248 60%, #2E2B5A 100%)',
];
const THUMB_ACCENTS = ['#477BDB', '#32A88A', '#6477C8'];

export async function generateStaticParams() {
  return portfolioItems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return {};
  return { title: item.title, description: item.challenge };
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item || !item.published) notFound();

  const idx = portfolioItems.findIndex((p) => p.slug === slug);
  const grad = THUMB_GRADIENTS[idx % THUMB_GRADIENTS.length];
  const accent = THUMB_ACCENTS[idx % THUMB_ACCENTS.length];

  const related = portfolioItems
    .filter((p) => p.published && p.id !== item.id && p.category === item.category)
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
              { label: 'Portfolio', href: '/portfolio' },
              { label: item.title },
            ]}
          />
          <div className="mt-7 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-white"
                style={{ background: `${accent}70`, border: '1px solid rgba(255,255,255,0.18)' }}
              >
                {item.category}
              </span>
              {item.client === 'Concept Project' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-amber-200"
                  style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  Concept Project
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: SYNE_FONT,
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {item.title}
            </h1>
            <p className="text-white/40 text-sm mt-2">{item.client} · {item.year}</p>
          </div>
        </div>
      </div>

      {/* ── Hero thumbnail ── */}
      <div
        className="w-full relative overflow-hidden"
        style={{ background: grad, aspectRatio: '21/7' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: `${accent}30` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            style={{
              fontFamily: SYNE_FONT,
              fontWeight: 800,
              fontSize: 'clamp(6rem, 18vw, 14rem)',
              color: `${accent}12`,
              letterSpacing: '-0.06em',
            }}
          >
            {item.title.charAt(0)}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

            {/* Main content — 2/3 width */}
            <div className="lg:col-span-2 space-y-12">

              {/* Challenge */}
              <div>
                <span className="section-label block mb-4">Challenge</span>
                <p
                  className="text-[#3D4F63] leading-relaxed text-[1.05rem]"
                  style={{ fontFamily: INTER_FONT }}
                >
                  {item.challenge}
                </p>
              </div>

              {/* Approach */}
              <div>
                <span className="section-label block mb-4">Approach</span>
                <p
                  className="text-[#3D4F63] leading-relaxed text-[1.05rem]"
                  style={{ fontFamily: INTER_FONT }}
                >
                  {item.approach}
                </p>
              </div>

              {/* Outcome — no jarring amber, use a navy card */}
              <div>
                <span className="section-label block mb-4">Outcome</span>
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #F0F4F8 0%, #EBF1FB 100%)',
                    border: '1px solid rgba(71,123,219,0.15)',
                  }}
                >
                  <p className="text-[#3D4F63] leading-relaxed text-sm">{item.outcome}</p>
                </div>
              </div>

              {/* Back to portfolio */}
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm text-[#6B7E95] hover:text-[#477BDB] transition-colors"
              >
                <ArrowLeft size={13} />
                Back to portfolio
              </Link>
            </div>

            {/* Sidebar — 1/3 width */}
            <div className="space-y-5">

              {/* Deliverables */}
              <div className="p-5 rounded-2xl border border-[#DDE3EC] bg-[#F7F9FC]">
                <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-4">Deliverables</h3>
                <ul className="space-y-2.5">
                  {item.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-[#3D4F63]">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: accent }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="p-5 rounded-2xl border border-[#DDE3EC]">
                <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-4">Stack & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="p-5 rounded-2xl border border-[#DDE3EC]">
                  <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span key={t} className="text-xs text-[#6B7E95]">#{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)' }}
              >
                <p
                  className="text-white font-bold mb-1.5"
                  style={{ fontFamily: SYNE_FONT, fontSize: '1rem' }}
                >
                  Start a similar project
                </p>
                <p className="text-white/45 text-xs mb-4 leading-relaxed">
                  Tell us your goal. We&apos;ll scope it clearly before any commitment.
                </p>
                <Link href="/contact" className="btn btn-primary btn-sm w-full">
                  Get in touch <ArrowRight size={13} />
                </Link>
              </div>

              {/* Related work */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-4">Related work</h3>
                  <div className="space-y-3">
                    {related.map((r, ri) => (
                      <Link key={r.id} href={`/portfolio/${r.slug}`} className="group block">
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#DDE3EC] hover:border-[#C8D2DF] hover:bg-[#F7F9FC] transition-all duration-150">
                          <div
                            className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                            style={{ background: THUMB_GRADIENTS[ri % THUMB_GRADIENTS.length] }}
                          >
                            <span
                              style={{
                                fontFamily: SYNE_FONT,
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.5)',
                              }}
                            >
                              {r.title.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0F1C31] text-xs font-semibold leading-snug line-clamp-2 group-hover:text-[#477BDB] transition-colors">
                              {r.title}
                            </p>
                          </div>
                          <ArrowRight size={12} className="text-[#DDE3EC] group-hover:text-[#477BDB] transition-colors shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
