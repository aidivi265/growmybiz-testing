import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { portfolioItems } from '@/data';

// Gradient swatches per card position — gives each card a distinct identity
const SWATCHES = [
  'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)',
  'linear-gradient(135deg, #0F2E28 0%, #1A4E44 100%)',
  'linear-gradient(135deg, #1C1A3A 0%, #2E2B5A 100%)',
];

export default function PortfolioPreview() {
  const featured = portfolioItems.filter((p) => p.featured && p.published).slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
          <div>
            <p className="eyebrow mb-3">Our work</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#243247] leading-tight tracking-tight">
              What we&apos;ve built.
            </h2>
            <p className="text-[#718096] mt-2 max-w-md">
              Concept projects and frameworks — labelled clearly. Client work added with permission.
            </p>
          </div>
          <Link href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#477BDB] hover:text-[#3366C8] transition-colors shrink-0">
            View all work <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block">
              <article className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_10px_40px_rgba(36,50,71,0.14)] group-hover:border-[#CBD5E0]">

                {/* Thumbnail — rich dark card */}
                <div className="aspect-video relative overflow-hidden" style={{ background: SWATCHES[i % SWATCHES.length] }}>
                  {/* Dot texture */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                  {/* Category pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                      style={{ background: 'rgba(71,123,219,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {item.category}
                    </span>
                  </div>
                  {/* Year */}
                  <div className="absolute bottom-3 right-3 text-white/40 text-xs">{item.year}</div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(71,123,219,0.15)' }}>
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-[#A0AEC0] mb-1.5 font-medium">{item.client}</p>
                  <h3 className="font-bold text-[#243247] text-base mb-2 group-hover:text-[#477BDB] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#718096] line-clamp-2">{item.challenge}</p>

                  {/* Tech tags */}
                  {item.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.technologies.slice(0, 3).map((tech) => (
                        <span key={tech}
                          className="text-xs px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#4A5568] border border-[#E2E8F0]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
