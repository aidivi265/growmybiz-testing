import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { fetchProcessSteps, fetchPageVisibility } from '@/lib/dal';
import { Section, SectionHeader, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { SYNE_FONT } from '@/lib/fonts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'How we work — a clear, repeatable six-step process from discovery to handover.',
};

export default async function ProcessPage() {
  const [steps, visibility] = await Promise.all([
    fetchProcessSteps(),
    fetchPageVisibility(),
  ]);

  if (visibility.process === false) {
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
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'Process' }]} />
          <div className="mt-7 max-w-3xl">
            <span className="section-label block mb-4">How we work</span>
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
              Clear process,<br />no surprises.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-xl">
              A repeatable six-step delivery process that keeps projects clear, communication transparent and expectations agreed before work begins.
            </p>
          </div>
          {/* Quality principles */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/65">
            {[
              'Transparent communication',
              'Documented scope',
              'Realistic timelines',
              'Honest reporting',
            ].map((p) => (
              <span key={p} className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A]" />
                <span>{p}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <Section dark>
        <div className="max-w-3xl mx-auto space-y-1">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="group relative"
            >
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-[72px] bottom-0 w-px bg-gradient-to-b from-white/[0.08] to-transparent h-8" />
              )}

              <div className="flex items-start gap-5 p-6 rounded-2xl border border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.02] transition-all duration-200 cursor-default">
                {/* Number badge */}
                <div className="w-12 h-12 rounded-xl bg-[#1A2B4A]/60 border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-[#477BDB]/40 transition-colors">
                  <span className="text-[#477BDB] text-sm font-bold">{step.number}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-white font-semibold text-lg">{step.title}</h2>
                    <div className="w-7 h-7 rounded-lg bg-white/[0.03] flex items-center justify-center">
                      <Icon name={step.icon} size={13} className="text-white/30" />
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-xs text-white/30">
                        <span className="w-1 h-1 rounded-full bg-[#477BDB]/50 mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Engagement models */}
      <Section>
        <SectionHeader
          eyebrow="Engagement types"
          title="How we structure work."
          subtitle="Choose the model that fits your situation. We document scope clearly in every case."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Project-Based',
              description: 'Fixed-scope engagements with defined deliverables, timeline and payment milestones.',
              tag: 'Most common',
            },
            {
              title: 'Monthly Retainer',
              description: 'Ongoing marketing, content, optimisation or advisory services with regular reporting.',
              tag: 'Ongoing work',
            },
            {
              title: 'Care & Support',
              description: 'Maintenance, updates, monitoring and technical support plans for existing digital assets.',
              tag: 'Post-launch',
            },
            {
              title: 'Consulting',
              description: 'Audits, roadmaps, integrations and specialist sessions billed by scope or time.',
              tag: 'Advisory',
            },
          ].map((model) => (
            <div
              key={model.title}
              className="p-6 rounded-2xl border border-[#E8EDF4] hover:border-[#C8D3E0] hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200"
            >
              <span className="text-xs font-medium text-[#477BDB] mb-3 block">{model.tag}</span>
              <h3 className="font-semibold text-[#0F1C31] mb-2">{model.title}</h3>
              <p className="text-sm text-[#6B7E95] leading-relaxed">{model.description}</p>
            </div>
          ))}
        </div>
      </Section>

      
    </>
  );
}
