import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig, services } from '@/data';

const CURRENT_YEAR = 2025;

export default function Footer() {
  const socialLinks: { label: string; abbr: string; href: string }[] = [
    { label: 'LinkedIn',  abbr: 'Li', href: siteConfig.social.linkedin  ?? '#' },
    { label: 'Instagram', abbr: 'IG', href: siteConfig.social.instagram ?? '#' },
    { label: 'Twitter/X', abbr: 'X',  href: siteConfig.social.twitter   ?? '#' },
    { label: 'YouTube',   abbr: 'YT', href: siteConfig.social.youtube   ?? '#' },
  ];

  return (
    <footer>
      {/* ── CTA Band ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 50%, #1E3354 100%)' }}>
        {/* dot pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[#32A88A] text-xs font-bold tracking-[0.18em] uppercase mb-3 flex items-center gap-2">
                <span className="w-5 h-px bg-[#32A88A]" />
                Ready to grow?
              </p>
              <h2
                style={{
                  fontFamily: "var(--syne), var(--font-syne), sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#fff',
                }}
              >
                Let&apos;s build something<br />
                <span style={{
                  background: 'linear-gradient(135deg, #477BDB, #32A88A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>worth growing.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-[0_6px_24px_rgba(71,123,219,0.5)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}>
                Start a Project
                <ArrowRight size={15} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="bg-[#0F1E36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">

            {/* Brand col */}
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}>
                  <span className="text-white font-black text-base">G</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#32A88A] border-2 border-[#0F1E36]" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">
                  {siteConfig.siteName}
                </span>
              </Link>
              <p className="text-[#8BA5C8] text-sm leading-relaxed mb-6 max-w-[260px]">
                {siteConfig.description}
              </p>
              {/* Contact micro-list */}
              <ul className="space-y-2.5">
                {[
                  { Icon: Mail,    val: siteConfig.email, href: `mailto:${siteConfig.email}` },
                  { Icon: Phone,   val: siteConfig.phone, href: `tel:${siteConfig.phone}` },
                  { Icon: MapPin,  val: siteConfig.address, href: undefined },
                ].map(({ Icon, val, href }) => (
                  <li key={val} className="flex items-start gap-2">
                    <Icon size={13} className="text-[#477BDB] mt-0.5 shrink-0" />
                    {href ? (
                      <a href={href} className="text-[#8BA5C8] text-xs hover:text-white transition-colors">{val}</a>
                    ) : (
                      <span className="text-[#8BA5C8] text-xs">{val}</span>
                    )}
                  </li>
                ))}
              </ul>
              {/* Social icons */}
              <div className="flex items-center gap-2 mt-5">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#8BA5C8] hover:text-white hover:border-[#477BDB]/60 hover:bg-[#477BDB]/20 transition-all text-[10px] font-bold">
                    {s.abbr}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`}
                      className="text-[#8BA5C8] text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-[#477BDB]/40 group-hover:bg-[#477BDB] transition-colors flex-shrink-0" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Us',  href: '/about' },
                  { label: 'Portfolio', href: '/portfolio' },
                  { label: 'Process',   href: '/process' },
                  { label: 'Insights',  href: '/insights' },
                  { label: 'Contact',   href: '/contact' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-[#8BA5C8] text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2 mb-6">
                {[
                  { label: 'Privacy Policy',   href: '/legal/privacy-policy' },
                  { label: 'Terms of Service', href: '/legal/terms-of-service' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#8BA5C8] text-sm hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
              {/* Tagline pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#32A88A]/30 bg-[#32A88A]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A]" />
                <span className="text-[#32A88A] text-xs font-medium">{siteConfig.tagline}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[#5A7090] text-xs">
              © {CURRENT_YEAR} {siteConfig.siteName}. All rights reserved.
            </p>
            <p className="text-[#5A7090] text-xs">
              India · Worldwide delivery
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
