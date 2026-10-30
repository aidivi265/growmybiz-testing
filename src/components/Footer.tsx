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

  const rawSocial = config.social || defaultSiteConfig.social || {};
  const visibility = (config as any).socialVisibility || (rawSocial as any)?._visibility || {};

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: rawSocial.linkedin || 'https://linkedin.com/company/growmybiz24',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
      key: 'linkedin',
    },
    {
      label: 'Instagram',
      href: rawSocial.instagram || 'https://instagram.com/growmybiz24',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      key: 'instagram',
    },
    {
      label: 'X (Twitter)',
      href: rawSocial.twitter || 'https://x.com/growmybiz24',
      icon: (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      key: 'twitter',
    },
    {
      label: 'YouTube',
      href: rawSocial.youtube || 'https://youtube.com/@growmybiz24',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      key: 'youtube',
    },
  ].filter((s) => {
    const isExplicitlyHidden = visibility[s.key] === false;
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
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#8BA5C8] hover:text-white hover:border-[#477BDB]/60 hover:bg-[#477BDB]/20 transition-all">
                      {s.icon}
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
