import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '@/data';
import { Section, SectionHeader, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'How we work — a clear, repeatable six-step process from discovery to handover.',
};

export default function ProcessPage() {
  return (
    <>
      {/* Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Process' }]}
          />
          <div className="mt-6 max-w-3xl">
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">How we work</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Clear process,<br />no surprises.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              A repeatable six-step delivery process that keeps projects clear, communication transparent and expectations agreed before work begins.
            </p>
          </div>
          {/* Quality principles */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              'Transparent communication',
              'Documented scope',
              'Realistic timelines',
              'Honest reporting',
            ].map((p) => (
              <span
                key={p}
                className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-white/40"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <Section dark>
        <div className="max-w-3xl mx-auto space-y-1">
          {processSteps.map((step, i) => (
            <div
              key={step.id}
              className="group relative"
            >
              {/* Connector */}
              {i < processSteps.length - 1 && (
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
              className="p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#d0d7de] hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200"
            >
              <span className="text-xs font-medium text-[#477BDB] mb-3 block">{model.tag}</span>
              <h3 className="font-semibold text-[#243247] mb-2">{model.title}</h3>
              <p className="text-sm text-[#718096] leading-relaxed">{model.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section dark>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
          <p className="text-white/40 mb-8">
            Tell us about your project. We will define scope, deliverables and timelines before any commitment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 text-sm"
              style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
            >
              Start a Project
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 font-medium transition-colors text-sm"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
