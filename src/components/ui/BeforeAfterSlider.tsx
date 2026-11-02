'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import type { BeforeAfterShowcase } from '@/data/beforeAfterShowcase';
import { defaultBeforeAfterShowcases } from '@/data/beforeAfterShowcase';
import ScheduleCallModal from '@/components/ScheduleCallModal';

const SERVICE_TABS = [
  { slug: 'web-app-development', label: 'Web & E-Commerce', icon: '💻' },
  { slug: 'ai-automation', label: 'AI & WhatsApp Bots', icon: '🤖' },
  { slug: 'design-branding', label: 'Design & Branding', icon: '🎨' },
  { slug: 'digital-marketing', label: 'SEO & Growth Ads', icon: '📈' },
  { slug: 'mobile-app', label: 'Mobile Apps', icon: '📱' },
  { slug: 'video-content', label: '3D Video & Motion', icon: '🎬' },
];

interface BeforeAfterSliderProps {
  initialItems?: BeforeAfterShowcase[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  id?: string;
}

export default function BeforeAfterSlider({
  initialItems,
  eyebrow = 'TRANSFORMATION PROOF',
  title = 'Real transformations. Measurable business outcomes.',
  subtitle = 'Drag the slider to see how outdated websites, sluggish apps, and stagnant ad funnels transform into high-velocity revenue engines.',
  className = '',
  id = 'before-after-showcase',
}: BeforeAfterSliderProps) {
  const items = initialItems && initialItems.length > 0 ? initialItems : defaultBeforeAfterShowcases;

  const [activeSlug, setActiveSlug] = useState<string>(items[0]?.serviceSlug || 'web-app-development');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Find item for current discipline or fallback to first
  const activeItem =
    items.find((item) => item.serviceSlug === activeSlug) ||
    items.find((item) => item.id === activeSlug) ||
    items[0];

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches[0]) {
        updatePosition(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  if (!activeItem) return null;

  return (
    <section id={id} className={`section-pad-lg relative overflow-hidden bg-[#0A0F1D] text-white ${className}`}>
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#477BDB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#477BDB]/15 to-[#10B981]/15 border border-[#477BDB]/30 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-200">
              {eyebrow}
            </span>
          </div>

          <h2
            style={{
              fontFamily: SYNE_FONT,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            }}
            className="text-white"
          >
            {title}
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Multi-Discipline Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar scroll-smooth">
          {SERVICE_TABS.map((tab) => {
            const isSelected = activeItem.serviceSlug === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => {
                  setActiveSlug(tab.slug);
                  setSliderPosition(50); // Reset slider to center when switching
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#477BDB] to-[#2563EB] text-white border-blue-400/50 shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Card & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Before & After Slider (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
                Drag handle left &amp; right to compare
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                Split: {Math.round(sliderPosition)}%
              </span>
            </div>

            {/* Split Drag Container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={(e) => updatePosition(e.clientX)}
              className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-800/80 select-none bg-slate-950 shadow-2xl cursor-ew-resize group"
              role="slider"
              tabIndex={0}
              aria-valuenow={Math.round(sliderPosition)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Before and after transformation comparison slider"
              onKeyDown={handleKeyDown}
            >
              {/* After Image (Base background layer) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.afterImage}
                alt={activeItem.afterLabel || 'After Growmybiz24 redesign'}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                style={{ width: `${sliderPosition}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeItem.beforeImage}
                  alt={activeItem.beforeLabel || 'Before redesign'}
                  className="absolute inset-0 max-w-none w-full h-full object-cover"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    height: '100%',
                  }}
                />
              </div>

              {/* Central Divider Bar & Circular Drag Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)] pointer-events-none z-20 transition-transform"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center font-bold text-sm border-2 border-[#477BDB] group-hover:scale-110 transition-transform">
                  <span className="flex items-center tracking-tighter">
                    <ChevronLeft className="w-3.5 h-3.5 -mr-1" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Floating Labels & Badges */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {activeItem.beforeLabel || 'BEFORE'}
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {activeItem.afterLabel || 'AFTER GROWMYBIZZ'}
                </div>
              </div>

              {/* Bottom summaries inside the slider */}
              <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none hidden sm:flex items-center justify-between text-[11px] text-white/80 font-mono">
                <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                  {activeItem.beforeSummary}
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 backdrop-blur-sm px-2.5 py-1 rounded border border-emerald-500/30 font-semibold">
                  {activeItem.afterSummary}
                </span>
              </div>
            </div>

            {/* Quick helper note */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Client: <strong className="text-white">{activeItem.clientName}</strong></span>
              <span>Industry: <strong className="text-white">{activeItem.industry}</strong></span>
            </div>
          </div>

          {/* Right Column: Case Outcome, Verified Metrics & CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                {activeItem.serviceName}
              </div>
              <h3
                style={{
                  fontFamily: SYNE_FONT,
                  fontWeight: 700,
                  fontSize: 'clamp(1.4rem, 2vw, 1.75rem)',
                  lineHeight: 1.25,
                }}
                className="text-white"
              >
                {activeItem.tagline}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            {/* 4 Quantifiable Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {activeItem.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="text-[11px] text-slate-400 font-medium truncate mb-1">
                    {metric.label}
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                    {metric.lift}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <span className="text-rose-400/80 line-through">{metric.before}</span>
                    <span>→</span>
                    <span className="text-white font-semibold">{metric.after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Deliverables */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                What We Delivered:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeItem.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            {activeItem.testimonial && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/20 to-slate-900/60 border border-blue-900/30 space-y-2">
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  &ldquo;{activeItem.testimonial.quote}&rdquo;
                </p>
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-white">{activeItem.testimonial.author}</span>
                  {' • '}
                  <span>{activeItem.testimonial.role}</span>, {activeItem.testimonial.company}
                </div>
              </div>
            )}

            {/* Conversion CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="flex-1 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#2563EB] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                {activeItem.ctaText || 'Get a Similar Transformation'}
              </button>

              <Link
                href="/estimator"
                className="px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Calculate Cost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Strategy Call Modal */}
      {isCallModalOpen && (
        <ScheduleCallModal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
        />
      )}
    </section>
  );
}
