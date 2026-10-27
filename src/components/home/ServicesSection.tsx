import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data';
import { Icon } from '@/components/Icon';

// Map index to subtle background colour for variety
const CARD_ACCENTS = [
  { light: '#EBF1FB', icon: '#477BDB' },
  { light: '#EEF0FA', icon: '#6477C8' },
  { light: '#E6F5F1', icon: '#32A88A' },
  { light: '#EBF1FB', icon: '#477BDB' },
  { light: '#E6F5F1', icon: '#32A88A' },
  { light: '#EEF0FA', icon: '#6477C8' },
];

export default function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-14">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">What we do</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#243247] leading-tight tracking-tight">
              Six disciplines,<br />
              <span style={{
                background: 'linear-gradient(135deg,#477BDB,#6477C8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>one connected team.</span>
            </h2>
            <p className="text-[#4A5568] mt-3 leading-relaxed">
              Engage for a focused project or combine services when your scope calls for it.
            </p>
          </div>
          <Link href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#477BDB] hover:text-[#3366C8] transition-colors shrink-0">
            All services <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Link key={service.id} href={`/services/${service.slug}`} className="group block">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_32px_rgba(36,50,71,0.12)] group-hover:border-[#CBD5E0]">

                  {/* Icon badge */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: accent.light }}>
                    <Icon name={service.icon} size={20} style={{ color: accent.icon }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[#243247] font-bold text-base mb-2 group-hover:text-[#477BDB] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#718096] text-sm leading-relaxed mb-5 line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Offering tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.offerings.slice(0, 3).map((o) => (
                      <span key={o.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#4A5568] border border-[#E2E8F0]">
                        {o.title}
                      </span>
                    ))}
                    {service.offerings.length > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#A0AEC0] border border-[#E2E8F0]">
                        +{service.offerings.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                    <span className="text-xs text-[#A0AEC0]">{service.offerings.length} services</span>
                    <span className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accent.icon }}>
                      Explore <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
