'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CurrencyCode,
  CurrencyConfig,
  CurrencyDetails,
  SUPPORTED_CURRENCIES,
  defaultCurrencyConfig,
  formatCurrencyAmount,
  getCurrencyFromTimezone,
} from '@/data/currencyConfig';
import { getClientSettings } from '@/lib/settingsClient';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (newCurrency: CurrencyCode) => void;
  rates: CurrencyConfig['rates'];
  currencyDetails: CurrencyDetails;
  detectedCountry: string | null;
  isAutoDetected: boolean;
  formatPrice: (amount: number, fromCurrency?: CurrencyCode) => string;
  convertPrice: (amount: number, fromCurrency?: CurrencyCode, toCurrency?: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'growmybiz_currency';
const EVENT_NAME = 'growmybiz:currency-change';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<CurrencyConfig['rates']>(defaultCurrencyConfig.rates);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  // Initialize currency detection and stored preferences
  useEffect(() => {
    // 1. Check if user already manually selected a currency in previous sessions
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as CurrencyCode) : null;
    if (stored && stored in SUPPORTED_CURRENCIES) {
      setCurrencyState(stored);
      setIsAutoDetected(false);
    } else {
      // 2. Auto-detect from IP location header via /api/geo
      fetch('/api/geo')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.currency && data.currency in SUPPORTED_CURRENCIES) {
            setCurrencyState(data.currency);
            setDetectedCountry(data.country || null);
            setIsAutoDetected(true);
          } else {
            // 3. Fallback to timezone heuristics (for localhost / dev environment)
            const tzCurrency = getCurrencyFromTimezone();
            setCurrencyState(tzCurrency);
            setIsAutoDetected(true);
          }
        })
        .catch(() => {
          const tzCurrency = getCurrencyFromTimezone();
          setCurrencyState(tzCurrency);
          setIsAutoDetected(true);
        });
    }

    // Load live CMS exchange rates from settings
    getClientSettings().then((data) => {
      if (data?.currencyConfig?.rates) {
        setRates((prev) => ({
          ...prev,
          ...data.currencyConfig.rates,
        }));
      }
    });

    // Listen for cross-component currency change events
    const handleCurrencyEvent = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyCode>;
      if (customEvent.detail && customEvent.detail in SUPPORTED_CURRENCIES) {
        setCurrencyState(customEvent.detail);
        setIsAutoDetected(false);
      }
    };

    window.addEventListener(EVENT_NAME, handleCurrencyEvent);
    return () => window.removeEventListener(EVENT_NAME, handleCurrencyEvent);
  }, []);

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    if (!(newCurrency in SUPPORTED_CURRENCIES)) return;
    setCurrencyState(newCurrency);
    setIsAutoDetected(false);

    try {
      localStorage.setItem(STORAGE_KEY, newCurrency);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newCurrency }));
    } catch {
      // Ignore storage error
    }
  }, []);

  const currencyDetails = useMemo(() => {
    return SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  }, [currency]);

  const convertPrice = useCallback(
    (amount: number, fromCurrency: CurrencyCode = 'USD', toCurrency: CurrencyCode = currency): number => {
      let amountUSD = amount;
      if (fromCurrency !== 'USD') {
        const fromRate = rates[fromCurrency] || 1.0;
        amountUSD = amount / fromRate;
      }
      const targetRate = rates[toCurrency] || 1.0;
      return amountUSD * targetRate;
    },
    [currency, rates]
  );

  const formatPrice = useCallback(
    (amount: number, fromCurrency: CurrencyCode = 'USD'): string => {
      return formatCurrencyAmount(amount, currency, rates, fromCurrency);
    },
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        currencyDetails,
        detectedCountry,
        isAutoDetected,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return safe fallback if used outside CurrencyProvider
    return {
      currency: 'USD' as CurrencyCode,
      setCurrency: () => {},
      rates: defaultCurrencyConfig.rates,
      currencyDetails: SUPPORTED_CURRENCIES.USD,
      detectedCountry: null,
      isAutoDetected: false,
      formatPrice: (amt: number) => `$${amt.toLocaleString()}`,
      convertPrice: (amt: number) => amt,
    };
  }
  return context;
}
