'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import {
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from '@/data/currencyConfig';
import { trackGAEvent } from '@/components/GoogleAnalytics';

interface CurrencySwitcherProps {
  variant?: 'compact' | 'pills' | 'dropdown';
  className?: string;
  showAutoBadge?: boolean;
}

export default function CurrencySwitcher({
  variant = 'compact',
  className = '',
  showAutoBadge = false,
}: CurrencySwitcherProps) {
  const { currency, setCurrency, isAutoDetected, detectedCountry } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    trackGAEvent('currency_change', {
      event_category: 'Localization',
      currency: code,
    });
  };

  const activeDetails = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const currencyList: CurrencyCode[] = ['INR', 'USD', 'EUR', 'AED'];

  // 1. Pills Variant (Used inside Estimator and high-intent pricing modules)
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 shadow-inner ${className}`}>
        {currencyList.map((code) => {
          const item = SUPPORTED_CURRENCIES[code];
          const isSelected = currency === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#477BDB] to-[#2563EB] text-white shadow-md scale-[1.02]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.flag}</span>
              <span>{code}</span>
              <span className="text-[10px] opacity-75 font-mono">({item.symbol.trim()})</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Compact / Dropdown Variant (Used in Navbar and Header)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer shadow-sm focus:outline-none"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{activeDetails.flag}</span>
        <span className="font-bold text-xs">{activeDetails.code}</span>
        <span className="text-[11px] text-white/60 font-mono">({activeDetails.symbol.trim()})</span>
        <ChevronDown
          size={12}
          className={`text-white/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0E1726] border border-white/15 shadow-2xl z-50 p-1.5 animate-fadeIn backdrop-blur-xl">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 mb-1 flex items-center justify-between">
            <span>Select Currency</span>
            {isAutoDetected && detectedCountry && (
              <span className="text-emerald-400 font-mono text-[9px]">IP: {detectedCountry}</span>
            )}
          </div>

          <div className="space-y-0.5">
            {currencyList.map((code) => {
              const item = SUPPORTED_CURRENCIES[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.flag}</span>
                    <div className="text-left">
                      <div className="font-bold leading-none">{item.code}</div>
                      <div className="text-[10px] text-white/50 mt-0.5">{item.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white/70">{item.symbol.trim()}</span>
                    {isSelected && <Check size={13} className="text-[#38BDF8]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showAutoBadge && isAutoDetected && (
            <div className="mt-1 pt-1 border-t border-white/10 px-2 py-0.5 text-[9.5px] text-emerald-400/90 flex items-center gap-1">
              <span>● Auto-detected via IP location</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
