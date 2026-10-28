import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data';
import { Section, SectionHeader, Card, Badge, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Six disciplines, one connected team. Web, design, marketing, content, AI and more — built around your goals.',
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
          <div className="mt-7 max-w-3xl">
            <span className="section-label block mb-4">What we do</span>
            <h1
              style={{
                fontFamily: "var(--syne), var(--font-syne), sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Six disciplines,<br />one connected team.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-xl">
              Engage for a focused project or combine services when your scope calls for it. Every service is delivered from the same strategic foundation.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <Section dark>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block"
            >
              <Card
                dark
                className="p-7 h-full group-hover:border-white/[0.12] group-hover:-translate-y-0.5 transition-all duration-200 group-hover:shadow-xl group-hover:shadow-black/40"
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${service.color}18` }}
                  >
                    <Icon
                      name={service.icon}
                      size={22}
                      style={{ color: service.color }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-white font-semibold text-lg leading-tight">
                        {service.title}
                      </h2>
                      <ArrowRight
                        size={16}
                        className="text-white/20 group-hover:text-white/60 transition-colors shrink-0 mt-0.5"
                      />
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {/* Offerings preview */}
                    <div className="flex flex-wrap gap-2">
                      {service.offerings.slice(0, 4).map((o) => (
                        <span
                          key={o.id}
                          className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-white/35"
                        >
                          {o.title}
                        </span>
                      ))}
                      {service.offerings.length > 4 && (
                        <span className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-white/25">
                          +{service.offerings.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section>
        <div
          className="rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)' }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--syne), var(--font-syne), sans-serif",
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.02em',
                marginBottom: '0.4rem',
              }}
            >
              Not sure which service you need?
            </h2>
            <p className="text-white/50 text-sm">
              Tell us about your project and we will recommend the right approach.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-md shrink-0">
            Start a conversation <ArrowRight size={15} />
          </Link>
        </div>
      </Section>
    </>
  );
}
