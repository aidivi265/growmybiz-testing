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
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  showAutoBadge?: boolean;
}

export default function CurrencySwitcher({
  variant = 'compact',
  theme = 'light',
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

  const isLight = theme === 'light';

  // 1. Pills Variant (Used inside Estimator and high-intent pricing modules)
  if (variant === 'pills') {
    return (
      <div
        className={`inline-flex items-center gap-1 p-1 rounded-xl shadow-inner ${
          isLight
            ? 'bg-[#F1F5F9] border border-[#CBD5E1]/70'
            : 'bg-white/5 border border-white/10'
        } ${className}`}
      >
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
                  ? isLight
                    ? 'bg-white text-[#2563EB] shadow-xs border border-[#CBD5E1]/40 scale-[1.02]'
                    : 'bg-gradient-to-r from-[#477BDB] to-[#2563EB] text-white shadow-md scale-[1.02]'
                  : isLight
                  ? 'text-[#475569] hover:text-[#0F1C31] hover:bg-white/60'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.flag}</span>
              <span>{code}</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-[#64748B]' : 'opacity-75'}`}>
                ({item.symbol.trim()})
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Compact / Dropdown Variant (Used in Navbar and Header)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs focus:outline-none select-none ${
          isLight
            ? 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1]/70 text-[#0F1C31]'
            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white'
        }`}
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{activeDetails.flag}</span>
        <span className={`font-bold text-xs ${isLight ? 'text-[#0F1C31]' : 'text-white'}`}>
          {activeDetails.code}
        </span>
        <span className={`text-[11px] font-mono ${isLight ? 'text-[#64748B]' : 'text-white/60'}`}>
          ({activeDetails.symbol.trim()})
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isLight ? 'text-[#64748B]' : 'text-white/50'
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl z-50 p-1.5 animate-fadeIn ${
            isLight
              ? 'bg-white border-[#E2E8F0] shadow-[0_12px_36px_rgba(15,28,49,0.14)]'
              : 'bg-[#0E1726] border-white/15 backdrop-blur-xl'
          }`}
        >
          <div
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-b mb-1 flex items-center justify-between ${
              isLight
                ? 'text-[#64748B] border-[#F1F5F9]'
                : 'text-white/40 border-white/10'
            }`}
          >
            <span>Select Currency</span>
            {isAutoDetected && detectedCountry && (
              <span
                className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                  isLight
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'text-emerald-400'
                }`}
              >
                IP: {detectedCountry}
              </span>
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
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]'
                        : 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : isLight
                      ? 'text-[#334155] hover:text-[#0F1C31] hover:bg-[#F8FAFC]'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.flag}</span>
                    <div className="text-left">
                      <div className={`font-bold leading-none ${isLight && isSelected ? 'text-[#2563EB]' : ''}`}>
                        {item.code}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isLight ? 'text-[#64748B]' : 'text-white/50'}`}>
                        {item.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isLight ? 'text-[#64748B]' : 'text-white/70'
                      }`}
                    >
                      {item.symbol.trim()}
                    </span>
                    {isSelected && (
                      <Check
                        size={13}
                        className={isLight ? 'text-[#2563EB]' : 'text-[#38BDF8]'}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showAutoBadge && isAutoDetected && (
            <div
              className={`mt-1 pt-1 border-t px-2 py-0.5 text-[9.5px] flex items-center gap-1.5 ${
                isLight
                  ? 'border-[#F1F5F9] text-[#2563EB]'
                  : 'border-white/10 text-emerald-400/90'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Auto-detected via IP location</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
