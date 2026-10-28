'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/hero';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallButton from '@/components/ScheduleCallButton';
import InteractiveGrowthOrbit from './InteractiveGrowthOrbit';

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
        <div className="flex flex-col lg:flex-row lg:items-center gap-0 min-h-[calc(100svh-64px)] py-8 lg:py-0">

          {/* ── LEFT (Full width on mobile, 55% split on desktop) ── */}
          <div className="flex-1 flex flex-col justify-center w-full lg:max-w-[620px] pt-4 pb-8 sm:pt-8 sm:pb-10 lg:py-0 lg:pr-14">

            {/* Slide badge */}
            <div className={`mb-5 sm:mb-6 flex items-center gap-2.5 transition-all duration-300 ${fading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span className="w-2 h-2 rounded-full bg-[#477BDB] pulse-dot" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#7AA2FF]">
                {cur.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`mb-5 sm:mb-6 transition-all duration-300 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{
                fontFamily: SYNE_FONT,
                fontWeight: 800,
                fontSize: 'clamp(2.3rem, 5.2vw, 4.4rem)',
                lineHeight: 1.05,
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
              className={`mb-7 sm:mb-9 transition-all duration-300 delay-75 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', lineHeight: 1.7, maxWidth: '480px' }}
            >
              {cur.subheading}
            </p>

            {/* CTAs — Stack on small mobile, row on tablet/desktop */}
            <div className={`flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-8 sm:mb-10 transition-all duration-300 delay-100 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <Link
                href={cur.ctaPrimary.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[0.9375rem] text-white transition-all duration-200 hover:-translate-y-0.5"
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[0.9375rem] transition-all duration-200 hover:bg-white/[0.08]"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.80)',
                }}
              >
                {cur.ctaSecondary.label}
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
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
                      fontSize: '1rem',
                      color: '#fff',
                    }}
                  >{stat.val}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{stat.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: '2px' }}>·</span>
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
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.1em',
              }}>
                {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── RIGHT — Interactive 3D Growth Orbit (Active on Desktop/Laptop, Hidden on Mobile UI) ── */}
          <div className="hidden lg:flex flex-col justify-center items-end flex-1 shrink-0 py-8 lg:py-12 z-20">
            <InteractiveGrowthOrbit />
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
