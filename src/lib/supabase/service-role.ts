import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypasses RLS. Never import this from a Client Component or expose the
// service-role key to the browser. Reserved for trusted server-only paths:
// the payment gateway callback and admin asset management helpers that
// already perform their own authorization checks.
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
