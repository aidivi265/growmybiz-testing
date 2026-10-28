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
 * Uses the exact official high-res brand monogram asset uploaded by the founder
 * combined with the iconic "Growmy" + gradient "bizz" typography.
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
    sm: { icon: 32, text: 'text-[1.05rem]', tagline: 'text-[9px]' },
    md: { icon: 38, text: 'text-[1.2rem]', tagline: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', tagline: 'text-[11px]' },
    xl: { icon: 60, text: 'text-3xl', tagline: 'text-xs' },
  }[size];

  const isLightBackground = theme === 'light';
  const textPrimaryColor = isLightBackground ? 'text-[#0F1C31]' : 'text-white';

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* ── Official Monogram Icon (Exact Uploaded Mark) ── */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <img
          src="/growmybizz-logo.png"
          alt="Growmybizz"
          width={dimensions.icon}
          height={dimensions.icon}
          className="w-full h-full object-contain rounded-xl drop-shadow-[0_2px_12px_rgba(59,130,246,0.35)]"
        />
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
