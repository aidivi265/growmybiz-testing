export type CurrencyCode = 'INR';

export interface CurrencyDetails {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  position: 'before' | 'after';
  locale: string;
  roundIncrement: number;
}

export interface CurrencyConfig {
  defaultCurrency: CurrencyCode;
  autoDetectEnabled: boolean;
  rates: {
    INR: number;
  };
  enabledCurrencies: CurrencyCode[];
  lastUpdated?: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyDetails> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    position: 'before',
    locale: 'en-IN',
    roundIncrement: 500,
  },
};

export const defaultCurrencyConfig: CurrencyConfig = {
  defaultCurrency: 'INR',
  autoDetectEnabled: false,
  rates: {
    INR: 1.0,
  },
  enabledCurrencies: ['INR'],
};

/**
 * Formats an INR amount cleanly with Indian numbering (e.g., ₹18,000 / ₹1,50,000).
 */
export function formatINR(amount: number, roundIncrement = 0): string {
  const val = roundIncrement > 0 ? Math.round(amount / roundIncrement) * roundIncrement : Math.round(amount);
  return `₹${val.toLocaleString('en-IN')}`;
}

export function formatCurrencyAmount(amount: number): string {
  return formatINR(amount, 500);
}
