"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-provider";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${next}${rest}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 p-1 text-sm">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            l === locale
              ? "bg-brand text-white"
              : "text-foreground/70 hover:bg-black/5"
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
