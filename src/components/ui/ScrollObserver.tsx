'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollObserver: Globally observes elements with `.reveal-on-scroll`
 * and applies `.is-visible` when they enter the viewport.
 * Built with bulletproof fail-safes so no device ever shows a blank screen.
 */
export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const revealAll = () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-visible');
      });
    };

    // If browser doesn't support IntersectionObserver or user prefers reduced motion
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealAll();
      return;
    }

    // Safety fallback timer: Ensure elements are never stuck hidden on slow mobile devices
    const safetyTimer = setTimeout(revealAll, 1200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '60px 0px 60px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => {
      // If already within or near viewport, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 100 && rect.bottom >= -50) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
