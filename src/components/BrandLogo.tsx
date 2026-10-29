'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SYNE_FONT } from '@/lib/fonts';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  centered?: boolean;
  className?: string;
  asLink?: boolean;
}

/**
 * Official Growmybiz24 Brand Logo
 * - Uses ONLY the official circular 3D growth arrow emblem on a pure WHITE background.
 * - Icon is perfectly centered inside the white background badge.
 * - Typography is cleanly coded: "Growmy" + gradient "bizz" + "DIGITAL SOLUTIONS FOR A BIGGER TOMORROW".
 */
export default function BrandLogo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  showTagline = false,
  centered = false,
  className = '',
  asLink = true,
}: BrandLogoProps) {
  const sizeMap = {
    sm: {
      badge: 34,
      icon: 24,
      title: 'text-[1.05rem]',
      tagline: 'text-[7.5px] tracking-[0.14em]',
      gap: 'gap-2.5',
    },
    md: {
      badge: 44,
      icon: 32,
      title: 'text-[1.4rem] sm:text-[1.55rem]',
      tagline: 'text-[8.5px] tracking-[0.16em]',
      gap: 'gap-3',
    },
    lg: {
      badge: 48,
      icon: 36,
      title: 'text-[1.65rem] sm:text-[1.95rem]',
      tagline: 'text-[10px] tracking-[0.18em]',
      gap: 'gap-3 sm:gap-3.5',
    },
    xl: {
      badge: 64,
      icon: 46,
      title: 'text-[1.95rem]',
      tagline: 'text-[11.5px] tracking-[0.2em]',
      gap: 'gap-4',
    },
    '2xl': {
      badge: 76,
      icon: 56,
      title: 'text-[2.5rem] sm:text-[3.2rem]',
      tagline: 'text-[12px] tracking-[0.2em]',
      gap: 'gap-4 sm:gap-4.5',
    },
    '3xl': {
      badge: 88,
      icon: 66,
      title: 'text-[2.75rem] xs:text-[3.2rem] sm:text-[3.85rem] md:text-[4.25rem]',
      tagline: 'text-[13px] tracking-[0.2em]',
      gap: 'gap-4 sm:gap-5',
    },
  }[size];

  const isDarkSurface = theme === 'dark';
  const textPrimaryColor = isDarkSurface ? 'text-white' : 'text-[#0F1C31]';
  const taglineColor = isDarkSurface ? 'text-white/60' : 'text-[#506680]';

  // ─── Center-aligned Icon with Solid White Background ──────────────────────
  const iconBadge = (
    <div
      className="relative shrink-0 flex items-center justify-center bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-black/[0.08] p-1 transition-transform duration-300 group-hover:scale-105"
      style={{
        width: sizeMap.badge,
        height: sizeMap.badge,
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Image
          src="/brand-logo-mark.png"
          alt="Growmybiz24 Mark"
          width={sizeMap.icon}
          height={sizeMap.icon}
          priority
          className="object-contain drop-shadow-[0_1px_4px_rgba(59,130,246,0.25)]"
        />
      </div>
    </div>
  );

  // ─── Pure Coded Typography (Growmy + Gradient bizz + Tagline) ─────────────
  const textContent = (
    <div className={`flex flex-col ${centered || variant === 'stacked' ? 'items-center text-center' : 'items-start text-left'}`}>
      <div className="flex items-baseline leading-none tracking-tight">
        <span
          className={`font-black tracking-tight ${textPrimaryColor} ${sizeMap.title}`}
          style={{ fontFamily: SYNE_FONT, letterSpacing: '-0.035em' }}
        >
          Growmy
        </span>
        <span
          className={`font-black ${sizeMap.title} bg-gradient-to-r from-[#00b4d8] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent`}
          style={{ fontFamily: SYNE_FONT, letterSpacing: '-0.025em' }}
        >
          biz24
        </span>
      </div>

      
    </div>
  );

  let logoContent: React.ReactNode;

  if (variant === 'icon') {
    logoContent = (
      <div className={`inline-flex items-center justify-center select-none group ${className}`}>
        {iconBadge}
      </div>
    );
  } else if (variant === 'stacked') {
    logoContent = (
      <div className={`inline-flex flex-col items-center justify-center gap-2 select-none group ${className}`}>
        {iconBadge}
        {textContent}
      </div>
    );
  } else {
    // Full horizontal lockup
    logoContent = (
      <div
        className={`inline-flex items-center ${sizeMap.gap} select-none group ${
          centered ? 'justify-center' : ''
        } ${className}`}
      >
        {iconBadge}
        {textContent}
      </div>
    );
  }

  if (asLink) {
    return (
      <Link href="/" aria-label="Growmybiz24 Homepage" className="inline-flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
