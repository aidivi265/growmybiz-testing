'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

/**
 * Official Growmybizz Brand Logo
 * Features the signature circular monogram with the upward dynamic gradient arrow
 * and the iconic "Growmy" + gradient "bizz" typography.
 */
export default function BrandLogo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  showTagline = false,
  className = '',
  asLink = true,
}: BrandLogoProps) {
  // Dimensions map
  const dimensions = {
    sm: { icon: 30, text: 'text-[1.05rem]', tagline: 'text-[9px]' },
    md: { icon: 36, text: 'text-[1.2rem]', tagline: 'text-[10px]' },
    lg: { icon: 44, text: 'text-2xl', tagline: 'text-[11px]' },
    xl: { icon: 56, text: 'text-3xl', tagline: 'text-xs' },
  }[size];

  const isLightBackground = theme === 'light';
  const textPrimaryColor = isLightBackground ? 'text-[#0F1C31]' : 'text-white';

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* ── Monogram Icon ── */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(59,130,246,0.25)]"
        >
          <defs>
            {/* Dynamic Arrow Gradient (Cyan -> Electric Blue -> Violet) */}
            <linearGradient id="gmb-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="35%" stopColor="#2563eb" />
              <stop offset="70%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Circle Ring Stroke Gradient */}
            <linearGradient id="gmb-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLightBackground ? '#0f172a' : '#ffffff'} />
              <stop offset="60%" stopColor={isLightBackground ? '#1e293b' : '#e2e8f0'} />
              <stop offset="100%" stopColor={isLightBackground ? '#334155' : '#cbd5e1'} />
            </linearGradient>

            {/* Ambient Glow Filter */}
            <filter id="gmb-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background circle badge for contrast */}
          <rect
            width="100"
            height="100"
            rx="24"
            fill={isLightBackground ? '#f8fafc' : '#0b1120'}
          />
          <rect
            width="98"
            height="98"
            x="1"
            y="1"
            rx="23"
            stroke={isLightBackground ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="1"
          />

          {/* Outer Circular Ring (G / Circle silhouette) */}
          <path
            d="M 50 16 
               A 34 34 0 1 0 83 58 
               L 69 58 
               A 20 20 0 1 1 50 30 
               A 20 20 0 0 1 66 38 
               L 78 26 
               A 34 34 0 0 0 50 16 Z"
            fill="url(#gmb-ring-grad)"
          />

          {/* Dynamic Curving Upward Arrow cutting through the G */}
          <path
            d="M 18 72 
               C 22 58, 36 48, 52 42 
               C 62 38, 70 34, 76 26 
               L 70 24 
               L 88 18 
               L 86 36 
               L 80 30 
               C 74 38, 64 45, 52 49 
               C 38 54, 28 64, 24 74 
               Z"
            fill="url(#gmb-arrow-grad)"
            filter="url(#gmb-glow)"
          />
        </svg>
      </div>

      {/* ── Wordmark Typography ── */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none tracking-tight">
            <span
              className={`font-black tracking-tight ${textPrimaryColor} ${dimensions.text}`}
              style={{ letterSpacing: '-0.035em' }}
            >
              Growmy
            </span>
            <span
              className={`font-black ${dimensions.text} bg-gradient-to-r from-[#00b4d8] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent`}
              style={{ letterSpacing: '-0.025em' }}
            >
              bizz
            </span>
          </div>

          {showTagline && (
            <span
              className={`font-semibold tracking-widest uppercase mt-1 ${isLightBackground ? 'text-slate-500' : 'text-white/40'} ${dimensions.tagline}`}
              style={{ letterSpacing: '0.12em' }}
            >
              Ideas → Websites → Apps → Growth
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Growmybizz Homepage" className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
