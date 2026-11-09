'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (error: any) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          action?: string;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: any) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  action?: string;
  className?: string;
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// Cloudflare official testing sitekey (Always Passes) used as fallback if env is not configured
const DEFAULT_SITE_KEY = '1x00000000000000000000AA';

export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  theme = 'light',
  size = 'normal',
  action = 'form_submit',
  className = '',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(() => typeof window !== 'undefined' && Boolean((window as unknown as { turnstile?: unknown }).turnstile));

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEFAULT_SITE_KEY;

  // 1. Dynamically load Turnstile explicit script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.turnstile) {
      return;
    }

    const existingScript = document.querySelector(`script[src*="turnstile/v0/api.js"]`);
    if (existingScript) {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          setScriptLoaded(true);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = (e) => {
      console.warn('[TURNSTILE] Failed to load Cloudflare Turnstile script:', e);
      if (onError) onError(e);
      // In case of blocker or offline, simulate pass token in dev
      if (process.env.NODE_ENV !== 'production') {
        onVerify('dev_simulated_turnstile_pass_token');
      }
    };
    document.head.appendChild(script);
  }, [onError, onVerify]);

  // 2. Render widget when container and script are ready
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.turnstile) return;

    try {
      // Clear previous widget if exists
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        action,
        callback: (token: string) => {
          onVerify(token);
        },
        'expired-callback': () => {
          if (onExpire) onExpire();
        },
        'error-callback': (err) => {
          console.warn('[TURNSTILE] Challenge error:', err);
          if (onError) onError(err);
        },
      });
    } catch (err) {
      console.error('[TURNSTILE] Failed to render widget:', err);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, siteKey, theme, size, action, onVerify, onExpire, onError]);

  return (
    <div className={`turnstile-container my-3 ${className}`}>
      <div ref={containerRef} className="min-h-[65px] flex items-center" />
    </div>
  );
}
