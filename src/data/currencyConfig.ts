export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'AED';

export interface CurrencyDetails {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromUSD: number; // e.g. 1 USD = 86.5 INR, 0.92 EUR, 3.67 AED
  position: 'before' | 'after';
  locale: string;
  roundIncrement: number; // e.g. round to nearest 500 for INR, 25 for USD/EUR, 100 for AED
}

export interface CurrencyConfig {
  defaultCurrency: CurrencyCode;
  autoDetectEnabled: boolean;
  rates: {
    INR: number;
    USD: number;
    EUR: number;
    AED: number;
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
    rateFromUSD: 86.5,
    position: 'before',
    locale: 'en-IN',
    roundIncrement: 500,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromUSD: 1.0,
    position: 'before',
    locale: 'en-US',
    roundIncrement: 25,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateFromUSD: 0.92,
    position: 'before',
    locale: 'de-DE',
    roundIncrement: 25,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rateFromUSD: 3.67,
    position: 'before',
    locale: 'en-AE',
    roundIncrement: 100,
  },
};

export const defaultCurrencyConfig: CurrencyConfig = {
  defaultCurrency: 'USD',
  autoDetectEnabled: true,
  rates: {
    USD: 1.0,
    INR: 86.5,
    EUR: 0.92,
    AED: 3.67,
  },
  enabledCurrencies: ['INR', 'USD', 'EUR', 'AED'],
};

// Regional ISO Country Code Mapping
export const MIDDLE_EAST_COUNTRIES = ['AE', 'SA', 'QA', 'KW', 'OM', 'BH'];
export const EUROZONE_COUNTRIES = [
  'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI',
  'GR', 'LU', 'CY', 'MT', 'SK', 'SI', 'EE', 'LV', 'LT',
];

/**
 * Maps a two-letter country ISO code to its corresponding default currency.
 */
export function getCurrencyForCountry(countryCode?: string | null): CurrencyCode {
  if (!countryCode) return 'USD';
  const upper = countryCode.trim().toUpperCase();

  if (upper === 'IN') return 'INR';
  if (MIDDLE_EAST_COUNTRIES.includes(upper)) return 'AED';
  if (EUROZONE_COUNTRIES.includes(upper)) return 'EUR';

  return 'USD';
}

/**
 * Client-side timezone fallback detection when IP headers are unavailable (e.g. localhost, local network).
 */
export function getCurrencyFromTimezone(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta')) return 'INR';
    if (
      tz.includes('Dubai') ||
      tz.includes('Riyadh') ||
      tz.includes('Qatar') ||
      tz.includes('Kuwait') ||
      tz.includes('Bahrain') ||
      tz.includes('Muscat')
    ) {
      return 'AED';
    }
    if (
      tz.includes('Berlin') ||
      tz.includes('Paris') ||
      tz.includes('Rome') ||
      tz.includes('Madrid') ||
      tz.includes('Amsterdam') ||
      tz.includes('Brussels') ||
      tz.includes('Vienna') ||
      tz.includes('Dublin') ||
      tz.includes('Lisbon') ||
      tz.includes('Athens') ||
      tz.includes('Helsinki')
    ) {
      return 'EUR';
    }
  } catch {
    // Ignore timezone error
  }
  return 'USD';
}

/**
 * Converts and formats a price cleanly according to the selected currency.
 */
export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyCode,
  rates: CurrencyConfig['rates'] = defaultCurrencyConfig.rates,
  fromCurrency: CurrencyCode = 'USD'
): string {
  const details = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  // Convert to USD first if not already
  let amountUSD = amount;
  if (fromCurrency !== 'USD') {
    const fromRate = rates[fromCurrency] || 1.0;
    amountUSD = amount / fromRate;
  }

  // Convert from USD to target currency
  const targetRate = rates[currency] || details.rateFromUSD;
  const targetAmount = amountUSD * targetRate;

  // Format with commas and rounding
  const rounded = Math.round(targetAmount / details.roundIncrement) * details.roundIncrement;
  const formattedNumber = rounded.toLocaleString(details.locale);

  if (details.position === 'after') {
    return `${formattedNumber} ${details.symbol.trim()}`;
  }
  return `${details.symbol}${formattedNumber}`;
}
