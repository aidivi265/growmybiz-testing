import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { portfolioItems as defaultPortfolioItems } from '@/data';
import { fetchPortfolio, fetchPortfolioBySlug, fetchPageVisibility } from '@/lib/dal';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const dynamicPortfolio = await fetchPortfolio();
  const pool = dynamicPortfolio && dynamicPortfolio.length > 0 ? dynamicPortfolio : defaultPortfolioItems;
  return pool.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (await fetchPortfolioBySlug(slug)) || defaultPortfolioItems.find((p) => p.slug === slug);
  if (!item) return {};
  return { title: item.title, description: item.challenge };
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params;
  const [fetchedItem, allItems, visibility] = await Promise.all([
    fetchPortfolioBySlug(slug),
    fetchPortfolio(),
    fetchPageVisibility(),
  ]);

  if (visibility.portfolio === false) notFound();

  const item = fetchedItem || defaultPortfolioItems.find((p) => p.slug === slug);
  if (!item || !item.published) notFound();

  const pool = allItems && allItems.length > 0 ? allItems : defaultPortfolioItems;
  const idx = pool.findIndex((p) => p.slug === slug);
  const accent = THUMB_ACCENTS[(idx >= 0 ? idx : 0) % THUMB_ACCENTS.length];

  const related = pool
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
              {(item.isConcept || item.client === 'Concept Project') && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-amber-200"
                  style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  Concept Demonstration
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

            {item.isConcept && item.conceptDisclaimer && (
              <div className="mt-4 p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-200/90 text-xs leading-relaxed max-w-2xl flex items-start gap-2.5">
                <span className="text-amber-400 font-bold shrink-0">✦</span>
                <span>{item.conceptDisclaimer}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Left 2 cols — case study narrative */}
            <div className="lg:col-span-2 space-y-10">

              {/* Visual preview */}
              <div
                className="rounded-2xl overflow-hidden border border-[#DDE3EC] bg-[#0A1320] relative"
                style={{
                  aspectRatio: '16/9',
                  boxShadow: '0 12px 40px rgba(15,28,49,0.12)',
                }}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>

              {/* Challenge */}
              <div>
                <span className="eyebrow block mb-3">The challenge</span>
                <h2
                  className="text-xl font-bold text-[#0F1C31] mb-3"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  What the project set out to solve
                </h2>
                <p className="text-[#3D4F63] leading-relaxed">{item.challenge}</p>
              </div>

              {/* Solution */}
              <div>
                <span className="eyebrow block mb-3">The solution</span>
                <h2
                  className="text-xl font-bold text-[#0F1C31] mb-3"
                  style={{ fontFamily: SYNE_FONT }}
                >
                  Approach &amp; implementation
                </h2>
                <p className="text-[#3D4F63] leading-relaxed">{item.solution || item.approach}</p>
              </div>

              {/* Outcome / Impact */}
              <div className="p-6 rounded-2xl border border-[#DDE3EC] bg-[#F7F9FC]">
                <span className="eyebrow block mb-2">Outcome &amp; impact</span>
                <p className="text-[#0F1C31] font-semibold text-base leading-relaxed mb-4">
                  {item.outcome}
                </p>
                {item.metrics && item.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DDE3EC]">
                    {item.metrics.map((m, i) => (
                      <div key={i}>
                        <p
                          className="font-bold text-[#477BDB]"
                          style={{ fontFamily: SYNE_FONT, fontSize: '1.4rem' }}
                        >
                          {m.value}
                        </p>
                        <p className="text-[#6B7E95] text-xs mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deliverables */}
              {item.deliverables.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-4">
                    Key Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.deliverables.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DDE3EC] text-sm text-[#3D4F63]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to portfolio */}
              <div className="pt-4 border-t border-[#DDE3EC]">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#477BDB] hover:underline"
                >
                  <ArrowLeft size={14} /> Back to all projects
                </Link>
              </div>
            </div>

            {/* Right col — metadata sidebar */}
            <div className="space-y-6">

              {/* Project info card */}
              <div className="p-6 rounded-2xl border border-[#DDE3EC] bg-[#F7F9FC] space-y-4">
                <div>
                  <p className="text-xs text-[#6B7E95] mb-0.5">Client / Engagement</p>
                  <p className="text-sm font-semibold text-[#0F1C31]">{item.client}</p>
                </div>
                <div className="pt-3 border-t border-[#DDE3EC]">
                  <p className="text-xs text-[#6B7E95] mb-0.5">Discipline</p>
                  <p className="text-sm font-semibold text-[#0F1C31]">{item.category}</p>
                </div>
                <div className="pt-3 border-t border-[#DDE3EC]">
                  <p className="text-xs text-[#6B7E95] mb-0.5">Year</p>
                  <p className="text-sm font-semibold text-[#0F1C31]">{item.year}</p>
                </div>
                <div className="pt-3 border-t border-[#DDE3EC]">
                  <p className="text-xs text-[#6B7E95] mb-0.5">Status</p>
                  <p className="text-sm font-semibold text-emerald-600">Delivered &amp; Verified</p>
                </div>
              </div>

              {/* Tech Stack */}
              {((item.techStack && item.techStack.length > 0) || (item.technologies && item.technologies.length > 0)) && (
                <div className="p-5 rounded-2xl border border-[#DDE3EC]">
                  <h3 className="text-xs font-bold text-[#0F1C31] tracking-widest uppercase mb-3">
                    Technologies &amp; Tools
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {((item.techStack && item.techStack.length > 0) ? item.techStack : item.technologies).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-[#EBF1FB] text-[#2A5DBF] text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
