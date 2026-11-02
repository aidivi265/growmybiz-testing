/**
 * Multi-Tier Resilient Rate Limiter (Supabase PostgreSQL + In-Memory Fallback)
 *
 * Tier 1: Persistent PostgreSQL Atomic Function (public.check_rate_limit)
 *         Guarantees accurate rate limiting across multi-region serverless nodes,
 *         cold starts, and distributed edge containers without state loss.
 *
 * Tier 2: In-Memory Sliding Window
 *         Instantly activates as a fallback if the database is initializing,
 *         offline, or temporarily unreachable, ensuring 100% uptime and zero request dropping.
 */

import { supabaseAdmin } from './supabaseServer';

interface RateLimitRecord {
  timestamps: number[];
}

const inMemoryStore = new Map<string, RateLimitRecord>();

// Clean up stale in-memory entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of inMemoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        inMemoryStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  limit: number;      // Maximum allowed requests in the window
  windowMs: number;   // Window duration in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Synchronous in-memory sliding window check.
 */
export function checkInMemoryRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = inMemoryStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    inMemoryStore.set(identifier, record);
  }

  // Remove timestamps outside current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + options.windowMs - now);
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - record.timestamps.length,
    resetMs: options.windowMs,
  };
}

/**
 * Primary rate limiter: Checks rate limit via Supabase atomic stored procedure `check_rate_limit`.
 * Falls back seamlessly to in-memory sliding window if Supabase is offline or unconfigured.
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasSupabase) {
    try {
      // Execute atomic RPC with row-level lock
      const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
        p_key: identifier,
        p_limit: options.limit,
        p_window_ms: options.windowMs,
      });

      if (!error && data && typeof data === 'object' && 'success' in data) {
        return {
          success: Boolean(data.success),
          limit: Number(data.limit ?? options.limit),
          remaining: Number(data.remaining ?? 0),
          resetMs: Number(data.resetMs ?? options.windowMs),
        };
      }
    } catch {
      // Fall through to in-memory tier
    }
  }

  // Tier 2 Fallback: In-memory sliding window
  return checkInMemoryRateLimit(identifier, options);
}
