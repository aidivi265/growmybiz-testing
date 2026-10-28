import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { services } from '@/data';
import { Section, SectionHeader, Card, Badge, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.id !== service.id);

  return (
    <>
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
                  fontFamily: "'Syne', sans-serif",
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
              <p className="text-white/50 leading-relaxed max-w-2xl">{service.description}</p>
              <Link href="/contact" className="btn btn-primary btn-md mt-6">
                Discuss this service <ArrowRight size={14} />
              </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.offerings.map((offering) => (
            <Card
              key={offering.id}
              dark
              className="p-6 hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
                {offering.icon ? (
                  <Icon name={offering.icon} size={16} className="text-white/40" />
                ) : (
                  <Icon name={service.icon} size={16} style={{ color: service.color }} />
                )}
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{offering.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{offering.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Process for this service */}
      {service.process && service.process.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="How it works"
            title="Our approach to this service"
            subtitle="A high-level view of how we deliver this type of work. Detailed scopes are documented per engagement."
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
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        color: service.color,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[#3D4F63] pt-1.5 text-[0.9375rem] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <Section dark>
          <SectionHeader
            dark
            eyebrow="Common questions"
            title="Frequently asked"
            className="max-w-2xl"
          />
          <div className="max-w-2xl space-y-3">
            {service.faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl border border-white/[0.06] overflow-hidden"
              >
                <div className="px-5 py-4">
                  <h3 className="text-white font-medium text-sm mb-2">{faq.question}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
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
                fontFamily: "'Syne', sans-serif",
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
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
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
                <p className="text-white/30 text-xs mt-0.5 truncate">{s.offerings.length} services</p>
              </div>
              <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors ml-auto shrink-0" />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
