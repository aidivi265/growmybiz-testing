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
      {/* Page Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
          />
          <div className="mt-6 max-w-3xl">
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              What we do
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Six disciplines,<br />one connected team.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
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
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#243247] mb-2">
              Not sure which service you need?
            </h2>
            <p className="text-[#718096]">
              Tell us about your project and we will recommend the right approach.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 shrink-0 text-sm"
            style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
          >
            Start a conversation
            <ArrowRight size={15} />
          </Link>
        </div>
      </Section>
    </>
  );
}
