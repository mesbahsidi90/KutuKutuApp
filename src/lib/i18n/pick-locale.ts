import type { Locale } from "./config";

export function pickLocale(locale: Locale, ar: string, en: string, fr: string): string {
  return { ar, en, fr }[locale];
}
