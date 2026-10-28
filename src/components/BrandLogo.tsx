'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  asLink?: boolean;
}

/**
 * Official Growmybizz Brand Logo
 * Renders the exact official brand identity asset uploaded by the founder.
 * - 'light' / 'auto': Full horizontal logo with black 'Growmy' for light surfaces.
 * - 'dark': High-contrast light version with white 'Growmy' for navy/dark backgrounds.
 * - 'icon': Emblem monogram only.
 */
export default function BrandLogo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  className = '',
  asLink = true,
}: BrandLogoProps) {
  // Dimension definitions with 3.155:1 aspect ratio for full logo
  const sizeMap = {
    sm: { height: 28, width: 88, iconSize: 28 },
    md: { height: 36, width: 114, iconSize: 36 },
    lg: { height: 46, width: 145, iconSize: 46 },
    xl: { height: 58, width: 183, iconSize: 58 },
  }[size];

  const isDarkSurface = theme === 'dark';
  const logoSrc = isDarkSurface
    ? '/growmybizz-logo-light.png'
    : '/growmybizz-logo.png';

  const logoContent = (
    <div className={`inline-flex items-center select-none group transition-opacity hover:opacity-95 ${className}`}>
      {variant === 'icon' ? (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{ width: sizeMap.iconSize, height: sizeMap.iconSize }}
        >
          <Image
            src="/brand-logo-mark.png"
            alt="Growmybizz"
            width={sizeMap.iconSize}
            height={sizeMap.iconSize}
            priority
            className="w-full h-full object-contain rounded-xl drop-shadow-[0_2px_12px_rgba(59,130,246,0.35)]"
          />
        </div>
      ) : (
        <div
          className="relative shrink-0 flex items-center transition-transform duration-300 group-hover:scale-102"
          style={{ height: sizeMap.height, width: sizeMap.width }}
        >
          <Image
            src={logoSrc}
            alt="Growmybizz — Digital Solutions for a Bigger Tomorrow"
            width={sizeMap.width}
            height={sizeMap.height}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Growmybizz Homepage" className="inline-flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
