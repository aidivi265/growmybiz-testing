'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  LayoutDashboard,
  Code2,
  Palette,
  TrendingUp,
  Video,
  Cpu,
  Layers,
  Calculator,
  Search,
  Sparkles,
} from 'lucide-react';
import { navItems } from '@/data/navigation';
import BrandLogo from '@/components/BrandLogo';
import QuickInquiryModal from '@/components/QuickInquiryModal';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import type { NavItem } from '@/types';
import { getClientSettings } from '@/lib/settingsClient';

interface NavbarProps {
  initialVisibility?: any;
}

export default function Navbar({ initialVisibility }: NavbarProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(
    initialVisibility || {
      about: true,
      services: true,
      portfolio: true,
      process: true,
      insights: true,
      contact: true,
    }
  );
  const [activeServices, setActiveServices] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    getClientSettings().then((data) => {
      if (data?.pageVisibility) {
        setPageVisibility(data.pageVisibility);
      }
      if (data?.services && Array.isArray(data.services)) {
        setActiveServices(data.services);
      }
    });
  }, []);

  const displayedNavItems: NavItem[] = navItems
    .filter((item) => {
      if (item.href === '/services' && pageVisibility.services === false) return false;
      if (item.href === '/portfolio' && pageVisibility.portfolio === false) return false;
      if (item.href === '/about' && pageVisibility.about === false) return false;
      if (item.href === '/process' && pageVisibility.process === false) return false;
      if (item.href === '/insights' && pageVisibility.insights === false) return false;
      if (item.href === '/contact' && pageVisibility.contact === false) return false;
      return true;
    })
    .map((item) => {
      if (item.href === '/services' && activeServices.length > 0) {
        return {
          ...item,
          children: activeServices.map((s) => ({
            label: s.title,
            href: `/services/${s.slug}`,
          })),
        };
      }
      return item;
    });

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 16;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMobileOpen(false);
      setActiveDropdown(null);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-md shadow-[0_2px_24px_rgba(15,28,49,0.09)] border-b border-[#E8EDF4]'
            : 'bg-white/90 backdrop-blur-md border-b border-[#E8EDF4]/60'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3">

            {/* ── Official Brand Logo ── */}
            <div className="shrink-0 flex items-center">
              <BrandLogo theme="dark" size="md" asLink={true} />
            </div>

            {/* ── Desktop Navigation ── */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {displayedNavItems.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Currency Switcher */}
              <CurrencySwitcher
                variant="compact"
                theme="light"
                showAutoBadge={true}
                className="hidden sm:inline-block shrink-0"
              />

              {/* Client Portal Link */}
              <Link
                href="/portal"
                className="h-9 px-3 hidden md:inline-flex items-center gap-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <LayoutDashboard size={13} className="text-cyan-400" />
                <span>Client Portal</span>
              </Link>

              {/* Start a Project (Primary CTA) */}
              <Link
                href="/start-project"
                className="h-9 px-3.5 sm:px-4 inline-flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] whitespace-nowrap shrink-0"
              >
                <span>Start a Project</span>
                <ArrowRight size={14} />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors shrink-0"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* ── Mobile Overlay & Drawer ── */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0F1C31]/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-[#0B1325] border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 bg-[#070D19]">
            <BrandLogo theme="dark" size="sm" asLink={false} />
            <button
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {/* Interactive Tools Highlight */}
            <div className="mb-3.5 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 pt-0.5">
                Interactive Studio Tools
              </div>
              <Link
                href="/estimator"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 shadow-2xs hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Calculator size={15} className="text-blue-600" />
                  <span>Cost &amp; Scope Estimator</span>
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
              <Link
                href="/audit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 shadow-2xs hover:bg-emerald-50/50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Search size={15} className="text-emerald-600" />
                  <span>Free Website &amp; SEO Audit</span>
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
            </div>

            {/* Main Links */}
            {displayedNavItems.map((item) => (
              <div key={item.href} className="mb-0.5">
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.href ? null : item.href)
                      }
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-cyan-400 bg-cyan-950/40'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-[#64748B] ${
                          mobileExpanded === item.href ? 'rotate-180 text-[#2563EB]' : ''
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.href && (
                      <div className="ml-3 pl-3 border-l-2 border-[#EFF6FF] mt-1 mb-2 space-y-0.5">
                        {item.children.map((child) => {
                          const slug = child.href.replace('/services/', '').replace('/', '');
                          const meta = SERVICE_META[slug] || DEFAULT_SERVICE_META;
                          const IconComp = meta.icon;
                          const isChildActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isChildActive
                                  ? 'text-[#2563EB] font-semibold bg-blue-50/60'
                                  : 'text-[#475569] hover:text-[#0F1C31]'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${meta.iconBg} ${meta.iconColor} shrink-0`}>
                                <IconComp size={12} />
                              </div>
                              <span className="truncate">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#2563EB] bg-[#EFF6FF]'
                        : 'text-[#334155] hover:text-[#0F1C31] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Currency Switcher */}
          <div className="px-4 py-3 border-t border-white/10 bg-[#070D19]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center justify-between">
              <span>Currency</span>
              <span className="text-[#2563EB]">Auto IP &amp; Manual</span>
            </div>
            <CurrencySwitcher variant="pills" theme="light" className="w-full justify-between" />
          </div>

          {/* Drawer Footer CTA */}
          <div className="p-4 border-t border-[#E8EDF4] space-y-2">
            <Link
              href="/start-project"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all shadow-md"
              style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}
            >
              Start a Project
              <ArrowRight size={14} />
            </Link>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/portal"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#0F1C31] bg-[#F8FAFC] border border-[#E8EDF4] hover:bg-[#F1F5F9]"
              >
                <LayoutDashboard size={13} className="text-[#2563EB]" />
                Client Portal
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setInquiryModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE]"
              >
                <MessageSquare size={13} />
                Quick Inquire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Inquiry Modal */}
      <QuickInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
}

interface ServiceMetaItem {
  icon: React.ElementType;
  desc: string;
  iconBg: string;
  iconColor: string;
}

const SERVICE_META: Record<string, ServiceMetaItem> = {
  'web-app-development': {
    icon: Code2,
    desc: 'Modern web apps, SaaS & mobile platforms',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  'design-branding': {
    icon: Palette,
    desc: 'UI/UX systems, brand identity & Figma',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  'digital-marketing': {
    icon: TrendingUp,
    desc: 'SEO rankings, performance ads & funnels',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  'video-content': {
    icon: Video,
    desc: 'Motion graphics, 3D renders & brand films',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  'ai-automation': {
    icon: Cpu,
    desc: 'Custom LLM agents, bots & automated ops',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  'other-digital-services': {
    icon: Layers,
    desc: 'Cloud setup, custom APIs & retainers',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
  },
};

const DEFAULT_SERVICE_META: ServiceMetaItem = {
  icon: Sparkles,
  desc: 'Specialized digital agency capabilities',
  iconBg: 'bg-blue-50',
  iconColor: 'text-blue-600',
};

function NavItemComponent({
  item,
  isActive,
  activeDropdown,
  setActiveDropdown,
}: {
  item: NavItem;
  isActive: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (v: string | null) => void;
}) {
  const isOpen = activeDropdown === item.href;

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`relative px-3 py-2 rounded-xl text-[13.5px] font-medium whitespace-nowrap transition-colors ${
          isActive
            ? 'text-[#2563EB] font-semibold'
            : 'text-[#334155] hover:text-[#0F1C31] hover:bg-[#F8FAFC]'
        }`}
      >
        {isActive && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
        )}
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown(item.href)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[13.5px] font-medium whitespace-nowrap transition-colors ${
          isActive
            ? 'text-[#2563EB] font-semibold'
            : 'text-[#334155] hover:text-[#0F1C31] hover:bg-[#F8FAFC]'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{item.label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 text-[#64748B] ${
            isOpen ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {/* Mega Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[560px] max-w-[92vw] z-50 animate-fadeIn">
          {/* Invisible bridge to prevent mouse leaving gap */}
          <div className="absolute -top-2.5 inset-x-0 h-3" />

          <div className="bg-[#0B1325]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Header bar */}
            <div className="px-4.5 pt-3.5 pb-2 flex items-center justify-between border-b border-white/[0.08]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Studio Capabilities
              </span>
              <Link
                href="/services"
                prefetch={false}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>All 6 Services</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 2-Column Grid of Services */}
            <div className="p-2 grid grid-cols-2 gap-1">
              {item.children!.map((child) => {
                const slug = child.href.replace('/services/', '').replace('/', '');
                const meta = SERVICE_META[slug] || DEFAULT_SERVICE_META;
                const IconComp = meta.icon;

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    prefetch={false}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group text-left"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.iconBg} ${meta.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      <IconComp size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {child.label}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                        {meta.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Agency Tools Rail */}
            <div className="border-t border-white/[0.08] bg-black/40 px-4 py-2.5 flex items-center justify-between">
              <Link
                href="/estimator"
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center">
                  <Calculator size={13} />
                </div>
                <span>Scope &amp; Cost Estimator</span>
                <span className="text-[11px] text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>

              <span className="w-1 h-1 rounded-full bg-slate-300" />

              <Link
                href="/audit"
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                  <Search size={13} />
                </div>
                <span>Free Website &amp; SEO Audit</span>
                <span className="text-[11px] text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
