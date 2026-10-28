'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { siteConfig } from '@/data/siteConfig';
import BrandLogo from '@/components/BrandLogo';
import type { NavItem } from '@/types';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

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

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setActiveDropdown(null);
  }

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
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Official Brand Logo ── */}
            <BrandLogo theme="light" size="md" asLink={true} />

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
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(71,123,219,0.40)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #477BDB 0%, #6477C8 100%)' }}
              >
                Start a Project
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#E8EDF4] text-[#3D4F63] hover:text-[#0F1C31] hover:border-[#C8D3E0] hover:bg-[#F7F9FC] transition-colors"
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
        <div className="absolute inset-0 bg-[#0F1C31]/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#E8EDF4]">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}
              >
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="text-[#0F1C31] font-bold text-sm">{siteConfig.siteName}</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7E95] hover:text-[#0F1C31] hover:bg-[#F7F9FC]"
            >
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
                          : 'text-[#3D4F63] hover:text-[#0F1C31] hover:bg-[#F7F9FC]'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-[#6B7E95] ${
                          mobileExpanded === item.href ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.href && (
                      <div className="ml-3 pl-3 border-l-2 border-[#EBF1FB] mt-1 mb-2 space-y-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? 'text-[#477BDB] font-medium'
                                : 'text-[#6B7E95] hover:text-[#0F1C31]'
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
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#477BDB] bg-[#EBF1FB]'
                        : 'text-[#3D4F63] hover:text-[#0F1C31] hover:bg-[#F7F9FC]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Drawer footer CTA */}
          <div className="p-4 border-t border-[#E8EDF4]">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #477BDB, #6477C8)' }}
            >
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
      <Link
        href={item.href}
        className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'text-[#477BDB]'
            : 'text-[#3D4F63] hover:text-[#0F1C31] hover:bg-[#F7F9FC]'
        }`}
      >
        {isActive && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#477BDB]" />
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
        className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'text-[#477BDB]' : 'text-[#3D4F63] hover:text-[#0F1C31] hover:bg-[#F7F9FC]'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 text-[#6B7E95] ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-60 z-50">
          {/* Invisible bridge to prevent gap hover */}
          <div className="absolute -top-2 inset-x-0 h-2" />
          <div className="bg-white rounded-2xl border border-[#E8EDF4] shadow-[0_8px_32px_rgba(15,28,49,0.12)] overflow-hidden">
            {/* Gradient top accent */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#477BDB,#6477C8,#32A88A)' }} />
            <div className="py-2">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  prefetch={false}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3D4F63] hover:text-[#477BDB] hover:bg-[#F7F9FC] transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DDE3EC] group-hover:bg-[#477BDB] transition-colors flex-shrink-0" />
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
