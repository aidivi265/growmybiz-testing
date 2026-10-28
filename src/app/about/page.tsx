import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Compass } from 'lucide-react';
import { siteConfig } from '@/data';
import { fetchTeamMembers, fetchValueProps, fetchSiteSettings } from '@/lib/dal';
import { Section, SectionHeader, Card, Breadcrumb } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { SYNE_FONT } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Who we are, what we believe, and how we work. Growmybizz — your digital growth partner.',
};

export default async function AboutPage() {
  const [members, values, settings] = await Promise.all([
    fetchTeamMembers(),
    fetchValueProps(),
    fetchSiteSettings(),
  ]);
  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="pt-24 pb-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 55%, #243B66 100%)' }}
      >
        <div className="absolute inset-0 dot-bg-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <Breadcrumb dark items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
          <div className="mt-7 max-w-3xl">
            <span className="section-label block mb-4">About us</span>
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
              Built to help businesses<br />grow online.
            </h1>
            <p className="text-white/50 text-base leading-relaxed mt-3 max-w-xl">
              A full-service digital agency that brings web, design, marketing, content and AI together — so growing businesses do not have to coordinate separate vendors.
            </p>
          </div>
        </div>
      </div>

      {/* Story / Mission */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="eyebrow block mb-3">Our story</span>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: '#0F1C31',
                marginBottom: '1.25rem',
              }}
            >
              The opportunity: make digital execution simpler.
            </h2>
            <div className="space-y-4 text-[#6B7E95] leading-relaxed">
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
            <Link href="/contact" className="btn btn-primary btn-md mt-7">
              Work with us <ArrowRight size={14} />
            </Link>
          </div>
          {/* Visual placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[#E8EDF4] aspect-square max-h-[420px] bg-gradient-to-br from-[#1A2B4A] to-[#243B66] flex items-center justify-center relative">
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
          {values.map((vp) => (
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
          {members.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl border border-[#E8EDF4] hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200"
            >
              {/* Avatar placeholder */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#477BDB]/20 to-[#6477C8]/20 flex items-center justify-center mb-4 border border-[#E8EDF4]">
                <Users size={22} className="text-[#477BDB]" />
              </div>
              <h3 className="font-semibold text-[#0F1C31] mb-0.5">{member.name}</h3>
              <p className="text-[#477BDB] text-sm mb-3">{member.role}</p>
              <p className="text-[#6B7E95] text-sm leading-relaxed">{member.bio}</p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#6B7E95] hover:text-[#477BDB] transition-colors"
                >
                  LinkedIn
                  <ArrowRight size={11} />
                </a>
              )}
            </div>
          ))}

          {/* Placeholder card */}
          <div className="p-6 rounded-2xl border border-dashed border-[#E8EDF4] flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mb-3">
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
          <p className="text-white/30 text-sm">Market focus: India first, with delivery designed to support international clients.</p>
        </div>
      </Section>
    </>
  );
}
