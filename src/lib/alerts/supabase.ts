import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-only Supabase client. Uses the Secret Key (the successor to
// the legacy service_role JWT) which bypasses RLS — never import this
// from a client component.
let cached: SupabaseClient | null = null;

export function alertsDb(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SECRET_KEY are required for job alerts.'
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cached;
}

export type AlertStatus = 'pending' | 'active' | 'unsubscribed';

export type AlertSubscriber = {
  id: string;
  email: string;
  status: AlertStatus;
  filters: Record<string, unknown>;
  confirm_token: string | null;
  unsubscribe_token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  last_digest_at: string | null;
};
