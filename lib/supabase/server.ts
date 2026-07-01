import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients.
 *
 * Two factories, least-privilege first:
 *   - {@link createPublicServerClient} uses the publishable (anon) key and is
 *     subject to Row Level Security. The public contact form insert runs through
 *     this, relying on the `contact_queries_public_insert` policy.
 *   - {@link createAdminServerClient} uses the secret service-role key and
 *     BYPASSES RLS. Server-only, for future admin/darkroom features. Never import
 *     this into a Client Component.
 *
 * Clients are created per call (no shared mutable auth state) and never persist
 * a session, since these run in stateless server actions / route handlers.
 *
 * @module lib/supabase/server
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const NO_SESSION = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/** True when the public Supabase environment is configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(URL && ANON_KEY);
}

/** Anon-key client. Subject to RLS. Used for the public contact insert. */
export function createPublicServerClient(): SupabaseClient {
  if (!URL || !ANON_KEY) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createClient(URL, ANON_KEY, NO_SESSION);
}

/** Service-role client. BYPASSES RLS. Server-only, admin use. */
export function createAdminServerClient(): SupabaseClient {
  if (!URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase admin is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(URL, SERVICE_ROLE_KEY, NO_SESSION);
}
