"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore } from "@/lib/store/cart-store";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const { locale, t } = useLocale();
  const itemCount = useCartStore((s) => s.items.reduce((n, it) => n + it.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="text-lg font-bold text-brand-dark">
          {t("common.appName")}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link href={`/${locale}`}>{t("nav.home")}</Link>
          <Link href={`/${locale}/account`}>{t("nav.account")}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/cart`}
            className="relative rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5"
          >
            {t("nav.cart")}
            {itemCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
