import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Compass } from 'lucide-react';
import { teamMembers, valueProps, siteConfig } from '@/data';
import { Section, SectionHeader, Card, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Who we are, what we believe, and how we work. Growmybizz — your digital growth partner.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="pt-24 pb-16 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
          />
          <div className="mt-6 max-w-3xl">
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Built to help businesses<br />grow online.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Growmybizz is a full-service digital agency that brings web, design, marketing, content and AI services together — so growing businesses do not have to coordinate separate vendors.
            </p>
          </div>
        </div>
      </div>

      {/* Story / Mission */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[#32A88A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our story</p>
            <h2 className="text-3xl font-bold text-[#243247] leading-tight mb-5 tracking-tight">
              The opportunity: make digital execution simpler.
            </h2>
            <div className="space-y-4 text-[#718096] leading-relaxed">
              <p>
                Digital growth is fragmented. Businesses need a connected digital presence — but often coordinate separate providers, tools and workflows that do not speak to each other.
              </p>
              <p>
                Growmybizz was created to solve that. One team, connected across web, design, marketing, content and AI. The same strategic context applied across every service.
              </p>
              <p>
                We are building this the right way: starting focused, proving capability through real work, and expanding with evidence rather than promises.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
            >
              Work with us
              <ArrowRight size={14} />
            </Link>
          </div>
          {/* Visual placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] aspect-square max-h-[420px] bg-gradient-to-br from-[#1A2B4A] to-[#243B66] flex items-center justify-center relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
            <div className="text-center relative z-10 p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#477BDB] to-[#6477C8] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
                <span className="text-white text-3xl font-bold">G</span>
              </div>
              <p className="text-white/30 text-sm">
                {siteConfig.siteName}
              </p>
              <p className="text-white/15 text-xs mt-1">{siteConfig.tagline}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section dark>
        <SectionHeader
          dark
          eyebrow="What guides us"
          title="Our working principles."
          subtitle="These are not aspirational statements. They are operational commitments we hold ourselves to on every project."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {valueProps.map((vp) => (
            <Card key={vp.id} dark className="p-6 hover:border-white/[0.1] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                  <Icon name={vp.icon} size={18} className="text-[#477BDB]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{vp.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{vp.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader
          eyebrow="The team"
          title="Who you will work with."
          subtitle="Founder profile and team details will be added as the agency grows. Our work is the best introduction."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200"
            >
              {/* Avatar placeholder */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#477BDB]/20 to-[#6477C8]/20 flex items-center justify-center mb-4 border border-[#E2E8F0]">
                <Users size={22} className="text-[#477BDB]" />
              </div>
              <h3 className="font-semibold text-[#243247] mb-0.5">{member.name}</h3>
              <p className="text-[#477BDB] text-sm mb-3">{member.role}</p>
              <p className="text-[#718096] text-sm leading-relaxed">{member.bio}</p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#718096] hover:text-[#477BDB] transition-colors"
                >
                  LinkedIn
                  <ArrowRight size={11} />
                </a>
              )}
            </div>
          ))}

          {/* Placeholder card */}
          <div className="p-6 rounded-2xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-3">
              <Users size={18} className="text-[#d0d7de]" />
            </div>
            <p className="text-[#d0d7de] text-sm font-medium mb-1">Team growing</p>
            <p className="text-[#d0d7de] text-xs">Collaborators added as the agency scales</p>
          </div>
        </div>
      </Section>

      {/* What we serve */}
      <Section dark>
        <SectionHeader
          dark
          eyebrow="Who we help"
          title="Built for growing teams."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Target,
              title: 'Startups & Founders',
              desc: 'Turn an idea into a launch-ready brand and digital presence.',
            },
            {
              icon: Compass,
              title: 'Small & Local Businesses',
              desc: 'Improve discoverability, enquiries and online customer experience.',
            },
            {
              icon: ArrowRight,
              title: 'E-commerce Brands',
              desc: 'Clearer journeys from discovery to enquiry or purchase.',
            },
            {
              icon: Users,
              title: 'Growing Teams',
              desc: 'Specialist digital execution without building every capability in-house.',
            },
          ].map((segment, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
                <segment.icon size={16} className="text-white/40" />
              </div>
              <h3 className="text-white text-sm font-semibold mb-1.5">{segment.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{segment.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-white/30 text-sm mb-5">Market focus: India first, with delivery designed to support international clients.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-200"
            style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
          >
            Start a conversation
            <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </>
  );
}
