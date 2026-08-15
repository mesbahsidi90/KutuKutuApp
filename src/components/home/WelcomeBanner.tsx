"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";

export function WelcomeBanner() {
  const { locale, t } = useLocale();

  return (
    <section className="bg-gradient-to-br from-brand-light via-background to-accent/20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
        <h1 className="max-w-2xl text-4xl font-bold text-brand-dark sm:text-5xl">
          {t("home.welcomeTitle")}
        </h1>
        <p className="max-w-xl text-lg text-foreground/80">{t("home.welcomeSubtitle")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/customize`}
            className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("home.startDesigning")}
          </Link>
          <Link
            href={`/${locale}/customize`}
            className="rounded-full border border-brand/30 px-6 py-3 font-semibold text-brand-dark transition-colors hover:bg-brand-light"
          >
            {t("home.buildCustomCake")}
          </Link>
        </div>
      </div>
    </section>
  );
}
