"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const { t } = useLocale();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5"
    >
      {t("account.signOut")}
    </button>
  );
}
