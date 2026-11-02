export interface Country {
  code: string;       // ISO 3166-1 alpha-2
  name: string;       // Common display name
  dialCode: string;   // E.164 dial code (e.g. '+91')
  flag: string;       // Unicode flag emoji
  placeholder: string;// Representative national format
  priority?: boolean; // Highlighted in fast picker
}

export const COUNTRIES: Country[] = [
  // Top priority international target markets
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', placeholder: '98765 43210', priority: true },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', placeholder: '(555) 234-5678', priority: true },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', placeholder: '50 123 4567', priority: true },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', placeholder: '7911 123456', priority: true },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', placeholder: '(555) 234-5678', priority: true },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', placeholder: '412 345 678', priority: true },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', placeholder: '8123 4567', priority: true },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', placeholder: '50 123 4567', priority: true },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', placeholder: '151 23456789', priority: true },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', placeholder: '6 12 34 56 78', priority: true },

  // Middle East & GCC
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', placeholder: '3312 3456', priority: true },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', placeholder: '9123 4567', priority: true },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', placeholder: '9123 4567', priority: true },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', placeholder: '3600 1234', priority: true },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', placeholder: '7 9012 3456' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', placeholder: '70 123 456' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', placeholder: '50 123 4567' },

  // Asia-Pacific & East Asia
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', placeholder: '12 345 6789' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', placeholder: '812 3456 789' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', placeholder: '81 234 5678' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', placeholder: '91 234 56 78' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', placeholder: '917 123 4567' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', placeholder: '90 1234 5678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', placeholder: '10 1234 5678' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', placeholder: '9123 4567' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', placeholder: '912 345 678' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', placeholder: '21 123 4567' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', placeholder: '1712 345678' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', placeholder: '300 1234567' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', placeholder: '71 234 5678' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', placeholder: '980 1234567' },

  // Europe
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', placeholder: '83 123 4567' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', placeholder: '6 12345678' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', placeholder: '78 123 45 67' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', placeholder: '470 12 34 56' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', placeholder: '664 1234567' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', placeholder: '70 123 45 67' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', placeholder: '412 34 567' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', placeholder: '20 12 34 56' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', placeholder: '40 1234567' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', placeholder: '612 34 56 78' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', placeholder: '312 345 6789' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', placeholder: '912 345 678' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', placeholder: '512 345 678' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', placeholder: '601 123 456' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', placeholder: '691 234 5678' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', placeholder: '712 345 678' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', placeholder: '20 123 4567' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', placeholder: '501 234 56 78' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', placeholder: '96 123456' },

  // Americas
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', placeholder: '55 1234 5678' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', placeholder: '11 91234 5678' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', placeholder: '9 11 1234 5678' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', placeholder: '9 1234 5678' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', placeholder: '300 123 4567' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', placeholder: '912 345 678' },

  // Africa
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', placeholder: '82 123 4567' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', placeholder: '802 123 4567' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', placeholder: '712 345678' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', placeholder: '100 123 4567' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', placeholder: '24 123 4567' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', placeholder: '6 12 34 56 78' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // India (+91)

/**
 * Finds a country by its 2-letter ISO code.
 */
export function getCountryByCode(code?: string): Country {
  if (!code) return DEFAULT_COUNTRY;
  const match = COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return match || DEFAULT_COUNTRY;
}

/**
 * Finds country matching the dial code (e.g. '+91', '+1', '+971').
 */
export function getCountryByDialCode(dialCode?: string): Country | undefined {
  if (!dialCode) return undefined;
  const normalized = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRIES.find((c) => c.dialCode === normalized);
}

/**
 * Smart phone parser: detects if an input string already starts with an international dial code.
 * Example: "+971 50 123 4567" -> { country: UAE, nationalNumber: "50 123 4567" }
 */
export function parseInternationalPhone(phoneString?: string, defaultCode = 'IN'): {
  country: Country;
  nationalNumber: string;
} {
  if (!phoneString || typeof phoneString !== 'string') {
    return { country: getCountryByCode(defaultCode), nationalNumber: '' };
  }

  const trimmed = phoneString.trim();

  // If string begins with '+', sort countries by longest dialCode first to match +971 before +9 etc.
  if (trimmed.startsWith('+')) {
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (trimmed.startsWith(c.dialCode)) {
        const national = trimmed.slice(c.dialCode.length).trim();
        return { country: c, nationalNumber: national };
      }
    }
  }

  // Fallback: check if raw numbers start with country code without plus (e.g. "971501234567" or "919876543210")
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length > 10) {
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      const codeDigits = c.dialCode.replace('+', '');
      if (digitsOnly.startsWith(codeDigits) && codeDigits !== '1') { // avoid false positive on US
        const national = digitsOnly.slice(codeDigits.length);
        return { country: c, nationalNumber: national };
      }
    }
  }

  return { country: getCountryByCode(defaultCode), nationalNumber: trimmed };
}
