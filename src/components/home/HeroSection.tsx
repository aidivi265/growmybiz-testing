'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/hero';
import { services } from '@/data/services';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallButton from '@/components/ScheduleCallButton';

const svcColors = ['#477BDB', '#32A88A', '#6477C8', '#E8912A', '#0EA5C8', '#B04EC4'];

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback((to: number) => {
    setFading(true);
    setTimeout(() => { setSlide(to); setFading(false); }, 300);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (document.hidden) return;
      setSlide(s => {
        const next = (s + 1) % heroSlides.length;
        setFading(true);
        setTimeout(() => setFading(false), 300);
        return next;
      });
    }, 6500);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const cur = heroSlides[slide];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100svh',
        paddingTop: '64px',
        background: 'linear-gradient(145deg, #080F1C 0%, #0F1C31 40%, #14243E 70%, #0D1A30 100%)',
      }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        {/* Blue glow — top left */}
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(71,123,219,0.14) 0%, transparent 65%)', filter: 'blur(2px)' }}
        />
        {/* Teal glow — bottom right */}
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(50,168,138,0.09) 0%, transparent 65%)', filter: 'blur(2px)' }}
        />
        {/* Indigo accent — center right */}
        <div
          className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(100,119,200,0.10) 0%, transparent 65%)', filter: 'blur(1px)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-0" style={{ minHeight: 'calc(100svh - 64px)' }}>

          {/* ── LEFT ── */}
          <div className="flex-1 flex flex-col justify-center pt-12 pb-10 lg:py-0 lg:pr-14 max-w-[600px]">

            {/* Slide badge */}
            <div className={`mb-7 transition-all duration-300 ${fading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest rounded-full px-4 py-1.5"
                style={{
                  background: 'rgba(71,123,219,0.12)',
                  border: '1px solid rgba(71,123,219,0.25)',
                  color: '#92AEED',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] pulse-dot" />
                {cur.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`mb-6 transition-all duration-300 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
              }}
            >
              {cur.heading.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 0 ? (
                    <span style={{ color: '#FFFFFF' }}>{line}</span>
                  ) : (
                    <span style={{
                      background: 'linear-gradient(120deg, #6AADFF 0%, #8B9EEF 45%, #52D9B8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {line}
                    </span>
                  )}
                </span>
              ))}
            </h1>

            {/* Sub */}
            <p
              className={`mb-9 transition-all duration-300 delay-75 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '460px' }}
            >
              {cur.subheading}
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap items-center gap-3 mb-10 transition-all duration-300 delay-100 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <Link
                href={cur.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[0.9375rem] text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #477BDB 0%, #5C6FCC 100%)',
                  boxShadow: '0 6px 24px rgba(71,123,219,0.40)',
                }}
              >
                {cur.ctaPrimary.label}
                <ArrowRight size={16} />
              </Link>
              <ScheduleCallButton />
              <Link
                href={cur.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[0.9375rem] transition-all duration-200 hover:bg-white/[0.08]"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.80)',
                }}
              >
                {cur.ctaSecondary.label}
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {[
                { val: '6', label: 'service disciplines' },
                { val: '30+', label: 'services offered' },
                { val: 'India', label: '+ global delivery' },
              ].map((stat) => (
                <div key={stat.val} className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: SYNE_FONT,
                      fontWeight: 800,
                      fontSize: '1.0625rem',
                      color: '#fff',
                    }}
                  >{stat.val}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{stat.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.12)', marginLeft: '4px' }}>·</span>
                </div>
              ))}
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { advance(i); resetTimer(); }}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      height: '3px',
                      borderRadius: '2px',
                      width: i === slide ? '32px' : '10px',
                      background: i === slide ? '#477BDB' : 'rgba(255,255,255,0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
              <span style={{
                fontFamily: SYNE_FONT,
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.1em',
              }}>
                {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── RIGHT — service card ── */}
          <div className="hidden lg:flex flex-col justify-center w-[420px] xl:w-[460px] shrink-0 py-12">
            <div className="relative">

              {/* Main dark card */}
              <div
                className="relative rounded-[24px] overflow-hidden"
                style={{
                  background: 'linear-gradient(155deg, rgba(15,28,49,0.85) 0%, rgba(20,36,62,0.75) 100%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Inner grid */}
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.035,
                  }} />
                {/* Blue glow spot */}
                <div className="absolute top-[35%] left-[35%] w-[220px] h-[220px] rounded-full blur-[70px] opacity-20"
                  style={{ background: '#477BDB' }} />

                <div className="relative z-10 p-7">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#477BDB,#5C6FCC)', boxShadow: '0 4px 12px rgba(71,123,219,0.50)' }}>
                        <span style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: '1rem', color: '#fff' }}>G</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-none">Growmybizz</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '3px' }}>Digital Growth Partner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold"
                      style={{ background: 'rgba(50,168,138,0.15)', color: '#4DD8B0', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(50,168,138,0.30)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A] pulse-dot" />
                      Available
                    </div>
                  </div>

                  {/* Service rows */}
                  <div className="space-y-2 mb-7">
                    {services.slice(0, 5).map((svc, si) => (
                      <div key={svc.id}
                        className="flex items-center gap-3 rounded-xl transition-all duration-150"
                        style={{
                          background: si === 0 ? 'rgba(71,123,219,0.15)' : 'rgba(255,255,255,0.045)',
                          border: si === 0 ? '1px solid rgba(71,123,219,0.28)' : '1px solid rgba(255,255,255,0.07)',
                          padding: '10px 14px',
                        }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: svcColors[si] }} />
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 500 }} className="flex-1 leading-none">{svc.title}</span>
                        {si === 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(71,123,219,0.25)', color: '#92AEED' }}>
                            Popular
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px' }}>Ready when you are</span>
                    <Link href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 hover:-translate-y-0.5 transition-transform"
                      style={{ background: 'linear-gradient(135deg,#477BDB,#5C6FCC)', color: '#fff', boxShadow: '0 4px 14px rgba(71,123,219,0.45)' }}>
                      Start a project <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Float badge — left */}
              <div className="absolute -left-10 top-[22%] float">
                <div
                  className="rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                    border: '1px solid rgba(255,255,255,0.9)',
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EBF1FB' }}>
                    <span style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: '0.875rem', color: '#477BDB' }}>6</span>
                  </div>
                  <div>
                    <p className="text-[#0F1C31] font-bold text-xs leading-tight">Disciplines</p>
                    <p className="text-[#6B7E95] text-[10px]">one team</p>
                  </div>
                </div>
              </div>

              {/* Float badge — right */}
              <div className="absolute -right-8 bottom-[28%] float-2">
                <div
                  className="rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                    border: '1px solid rgba(255,255,255,0.9)',
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E6F5F1' }}>
                    <span style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: '0.875rem', color: '#32A88A' }}>30+</span>
                  </div>
                  <div>
                    <p className="text-[#0F1C31] font-bold text-xs leading-tight">Services</p>
                    <p className="text-[#6B7E95] text-[10px]">offered</p>
                  </div>
                </div>
              </div>

              {/* Float tag — top right */}
              <div className="absolute -right-4 -top-3 float-3">
                <div
                  className="rounded-xl px-3 py-1.5 flex items-center gap-2"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.9)',
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A]" />
                  <span className="text-[#0F1C31] font-semibold text-[11px]">India + Global</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,15,28,0.5))' }}
      />
    </section>
  );
}
