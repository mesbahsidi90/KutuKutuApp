"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const { locale, t } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return <p className="text-sm text-foreground/70">{t("account.checkEmailForLink")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{t("account.emailLabel")}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        {t("account.signIn")}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">{t("account.signInError")}</p>
      )}
    </form>
  );
}
