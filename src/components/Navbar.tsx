'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight, MessageSquare, LayoutDashboard } from 'lucide-react';
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

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
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
              <BrandLogo theme="light" size="md" asLink={true} />
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
                className="h-9 px-3 hidden md:inline-flex items-center gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                <LayoutDashboard size={13} className="text-slate-500" />
                <span>Client Portal</span>
              </Link>

              {/* Start a Project (Primary CTA) */}
              <Link
                href="/start-project"
                className="h-9 px-3.5 sm:px-4 inline-flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <span>Start a Project</span>
                <ArrowRight size={14} />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-[#CBD5E1]/70 text-[#1E293B] hover:text-[#0F1C31] hover:bg-[#F8FAFC] transition-colors shrink-0"
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
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#E8EDF4]">
            <BrandLogo theme="light" size="sm" asLink={false} />
            <button
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6B7E95] hover:text-[#0F1C31] hover:bg-[#F7F9FC]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {/* Interactive Tools Highlight */}
            <div className="mb-3 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 pt-0.5">
                Growth Tools
              </div>
              <Link
                href="/estimator"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0F1C31] bg-white border border-[#E2E8F0] shadow-2xs hover:bg-[#EFF6FF] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>⚡</span> Cost &amp; Scope Estimator
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                  CALC
                </span>
              </Link>
              <Link
                href="/audit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0F1C31] bg-white border border-[#E2E8F0] shadow-2xs hover:bg-[#ECFDF5] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>🔍</span> Free Website &amp; SEO Audit
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono">
                  FREE
                </span>
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
                          ? 'text-[#2563EB] bg-[#EFF6FF]'
                          : 'text-[#334155] hover:text-[#0F1C31] hover:bg-[#F8FAFC]'
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
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? 'text-[#2563EB] font-medium'
                                : 'text-[#64748B] hover:text-[#0F1C31]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
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
          <div className="px-4 py-3 border-t border-[#E8EDF4] bg-[#F8FAFC]">
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
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#2563EB]" />
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

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-fadeIn">
          {/* Invisible bridge to prevent mouse leaving gap */}
          <div className="absolute -top-2 inset-x-0 h-2" />
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_12px_40px_rgba(15,28,49,0.12)] overflow-hidden p-2">
            {/* Gradient Top Accent */}
            <div
              className="h-1 -mx-2 -mt-2 mb-2 w-[calc(100%+16px)]"
              style={{ background: 'linear-gradient(90deg, #2563EB, #6366F1, #10B981)' }}
            />

            <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2.5 py-1">
              Core Digital Services
            </div>
            <div className="space-y-0.5">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  prefetch={false}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#334155] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1] group-hover:bg-[#2563EB] transition-colors shrink-0" />
                  <span className="truncate">{child.label}</span>
                </Link>
              ))}
            </div>

            {/* Featured Interactive Tools Section */}
            <div className="mt-2 pt-2 border-t border-[#F1F5F9] bg-[#F8FAFC] rounded-xl p-2 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-1 mb-1">
                Interactive Growth Tools
              </div>
              <Link
                href="/estimator"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F1C31] hover:bg-white hover:shadow-xs transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  <div>
                    <div className="group-hover:text-[#2563EB] transition-colors leading-tight">
                      Cost &amp; Scope Estimator
                    </div>
                    <div className="text-[10px] font-normal text-[#64748B]">
                      Instant price &amp; timeline calculator
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                  CALC
                </span>
              </Link>
              <Link
                href="/audit"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F1C31] hover:bg-white hover:shadow-xs transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔍</span>
                  <div>
                    <div className="group-hover:text-[#2563EB] transition-colors leading-tight">
                      Free Website &amp; SEO Audit
                    </div>
                    <div className="text-[10px] font-normal text-[#64748B]">
                      Core Web Vitals &amp; tech score
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono">
                  FREE
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
