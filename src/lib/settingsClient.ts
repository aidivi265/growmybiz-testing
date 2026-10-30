'use client';

let cachedSettingsPromise: Promise<any> | null = null;
let cachedSettingsData: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 1000; // 30s in-memory client cache

export function invalidateClientSettings() {
  cachedSettingsData = null;
  cachedSettingsPromise = null;
  lastFetchTime = 0;
}

export async function getClientSettings(forceRefresh = false): Promise<any> {
  const now = Date.now();
  if (!forceRefresh && cachedSettingsData && now - lastFetchTime < CACHE_TTL) {
    return cachedSettingsData;
  }

  if (!forceRefresh && cachedSettingsPromise) {
    return cachedSettingsPromise;
  }

  cachedSettingsPromise = fetch('/api/settings', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cachedSettingsData = data;
      lastFetchTime = Date.now();
      cachedSettingsPromise = null;
      return data;
    })
    .catch((err) => {
      cachedSettingsPromise = null;
      console.warn('Settings client fetch notice:', err);
      return null;
    });

  return cachedSettingsPromise;
}
