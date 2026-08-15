"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "./get-dictionary";
import type { Locale } from "./config";
import { dirFor } from "./config";
import { t as translate } from "./translate";

interface LocaleContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  dict: Dictionary;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: dirFor(locale),
      dict,
      t: (key, vars) => translate(dict, key, vars),
    }),
    [locale, dict]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}
