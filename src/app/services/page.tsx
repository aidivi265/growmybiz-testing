import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { fetchServices, fetchPageVisibility } from '@/lib/dal';
import { Section, Card, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { SYNE_FONT } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Digital Growth Services | Web, Branding, Marketing & AI',
  description:
    'Six connected disciplines: Web & Mobile Engineering, Conversion UI/UX, Performance Marketing, AI Automation, and Content Architecture.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Digital Growth Services | Growmybiz24',
    description:
      'Six connected disciplines: Web & Mobile Engineering, Conversion UI/UX, Performance Marketing, AI Automation, and Content Architecture.',
    url: '/services',
    type: 'website',
    images: [
      {
        url: '/brand-logo-white-bg.png',
        width: 1200,
        height: 630,
        alt: 'Growmybiz24 Digital Growth Services',
      },
    ],
  },
};

export const revalidate = 60;

export default async function ServicesPage() {
  const [services, visibility] = await Promise.all([
    fetchServices(),
    fetchPageVisibility(),
  ]);

  if (visibility.services === false) {
    notFound();
  }
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
                fontFamily: SYNE_FONT,
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
                    <p className="text-slate-200 text-sm leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {/* Offerings preview */}
                    <div className="flex flex-wrap gap-2">
                      {service.offerings.slice(0, 4).map((o) => (
                        <span
                          key={o.id}
                          className="text-xs px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300"
                        >
                          {o.title}
                        </span>
                      ))}
                      {service.offerings.length > 4 && (
                        <span className="text-xs px-2.5 py-1 rounded-lg border border-blue-500/20 bg-blue-500/10 text-[#6AADFF] font-medium">
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

        {/* ── Interactive Cost Estimator Callout Banner ── */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-emerald-950/20 to-purple-950/30 border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
                <Calculator size={13} />
                <span>Instant Scope & Investment Calculator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-syne text-white tracking-tight">
                Want to know your exact project investment upfront?
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Use our 5-step interactive cost estimator. Select deliverables across Web, Mobile, AI, Branding, and Marketing to lock in a transparent quote.
              </p>
            </div>
            <Link
              href="/estimator"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-xl shadow-emerald-950/50 shrink-0"
            >
              <Calculator size={16} />
              <span>Launch Cost Estimator</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Section>

      
    </>
  );
}
