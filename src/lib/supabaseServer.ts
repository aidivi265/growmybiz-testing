import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.replace(/^[\uFEFF\s'"]+|[\uFEFF\s'"]+$/g, '');
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseServiceRoleKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY] Supabase URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
  }
}

/**
 * Administrative Supabase Client (bypasses RLS, strictly for server-side API routes).
 * Enforced with 'server-only' to guarantee it is NEVER bundled or exposed in client bundles.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
