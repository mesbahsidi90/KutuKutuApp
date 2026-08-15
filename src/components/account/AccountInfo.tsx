"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { SignOutButton } from "./SignOutButton";

export function AccountInfo({ email }: { email: string }) {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between rounded-xl border border-black/10 p-4">
      <div>
        <p className="text-xs text-foreground/50">{t("account.title")}</p>
        <p className="font-medium text-foreground">{email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
