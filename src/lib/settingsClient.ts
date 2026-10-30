'use client';

let cachedSettingsPromise: Promise<any> | null = null;
let cachedSettingsData: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute client cache

export async function getClientSettings(): Promise<any> {
  const now = Date.now();
  if (cachedSettingsData && now - lastFetchTime < CACHE_TTL) {
    return cachedSettingsData;
  }

  if (cachedSettingsPromise) {
    return cachedSettingsPromise;
  }

  cachedSettingsPromise = fetch('/api/settings')
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
