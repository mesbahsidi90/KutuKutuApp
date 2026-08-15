"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";

export function EmptyCart() {
  const { locale, t } = useLocale();

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-lg text-foreground/60">{t("cart.empty")}</p>
      <Link
        href={`/${locale}/customize`}
        className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        {t("cart.emptyCta")}
      </Link>
    </div>
  );
}
