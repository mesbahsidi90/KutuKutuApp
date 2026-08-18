import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | null;
}

// Server-side admin check, backed by public.users.role -- the same check
// RLS policies use via is_admin(), so this is a UX gate, not the actual
// security boundary (the DB still enforces it on every write).
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") return null;

    return { id: user.id, email: user.email ?? null };
  } catch (err) {
    console.error("getAdminUser failed", err);
    return null;
  }
}
