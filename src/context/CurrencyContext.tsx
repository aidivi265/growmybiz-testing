'use client';

import React, { createContext, useContext } from 'react';
import {
  CurrencyCode,
  CurrencyConfig,
  CurrencyDetails,
  SUPPORTED_CURRENCIES,
  defaultCurrencyConfig,
  formatINR,
} from '@/data/currencyConfig';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (newCurrency: CurrencyCode) => void;
  rates: CurrencyConfig['rates'];
  currencyDetails: CurrencyDetails;
  detectedCountry: string | null;
  isAutoDetected: boolean;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number) => number;
}

const INR_CONTEXT_VALUE: CurrencyContextType = {
  currency: 'INR',
  setCurrency: () => {},
  rates: defaultCurrencyConfig.rates,
  currencyDetails: SUPPORTED_CURRENCIES.INR,
  detectedCountry: 'IN',
  isAutoDetected: false,
  formatPrice: (amount: number) => formatINR(amount),
  convertPrice: (amount: number) => amount,
};

const CurrencyContext = createContext<CurrencyContextType>(INR_CONTEXT_VALUE);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyContext.Provider value={INR_CONTEXT_VALUE}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
