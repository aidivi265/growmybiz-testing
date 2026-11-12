import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { services as defaultServices } from '@/data';
import { fetchServices, fetchServiceBySlug, fetchPortfolio, fetchServiceCategories, fetchPageVisibility } from '@/lib/dal';
import { Section, SectionHeader, Card, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallButton from '@/components/ScheduleCallButton';
import FAQAccordion from '@/components/ui/FAQAccordion';
import ServiceNicheShowcase from '@/components/services/ServiceNicheShowcase';
import { defaultServiceCategories } from '@/data/serviceCategories';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const dynamicServices = await fetchServices();
  const pool = dynamicServices && dynamicServices.length > 0 ? dynamicServices : defaultServices;
  return pool.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await fetchServiceBySlug(slug)) || defaultServices.find((s) => s.slug === slug);
  if (!service) return {};
  const pageUrl = `/services/${slug}`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(service.title)}&type=service&category=${encodeURIComponent('Core Service')}&subtitle=${encodeURIComponent((service.shortDescription || service.description || '').slice(0, 120))}`;

  return {
    title: `${service.title} | Digital Growth Services | Growmybiz24`,
    description: service.shortDescription || service.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${service.title} | Growmybiz24`,
      description: service.shortDescription || service.description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | Growmybiz24`,
      description: service.shortDescription || service.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [serviceData, allServices, allProjects, allCategories, visibility] = await Promise.all([
    fetchServiceBySlug(slug),
    fetchServices(),
    fetchPortfolio(),
    fetchServiceCategories(),
    fetchPageVisibility(),
  ]);

  if (visibility.services === false || !serviceData) {
    notFound();
  }

  const service = serviceData;

  const servicesList = allServices && allServices.length > 0 ? allServices : defaultServices;
  const otherServices = servicesList.filter((s) => s.id !== service.id);
  const serviceCategories = allCategories[slug] || defaultServiceCategories[slug] || [];


    const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription || service.description,
    provider: {
      '@type': 'ProfessionalService',
      name: 'Growmybiz24',
      url: 'https://growmybiz24.com',
    },
    areaServed: 'Global',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} Offerings`,
      itemListElement: (service.offerings || []).map((o, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: o.title,
          description: o.description,
        },
        position: idx + 1,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://growmybiz24.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://growmybiz24.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://growmybiz24.com/services/${slug}`,
      },
    ],
  };

  const faqJsonLd =
    service.faqs && service.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question.trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer.trim(),
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${service.color}, transparent)` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb
            dark
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.title },
            ]}
          />
          <div className="mt-7 flex items-start gap-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${service.color}25`, border: `1px solid ${service.color}35` }}
            >
              <Icon name={service.icon} size={26} style={{ color: service.color }} />
            </div>
            <div>
              <span className="section-label block mb-3">{service.title}</span>
              <h1
                style={{
                  fontFamily: SYNE_FONT,
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  marginBottom: '0.75rem',
                }}
              >
                {service.title}
              </h1>
              <p className="text-white/70 leading-relaxed max-w-2xl">{service.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link href="/contact" className="btn btn-primary btn-md">
                  Discuss this service <ArrowRight size={14} />
                </Link>
                <ScheduleCallButton />
                <Link
                  href={`/estimator?category=${slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:-translate-y-0.5"
                >
                  <Calculator size={14} className="text-emerald-400" />
                  Estimate {service.title} Cost
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offerings */}
      <Section dark>
        <SectionHeader
          dark
          eyebrow="What's included"
          title="Service offerings"
          subtitle="A guide to what this discipline covers. We scope engagements clearly before any work begins."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {service.offerings.map((o) => (
            <Card
              key={o.id}
              dark
              className="p-6 hover:border-white/[0.12] transition-colors"
            >
              <h2 className="text-white font-semibold mb-2">{o.title}</h2>
              <p className="text-white/70 text-sm leading-relaxed">{o.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      {service.deliverables && service.deliverables.length > 0 && (
        <Section dark>
          <SectionHeader
            dark
            eyebrow="Tangible outputs"
            title="What you receive"
            subtitle="Clear deliverables that create tangible value for your business."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.deliverables.map((d, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${service.color}20` }}
                >
                  <span
                    style={{
                      fontFamily: SYNE_FONT,
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      color: service.color,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className="text-white/80 text-sm font-medium">{d}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Specialized Industry Solutions (Automatically hidden if no projects exist) ── */}
      <ServiceNicheShowcase
        serviceSlug={slug}
        serviceTitle={service.title}
        categories={serviceCategories}
        projects={allProjects}
        accentColor={service.color}
      />

      {/* Process */}
      {service.process && service.process.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="How we do it"
            title="Our process"
            subtitle="The steps we take from initial conversation to delivery."
          />
          <div className="max-w-2xl">
            <ol className="space-y-3">
              {service.process.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}
                  >
                    <span
                      style={{
                        fontFamily: SYNE_FONT,
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        color: service.color,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="pt-1.5 text-[0.9375rem] leading-relaxed">
                    {typeof step === 'string' ? (
                      <p className="text-[#3D4F63]">{step}</p>
                    ) : typeof step === 'object' && step !== null ? (
                      <div>
                        {(step as any).title && (
                          <span className="font-semibold text-[#0F1C31] block">
                            {(step as any).title}
                          </span>
                        )}
                        {(step as any).description && (
                          <span className="text-[#475467] text-sm block mt-0.5">
                            {(step as any).description}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[#3D4F63]">{String(step)}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}

      {/* ── Interactive Scope & Cost Estimator Banner for this service ── */}
      <Section dark>
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0F1E36] via-[#162947] to-[#0F1E36] border border-[#2563EB]/30 relative overflow-hidden shadow-2xl">
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: service.color }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                <Calculator size={13} />
                <span>Instant {service.title} Pricing</span>
              </div>
              <h2
                style={{ fontFamily: SYNE_FONT }}
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Calculate your investment for {service.title.toLowerCase()}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Select your deliverables, design fidelity, and required delivery pace to receive a transparent scope breakdown with transparent INR (?) pricing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href={`/estimator?category=${slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)' }}
              >
                <Calculator size={15} />
                <span>Estimate {service.title} Scope</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all"
              >
                <span>Free SEO &amp; Speed Audit</span>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <Section dark>
          <SectionHeader
            dark
            eyebrow="Common questions"
            title="Frequently asked"
            className="max-w-2xl"
          />
          <div className="max-w-2xl">
            <FAQAccordion faqs={service.faqs} accentColor={service.color} />
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <div
          className="rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Ready to talk about {service.title.toLowerCase()}?
            </h2>
            <p className="text-white/50 text-sm">
              Tell us your goals and we will propose a clear scope with no ambiguity.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={`/estimator?category=${slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-950/40 transition-all hover:-translate-y-0.5"
            >
              <Calculator size={14} />
              <span>Calculate Scope &amp; Pricing</span>
            </Link>
            <Link href="/contact" className="btn btn-primary btn-md">
              Start a Project <ArrowRight size={15} />
            </Link>
            <Link href="/portfolio" className="btn btn-ghost-white btn-md">
              View Portfolio
            </Link>
          </div>
        </div>
      </Section>

      {/* Other services */}
      <Section dark>
        <SectionHeader
          dark
          eyebrow="Other services"
          title="Explore what else we do"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {otherServices.slice(0, 3).map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${s.color}18` }}
              >
                <Icon name={s.icon} size={16} style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium leading-tight truncate">{s.title}</p>
                <p className="text-white/60 text-xs mt-0.5 truncate">{s.offerings.length} services</p>
              </div>
              <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors ml-auto shrink-0" />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
