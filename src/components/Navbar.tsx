'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { navItems, siteConfig } from '@/data';
import type { NavItem } from '@/types';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(36,50,71,0.10)] border-b border-[#E2E8F0]'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="GrowMyBizz home">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(71,123,219,0.35)]"
                style={{ background: 'linear-gradient(135deg, #477BDB 0%, #6477C8 100%)' }}>
                <span className="text-white font-black text-base leading-none tracking-tight">G</span>
                {/* dot accent */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#32A88A] border-2 border-white" />
              </div>
              <div className="leading-none">
                <span className="text-[#243247] font-bold text-[1.05rem] tracking-tight">
                  {siteConfig.siteName.charAt(0).toUpperCase() + siteConfig.siteName.slice(1).toLowerCase()}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(71,123,219,0.4)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #477BDB 0%, #6477C8 100%)' }}
              >
                Start a Project
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#4A5568] hover:text-[#243247] hover:border-[#CBD5E0] hover:bg-[#F8FAFC] transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-[#243247]/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}>
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="text-[#243247] font-bold text-sm">{siteConfig.siteName}</span>
            </div>
            <button onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#718096] hover:text-[#243247] hover:bg-[#F8FAFC]">
              <X size={18} />
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {navItems.map((item) => (
              <div key={item.href} className="mb-0.5">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-[#477BDB] bg-[#EBF1FB]'
                          : 'text-[#4A5568] hover:text-[#243247] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={15} className={`transition-transform duration-200 text-[#A0AEC0] ${
                        mobileExpanded === item.href ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {mobileExpanded === item.href && (
                      <div className="ml-3 pl-3 border-l-2 border-[#EBF1FB] mt-1 mb-2 space-y-0.5">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? 'text-[#477BDB] font-medium'
                                : 'text-[#718096] hover:text-[#243247]'
                            }`}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#477BDB] bg-[#EBF1FB]'
                        : 'text-[#4A5568] hover:text-[#243247] hover:bg-[#F8FAFC]'
                    }`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Drawer footer CTA */}
          <div className="p-4 border-t border-[#E2E8F0]">
            <Link href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}>
              Start a Project
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function NavItemComponent({
  item, isActive, activeDropdown, setActiveDropdown,
}: {
  item: NavItem;
  isActive: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (v: string | null) => void;
}) {
  const isOpen = activeDropdown === item.href;

  if (!item.children) {
    return (
      <Link href={item.href}
        className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'text-[#477BDB]'
            : 'text-[#4A5568] hover:text-[#243247] hover:bg-[#F8FAFC]'
        }`}>
        {isActive && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#477BDB]" />
        )}
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative"
      onMouseEnter={() => setActiveDropdown(item.href)}
      onMouseLeave={() => setActiveDropdown(null)}>
      <button
        className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'text-[#477BDB]' : 'text-[#4A5568] hover:text-[#243247] hover:bg-[#F8FAFC]'
        }`}
        aria-expanded={isOpen} aria-haspopup="true">
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-200 text-[#A0AEC0] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-60 z-50">
          {/* Invisible bridge to prevent gap hover */}
          <div className="absolute -top-2 inset-x-0 h-2" />
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_32px_rgba(36,50,71,0.14)] overflow-hidden">
            {/* Blue top accent bar */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#477BDB,#6477C8,#32A88A)' }} />
            <div className="py-2">
              {item.children!.map((child) => (
                <Link key={child.href} href={child.href}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#4A5568] hover:text-[#477BDB] hover:bg-[#F8FAFC] transition-colors group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0] group-hover:bg-[#477BDB] transition-colors flex-shrink-0" />
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
