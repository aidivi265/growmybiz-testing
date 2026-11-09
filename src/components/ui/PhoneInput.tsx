'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import {
  Country,
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountryByCode,
  parseInternationalPhone,
} from '@/data/countries';

export interface PhoneInputProps {
  label?: string;
  value?: string;
  onChange: (
    fullPhone: string,
    meta?: { dialCode: string; nationalNumber: string; countryCode: string }
  ) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  id?: string;
  name?: string;
  defaultCountry?: string;
}

export default function PhoneInput({
  label,
  value = '',
  onChange,
  error,
  hint,
  placeholder,
  required = false,
  disabled = false,
  theme = 'light',
  className = '',
  id,
  name,
  defaultCountry = 'IN',
}: PhoneInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse initial or incoming value
  const initialParsed = useMemo(
    () => parseInternationalPhone(value, defaultCountry),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    initialParsed.country || getCountryByCode(defaultCountry)
  );
  const [nationalNumber, setNationalNumber] = useState<string>(initialParsed.nationalNumber || '');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with external value changes (e.g. form resets)
  useEffect(() => {
    if (value === '') {
      if (nationalNumber !== '') setNationalNumber('');
      return;
    }
    const parsed = parseInternationalPhone(value, selectedCountry.code);
    if (parsed.country.code !== selectedCountry.code) {
      setSelectedCountry(parsed.country);
    }
    if (parsed.nationalNumber !== nationalNumber) {
      setNationalNumber(parsed.nationalNumber);
    }
  }, [value]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Auto-focus search input when opened
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter countries by search query (name or dial code)
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;

    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularCountries = useMemo(() => {
    return COUNTRIES.filter((c) => c.priority);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');

    // Reconstruct full international number with new dial code
    const full = nationalNumber.trim() ? `${country.dialCode} ${nationalNumber.trim()}` : '';
    onChange(full, {
      dialCode: country.dialCode,
      nationalNumber: nationalNumber.trim(),
      countryCode: country.code,
    });

    inputRef.current?.focus();
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Smart detect if user pasted a number with '+' prefix
    if (raw.trim().startsWith('+')) {
      const parsed = parseInternationalPhone(raw);
      setSelectedCountry(parsed.country);
      raw = parsed.nationalNumber;
      setNationalNumber(raw);
      const full = raw.trim() ? `${parsed.country.dialCode} ${raw.trim()}` : '';
      onChange(full, {
        dialCode: parsed.country.dialCode,
        nationalNumber: raw.trim(),
        countryCode: parsed.country.code,
      });
      return;
    }

    // Clean characters (only digits, spaces, hyphens, parentheses)
    const cleaned = raw.replace(/[^\d\s()-]/g, '');
    setNationalNumber(cleaned);

    const full = cleaned.trim() ? `${selectedCountry.dialCode} ${cleaned.trim()}` : '';
    onChange(full, {
      dialCode: selectedCountry.dialCode,
      nationalNumber: cleaned.trim(),
      countryCode: selectedCountry.code,
    });
  };

  const isDark = theme === 'dark';
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-xs sm:text-sm font-semibold ${
            isDark ? 'text-white/85' : 'text-[#0F1C31]'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`flex items-center rounded-xl border transition-all ${
            isDark
              ? 'bg-white/5 border-white/15 focus-within:border-[#477BDB] focus-within:ring-1 focus-within:ring-[#477BDB]'
              : 'bg-white border-[#E8EDF4] focus-within:border-[#477BDB] focus-within:ring-2 focus-within:ring-[#477BDB]/10'
          } ${error ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100' : ''}`}
        >
          {/* Country Selector Trigger Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={`Selected country: ${selectedCountry.name} (${selectedCountry.dialCode}). Click to change.`}
            className={`flex items-center gap-1.5 px-3 py-2.5 sm:py-3 border-r transition-colors cursor-pointer select-none shrink-0 ${
              isDark
                ? 'border-white/10 hover:bg-white/10 text-white'
                : 'border-[#E8EDF4] hover:bg-[#F7F9FC] text-[#0F1C31]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span
              className={`text-xs sm:text-sm font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-[#0F1C31]'
              }`}
            >
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
                isDark ? 'text-white/50' : 'text-[#6B7E95]'
              }`}
            />
          </button>

          {/* National Number Input */}
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="tel"
            inputMode="tel"
            disabled={disabled}
            required={required}
            value={nationalNumber}
            onChange={handleNumberChange}
            placeholder={placeholder || selectedCountry.placeholder}
            className={`w-full px-3.5 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm outline-none transition-colors ${
              isDark
                ? 'text-white placeholder-white/35'
                : 'text-[#0F1C31] placeholder-[#A0AEC0]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute left-0 top-full mt-1.5 w-72 sm:w-80 max-h-80 rounded-2xl shadow-2xl border overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
              isDark
                ? 'bg-[#0E1726] border-white/20 text-white'
                : 'bg-white border-[#E8EDF4] text-[#0F1C31]'
            }`}
          >
            {/* Search Input Box */}
            <div
              className={`p-2.5 border-b sticky top-0 z-10 ${
                isDark ? 'bg-[#0E1726] border-white/10' : 'bg-[#FAFBFD] border-[#E8EDF4]'
              }`}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-white'
                    : 'bg-white border-[#E8EDF4] text-[#0F1C31]'
                }`}
              >
                <Search size={13} className={isDark ? 'text-white/40' : 'text-[#6B7E95]'} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code (e.g. US, +971, UAE)..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-400 text-xs py-0.5"
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="overflow-y-auto max-h-64 p-1 divide-y divide-transparent">
              {/* If no search query, show Recommended/Popular Countries first */}
              {!searchQuery.trim() && (
                <div className="mb-1">
                  <div
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-[#6B7E95]'
                    }`}
                  >
                    Top Destinations
                  </div>
                  {popularCountries.map((c) => {
                    const isSelected = selectedCountry.code === c.code;
                    return (
                      <button
                        key={`pop-${c.code}`}
                        type="button"
                        onClick={() => handleCountrySelect(c)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                          isSelected
                            ? isDark
                              ? 'bg-[#477BDB]/30 text-white font-semibold'
                              : 'bg-[#EBF1FB] text-[#477BDB] font-semibold'
                            : isDark
                            ? 'hover:bg-white/10 text-white/90'
                            : 'hover:bg-[#F7F9FC] text-[#0F1C31]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base leading-none" role="img" aria-label={c.name}>
                            {c.flag}
                          </span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                              isDark ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-[#477BDB]'
                            }`}
                          >
                            {c.dialCode}
                          </span>
                          {isSelected && <Check size={13} className="text-[#477BDB]" />}
                        </div>
                      </button>
                    );
                  })}
                  <div
                    className={`my-1 border-t ${
                      isDark ? 'border-white/10' : 'border-[#E8EDF4]'
                    }`}
                  />
                  <div
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-[#6B7E95]'
                    }`}
                  >
                    All Countries
                  </div>
                </div>
              )}

              {/* Filtered or All Countries */}
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        isSelected
                          ? isDark
                            ? 'bg-[#477BDB]/30 text-white font-semibold'
                            : 'bg-[#EBF1FB] text-[#477BDB] font-semibold'
                          : isDark
                          ? 'hover:bg-white/10 text-white/90'
                          : 'hover:bg-[#F7F9FC] text-[#0F1C31]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base leading-none" role="img" aria-label={c.name}>
                          {c.flag}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-[#477BDB]'
                          }`}
                        >
                          {c.dialCode}
                        </span>
                        {isSelected && <Check size={13} className="text-[#477BDB]" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div
                  className={`p-4 text-center text-xs ${
                    isDark ? 'text-white/50' : 'text-[#6B7E95]'
                  }`}
                >
                  <Globe size={18} className="mx-auto mb-1 opacity-50" />
                  No country found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && (
        <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#6B7E95]'}`}>{hint}</p>
      )}
    </div>
  );
}
