'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BarChart3, Code2, Palette } from 'lucide-react';
import { heroSlides } from '@/data';

// Floating stat chips shown in the hero visual
const CHIPS = [
  { icon: Code2,     label: 'Web & Apps',   color: '#477BDB', bg: '#EBF1FB' },
  { icon: Palette,   label: 'Design',       color: '#6477C8', bg: '#EEF0FA' },
  { icon: BarChart3, label: 'Marketing',    color: '#32A88A', bg: '#E6F5F1' },
  { icon: Sparkles,  label: 'AI & Automation', color: '#477BDB', bg: '#EBF1FB' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 280);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden bg-white pt-16" aria-label="Hero">

      {/* ── Background decoration ── */}
      <div className="absolute inset-0 dot-pattern opacity-60" />
      {/* Right-side gradient blob */}
      <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle at 60% 40%, #477BDB, #6477C8, transparent 65%)' }} />
        <div className="absolute right-[-5%] bottom-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #32A88A, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-64px)] flex items-center py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

            {/* ── Left: Copy ── */}
            <div>
              {/* Eyebrow pill */}
              <div className={`transition-all duration-300 ${fading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {slide.badge && (
                  <span className="pill-blue mb-5 inline-flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] animate-pulse" />
                    {slide.badge}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1
                className={`text-[2.75rem] sm:text-5xl lg:text-6xl font-extrabold text-[#243247] leading-[1.06] tracking-[-0.035em] mb-6 transition-all duration-300 delay-75 ${
                  fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {slide.heading.split('\n').map((line, i) => (
                  <span key={i}>
                    {i === 0 ? line : (
                      <span className="text-gradient-hero" style={{
                        background: 'linear-gradient(135deg,#477BDB 0%,#6477C8 50%,#32A88A 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>{line}</span>
                    )}
                    {i < slide.heading.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h1>

              {/* Subheading */}
              <p className={`text-[#4A5568] text-lg leading-relaxed max-w-lg mb-9 transition-all duration-300 delay-100 ${
                fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
                {slide.subheading}
              </p>

              {/* CTAs */}
              <div className={`flex flex-wrap items-center gap-3 mb-10 transition-all duration-300 delay-150 ${
                fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
                <Link href={slide.ctaPrimary.href} className="btn-primary text-[0.9375rem]">
                  {slide.ctaPrimary.label}
                  <ArrowRight size={16} />
                </Link>
                <Link href={slide.ctaSecondary.href} className="btn-secondary text-[0.9375rem]">
                  {slide.ctaSecondary.label}
                </Link>
              </div>

              {/* Slide dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-[#477BDB] w-7' : 'bg-[#E2E8F0] w-3 hover:bg-[#CBD5E0]'
                    }`} />
                ))}
                <span className="ml-2 text-[#A0AEC0] text-xs">{current + 1} / {heroSlides.length}</span>
              </div>
            </div>

            {/* ── Right: Visual panel ── */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-[0_20px_70px_rgba(36,50,71,0.12)]"
                  style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 50%, #1E3A5F 100%)' }}>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '22px 22px',
                    }} />
                  {/* Center mark */}
                  <div className="relative z-10 aspect-[4/3.2] flex items-center justify-center p-10">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-[0_8px_30px_rgba(71,123,219,0.4)]"
                        style={{ background: 'linear-gradient(135deg,#477BDB,#6477C8)' }}>
                        <span className="text-white font-black text-3xl">G</span>
                      </div>
                      <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Growmybizz</p>
                      <p className="text-white/30 text-xs mt-1">Digital Growth Partner</p>
                    </div>
                  </div>
                </div>

                {/* Floating chips */}
                {CHIPS.map((chip, ci) => {
                  const ChipIcon = chip.icon;
                  const positions = [
                    'absolute -top-4 -left-4',
                    'absolute -top-4 -right-4',
                    'absolute -bottom-4 -left-4',
                    'absolute -bottom-4 -right-4',
                  ];
                  const delays = ['0s', '1.2s', '2.1s', '3s'];
                  return (
                    <div key={ci} className={`${positions[ci]} animate-float`} style={{ animationDelay: delays[ci] }}>
                      <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-[0_4px_20px_rgba(36,50,71,0.14)] border border-[#E2E8F0]">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: chip.bg }}>
                          <ChipIcon size={14} style={{ color: chip.color }} />
                        </div>
                        <span className="text-[#243247] font-semibold text-xs whitespace-nowrap">{chip.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom wave / divider ── */}
      <div className="relative h-12 bg-white">
        <div className="absolute bottom-0 inset-x-0 h-px divider-gradient" />
      </div>
    </section>
  );
}
