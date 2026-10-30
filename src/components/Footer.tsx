'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '@/data/siteConfig';
import { services as defaultServices } from '@/data/services';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallButton from '@/components/ScheduleCallButton';
import BrandLogo from '@/components/BrandLogo';
import { getClientSettings } from '@/lib/settingsClient';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const [config, setConfig] = useState(defaultSiteConfig);
  const [cta, setCta] = useState({
    heading: "Let's build something worth growing.",
    subheading: 'Ready to grow?',
    primary_cta_label: 'Start a Project',
    primary_cta_href: '/contact',
  });
  const [servicesList, setServicesList] = useState<{ id: string; title: string; slug: string }[]>(
    defaultServices.map((s) => ({ id: s.id, title: s.title, slug: s.slug }))
  );
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>({
    about: true,
    services: true,
    portfolio: true,
    process: true,
    insights: true,
    contact: true,
  });

  useEffect(() => {
    getClientSettings().then((data) => {
      if (data?.settings) {
        setConfig(data.settings);
      }
      if (data?.ctaContent) {
        setCta(data.ctaContent);
      }
      if (data?.services && data.services.length > 0) {
        setServicesList(data.services);
      }
      if (data?.pageVisibility) {
        setPageVisibility(data.pageVisibility);
      }
    });
  }, []);

  const rawSocial = config.social || {};
  const visibility = (config as any).socialVisibility || {};

  const socialLinks: { label: string; abbr: string; href: string }[] = [
    { label: 'LinkedIn',  abbr: 'Li', href: rawSocial.linkedin || '' },
    { label: 'Instagram', abbr: 'IG', href: rawSocial.instagram || '' },
    { label: 'Twitter/X', abbr: 'X',  href: rawSocial.twitter || '' },
    { label: 'YouTube',   abbr: 'YT', href: rawSocial.youtube || '' },
    { label: 'GitHub',    abbr: 'GH', href: rawSocial.github || '' },
  ].filter((s) => {
    const key = s.label.toLowerCase().replace(/[^a-z]/g, '') as string;
    const isExplicitlyHidden = visibility[key] === false || (key === 'twitterx' && visibility.twitter === false);
    return !isExplicitlyHidden && Boolean(s.href && s.href.trim().length > 0);
  });

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
                {cta.subheading || 'Ready to grow?'}
              </p>
              <h2
                style={{
                  fontFamily: SYNE_FONT,
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#fff',
                }}
              >
                {cta.heading || "Let's build something worth growing."}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={cta.primary_cta_href || '/contact'} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-[0_6px_24px_rgba(71,123,219,0.5)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}>
                {cta.primary_cta_label || 'Start a Project'}
                <ArrowRight size={15} />
              </Link>
              <ScheduleCallButton />
              <a
                href={config.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white/90 border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 hover:text-white transition-all"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                WhatsApp Us
              </a>
              <Link href="/services" prefetch={false} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="bg-[#0F1E36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Brand col */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-5 xl:col-span-4 pr-0 lg:pr-6">
              <div className="mb-5">
                <BrandLogo theme="dark" size="md" showTagline={false} asLink={true} />
              </div>
              <p className="text-[#8BA5C8] text-sm leading-relaxed mb-6 max-w-sm">
                {config.description}
              </p>
              {/* Contact micro-list */}
              <ul className="space-y-2.5">
                {[
                  { Icon: Mail,    val: config.email, href: `mailto:${config.email}` },
                  { Icon: Phone,   val: config.phone, href: `tel:${config.phone}` },
                  { Icon: MapPin,  val: config.address, href: undefined },
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
              {/* Social icons (only rendered if at least 1 social link is visible and not empty) */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 mt-5">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#8BA5C8] hover:text-white hover:border-[#477BDB]/60 hover:bg-[#477BDB]/20 transition-all text-[10px] font-bold">
                      {s.abbr}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            {pageVisibility.services !== false && (
              <div className="col-span-1 sm:col-span-1 lg:col-span-3">
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Services</h4>
                <ul className="space-y-2">
                  {servicesList.map((s) => (
                    <li key={s.id}>
                      <Link href={`/services/${s.slug}`} prefetch={false}
                        className="text-[#8BA5C8] text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-[#477BDB]/40 group-hover:bg-[#477BDB] transition-colors flex-shrink-0" />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Us',  href: '/about',     key: 'about' },
                  { label: 'Portfolio', href: '/portfolio', key: 'portfolio' },
                  { label: 'Process',   href: '/process',   key: 'process' },
                  { label: 'Insights',  href: '/insights',  key: 'insights' },
                  { label: 'Contact',   href: '/contact',   key: 'contact' },
                ]
                  .filter((l) => (pageVisibility as any)[l.key] !== false)
                  .map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} prefetch={false}
                        className="text-[#8BA5C8] text-sm hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy',   href: '/legal/privacy-policy' },
                  { label: 'Terms of Service', href: '/legal/terms-of-service' },
                  { label: 'Cookie Policy',    href: '/legal/cookie-policy' },
                  { label: 'Refund Policy',    href: '/legal/refund-policy' },
                  { label: 'Disclaimer',       href: '/legal/disclaimer' },
                  { label: 'Accessibility',    href: '/legal/accessibility' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} prefetch={false}
                      className="text-[#8BA5C8] text-xs hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Sub-footer ── */}
        <div className="border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8BA5C8]">
              <p>&copy; {CURRENT_YEAR} {config.siteName}. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/legal/privacy-policy" prefetch={false} className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/legal/terms-of-service" prefetch={false} className="hover:text-white transition-colors">Terms</Link>
                <Link href="/sitemap.xml" prefetch={false} className="hover:text-white transition-colors">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
