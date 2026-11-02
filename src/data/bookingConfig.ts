export interface BookingConfig {
  enabled: boolean;
  provider: 'cal' | 'calendly' | 'custom' | 'none';
  calLink: string;
  calendlyUrl: string;
  customBookingUrl: string;
  defaultView: 'calendar' | 'callback';
  theme: 'dark' | 'light';
  primaryColor: string;
  modalTitle: string;
  modalSubtitle: string;
  meetingDurationMinutes: number;
  allowCallbackFallback: boolean;
  allowWhatsAppDirect: boolean;
  lastUpdated?: string;
}

export const defaultBookingConfig: BookingConfig = {
  enabled: true,
  provider: 'cal',
  calLink: 'growmybiz24/15min',
  calendlyUrl: 'https://calendly.com/growmybiz24/15min',
  customBookingUrl: '',
  defaultView: 'calendar',
  theme: 'dark',
  primaryColor: '#477BDB',
  modalTitle: 'Schedule a 15-Min Strategy Call',
  modalSubtitle:
    'Pick a live slot directly on our calendar. Automated Google Meet invite sent instantly with zero back-and-forth.',
  meetingDurationMinutes: 15,
  allowCallbackFallback: true,
  allowWhatsAppDirect: true,
};

/**
 * Builds the fully qualified, embed-safe iframe URL for Cal.com, Calendly, or custom booking engines.
 */
export function getBookingEmbedUrl(config: BookingConfig): string | null {
  if (!config.enabled || config.provider === 'none') return null;

  const themeParam = config.theme || 'dark';
  const colorHex = (config.primaryColor || '#477BDB').replace('#', '');

  if (config.provider === 'cal') {
    let clean = (config.calLink || '').trim();
    if (!clean) return null;

    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      clean = clean.replace(/^https?:\/\/(www\.)?cal\.com\//i, '');
    }
    clean = clean.replace(/^\/+/, '');
    if (!clean) return null;

    // Build Cal.com embed URL with dark mode and custom accent color
    const query = new URLSearchParams({
      embed: 'true',
      theme: themeParam,
      primaryColor: `#${colorHex}`,
    });

    return `https://cal.com/${clean}?${query.toString()}`;
  }

  if (config.provider === 'calendly') {
    let url = (config.calendlyUrl || '').trim();
    if (!url) return null;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://calendly.com/${url.replace(/^\/+/, '')}`;
    }

    const sep = url.includes('?') ? '&' : '?';
    const params = new URLSearchParams({
      embed_type: 'Inline',
      background_color: themeParam === 'dark' ? '0e1726' : 'ffffff',
      text_color: themeParam === 'dark' ? 'ffffff' : '0f172a',
      primary_color: colorHex,
    });

    return `${url}${sep}${params.toString()}`;
  }

  if (config.provider === 'custom') {
    return (config.customBookingUrl || '').trim() || null;
  }

  return null;
}
