'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Globe,
  Bot,
  Palette,
  TrendingUp,
  Smartphone,
  Video,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import type { BeforeAfterShowcase } from '@/data/beforeAfterShowcase';
import { defaultBeforeAfterShowcases } from '@/data/beforeAfterShowcase';
import ScheduleCallModal from '@/components/ScheduleCallModal';

const SERVICE_TABS = [
  { slug: 'web-app-development', label: 'Web & E-Commerce', icon: Globe },
  { slug: 'ai-automation', label: 'AI & Automation', icon: Bot },
  { slug: 'design-branding', label: 'Design & Branding', icon: Palette },
  { slug: 'digital-marketing', label: 'SEO & Growth Ads', icon: TrendingUp },
  { slug: 'mobile-app', label: 'Mobile Apps', icon: Smartphone },
  { slug: 'video-content', label: '3D & Motion', icon: Video },
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
  eyebrow = 'TRANSFORMATION SHOWCASE',
  title = 'Before & After Our Redesign',
  subtitle = 'Drag the slider to compare original client interfaces with our high-conversion redesigns.',
  className = '',
  id = 'before-after-showcase',
}: BeforeAfterSliderProps) {
  const items = initialItems && initialItems.length > 0 ? initialItems : defaultBeforeAfterShowcases;

  const [activeSlug, setActiveSlug] = useState<string>(items[0]?.serviceSlug || 'web-app-development');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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
    <section id={id} className={`py-12 sm:py-16 relative overflow-hidden bg-[#0A0F1D] text-white border-y border-[#1E293B] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold tracking-wider uppercase mb-2">
              <span>{eyebrow}</span>
            </div>
            <h2
              style={{
                fontFamily: SYNE_FONT,
                letterSpacing: '-0.02em',
              }}
              className="text-2xl sm:text-3xl font-extrabold text-white"
            >
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Clean Service Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {SERVICE_TABS.map((tab) => {
              const isSelected = activeItem.serviceSlug === tab.slug;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.slug}
                  onClick={() => {
                    setActiveSlug(tab.slug);
                    setSliderPosition(50);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#3B82F6] shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <TabIcon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact 12-Column Layout (fits gracefully on laptop screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Interactive Before & After Slider (7 cols) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#38BDF8]" />
                Drag slider to compare
              </span>
              <span className="font-mono text-slate-500">
                Split: {Math.round(sliderPosition)}%
              </span>
            </div>

            {/* Slider Frame */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={(e) => updatePosition(e.clientX)}
              className="relative w-full h-[300px] sm:h-[360px] lg:h-[390px] rounded-2xl overflow-hidden border border-slate-800 select-none bg-slate-950 shadow-xl cursor-ew-resize group"
              role="slider"
              tabIndex={0}
              aria-valuenow={Math.round(sliderPosition)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Before and after transformation comparison slider"
              onKeyDown={handleKeyDown}
            >
              {/* After Image (Full width background) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.afterImage}
                alt={activeItem.afterLabel || 'After redesign'}
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
                    width: containerWidth > 0 ? `${containerWidth}px` : '100%',
                    height: '100%',
                  }}
                />
              </div>

              {/* Divider & Drag Handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-950 shadow-lg flex items-center justify-center font-bold text-xs border border-blue-500 group-hover:scale-105 transition-transform">
                  <span className="flex items-center tracking-tighter">
                    <ChevronLeft className="w-3 h-3 -mr-0.5" />
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-rose-400 border border-rose-500/30">
                  {activeItem.beforeLabel || 'BEFORE'}
                </span>
              </div>

              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-emerald-400 border border-emerald-500/30">
                  {activeItem.afterLabel || 'AFTER GROWMYBIZZ'}
                </span>
              </div>
            </div>

            {/* Client Context Strip */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
              <span>Client: <strong className="text-white font-medium">{activeItem.clientName}</strong></span>
              <span>Industry: <span className="text-slate-300">{activeItem.industry}</span></span>
            </div>
          </div>

          {/* Right Column: Case Outcome & Clean Metrics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] mb-1">
                {activeItem.serviceName}
              </div>
              <h3
                style={{
                  fontFamily: SYNE_FONT,
                  lineHeight: 1.25,
                }}
                className="text-lg sm:text-xl font-bold text-white tracking-tight"
              >
                {activeItem.tagline}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            {/* 3 Clean Impact Metric Pills */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {activeItem.metrics.slice(0, 3).map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center"
                >
                  <div className="text-[10px] text-slate-400 font-medium truncate mb-0.5">
                    {metric.label}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-400 tracking-tight">
                    {metric.lift}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    <span className="text-rose-400/80">{metric.before}</span>
                    <span className="mx-1">→</span>
                    <span className="text-white">{metric.after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* What Was Delivered */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Included Deliverables:
              </div>
              <div className="space-y-1">
                {activeItem.deliverables.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Discuss Similar Project</span>
              </button>

              <Link
                href={`/estimator?category=${activeItem.serviceSlug}`}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <span>Calculate Scope</span>
                <ArrowRight className="w-3 h-3" />
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
