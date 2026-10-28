'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { heroSlides, services } from '@/data';

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
      setSlide(s => {
        const next = (s + 1) % heroSlides.length;
        setFading(true);
        setTimeout(() => setFading(false), 300);
        return next;
      });
    }, 6500);
  }, []);

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [resetTimer]);

  const cur = heroSlides[slide];

  return (
    <section className="relative bg-white overflow-hidden" style={{ minHeight: '100svh', paddingTop: '64px' }}>

      {/* ── Background: right half only ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Right half texture */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%]"
          style={{
            background: 'linear-gradient(135deg, #F7F9FC 0%, #EEF2F9 100%)',
            backgroundImage: 'linear-gradient(rgba(71,123,219,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(71,123,219,0.04) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        {/* Soft left-to-right edge fade */}
        <div className="absolute inset-y-0 right-0 w-[55%]"
          style={{ background: 'linear-gradient(90deg, white 0%, transparent 18%)' }} />
        {/* Ambient glows */}
        <div className="absolute right-[15%] top-[18%] w-[380px] h-[380px] rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(71,123,219,0.12) 0%, transparent 70%)' }} />
        <div className="absolute right-[4%] bottom-[12%] w-[260px] h-[260px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(50,168,138,0.09) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-0" style={{ minHeight: 'calc(100svh - 64px)' }}>

          {/* ── LEFT ── */}
          <div className="flex-1 flex flex-col justify-center pt-12 pb-10 lg:py-0 lg:pr-14 max-w-[600px]">

            {/* Slide badge */}
            <div className={`mb-7 transition-all duration-300 ${fading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span className="pill pill-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] pulse-dot" />
                {cur.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`mb-6 transition-all duration-300 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2.8rem, 5.8vw, 4.5rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: '#0F1C31',
              }}
            >
              {cur.heading.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 0 ? line : (
                    <span style={{
                      background: 'linear-gradient(120deg, #477BDB 0%, #5C6FCC 50%, #32A88A 100%)',
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
              style={{ color: '#3D4F63', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '460px' }}
            >
              {cur.subheading}
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap items-center gap-3 mb-10 transition-all duration-300 delay-100 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <Link href={cur.ctaPrimary.href} className="btn btn-primary btn-lg">
                {cur.ctaPrimary.label}
                <ArrowRight size={16} />
              </Link>
              <Link href={cur.ctaSecondary.href} className="btn btn-outline btn-lg">
                {cur.ctaSecondary.label}
              </Link>
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
                      background: i === slide ? '#477BDB' : '#DDE3EC',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#A4B3C4',
                letterSpacing: '0.1em',
              }}>
                {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── RIGHT — editorial card panel ── */}
          <div className="hidden lg:flex flex-col justify-center w-[420px] xl:w-[468px] shrink-0 py-12">
            <div className="relative">

              {/* Main dark card */}
              <div
                className="relative rounded-[24px] overflow-hidden"
                style={{
                  background: 'linear-gradient(155deg, #0F1C31 0%, #162540 55%, #1E3060 100%)',
                  boxShadow: '0 32px 80px rgba(15,28,49,0.20), 0 8px 24px rgba(71,123,219,0.14)',
                }}
              >
                {/* Fine grid inside */}
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }} />
                {/* Blue glow spot */}
                <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] rounded-full blur-[70px] opacity-25"
                  style={{ background: '#477BDB' }} />

                <div className="relative z-10 p-7">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#477BDB,#5C6FCC)', boxShadow: '0 4px 12px rgba(71,123,219,0.45)' }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff' }}>G</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-none">Growmybizz</p>
                        <p className="text-white/35 text-[10px] mt-0.5">Digital Growth Partner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold"
                      style={{ background: 'rgba(50,168,138,0.15)', color: '#32A88A', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(50,168,138,0.25)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A] pulse-dot" />
                      Available
                    </div>
                  </div>

                  {/* Service rows — each slightly different padding */}
                  <div className="space-y-2 mb-7">
                    {services.slice(0, 5).map((svc, si) => (
                      <div key={svc.id}
                        className="flex items-center gap-3 rounded-xl transition-all duration-150"
                        style={{
                          background: si === 0 ? 'rgba(71,123,219,0.12)' : 'rgba(255,255,255,0.04)',
                          border: si === 0 ? '1px solid rgba(71,123,219,0.20)' : '1px solid rgba(255,255,255,0.07)',
                          padding: `${10 + si * 0}px 14px`,
                        }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: svcColors[si] }} />
                        <span className="text-white/70 text-[13px] font-medium flex-1 leading-none">{svc.title}</span>
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
                    <span className="text-white/25 text-[11px]">Ready when you are</span>
                    <Link href="/contact"
                      className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2"
                      style={{ background: 'linear-gradient(135deg,#477BDB,#5C6FCC)', color: '#fff' }}>
                      Start a project <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Float badge — left */}
              <div className="absolute -left-10 top-[22%] float">
                <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
                  style={{ boxShadow: '0 8px 28px rgba(15,28,49,0.14)', border: '1px solid #DDE3EC' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EBF1FB' }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.875rem', color: '#477BDB' }}>6</span>
                  </div>
                  <div>
                    <p className="text-[#0F1C31] font-bold text-xs leading-tight">Disciplines</p>
                    <p className="text-[#6B7E95] text-[10px]">one team</p>
                  </div>
                </div>
              </div>

              {/* Float badge — right */}
              <div className="absolute -right-8 bottom-[28%] float-2">
                <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
                  style={{ boxShadow: '0 8px 28px rgba(15,28,49,0.14)', border: '1px solid #DDE3EC' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E6F5F1' }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.875rem', color: '#32A88A' }}>30+</span>
                  </div>
                  <div>
                    <p className="text-[#0F1C31] font-bold text-xs leading-tight">Services</p>
                    <p className="text-[#6B7E95] text-[10px]">offered</p>
                  </div>
                </div>
              </div>

              {/* Float dot — top right */}
              <div className="absolute -right-4 top-[-12px] float-3">
                <div className="bg-white rounded-xl px-3 py-1.5 flex items-center gap-2"
                  style={{ boxShadow: '0 4px 16px rgba(15,28,49,0.10)', border: '1px solid #DDE3EC' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#32A88A]" />
                  <span className="text-[#0F1C31] font-semibold text-[11px]">India + Global</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 inset-x-0 rule-fade" />
    </section>
  );
}
