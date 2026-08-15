"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Color } from "@/types/catalog";

export function ColorSwatch({
  color,
  selected,
  onSelect,
}: {
  color: Color;
  selected: boolean;
  onSelect: () => void;
}) {
  const { locale } = useLocale();
  const name = pickLocale(locale, color.name_ar, color.name_en, color.name_fr);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={name}
      title={name}
      className={`h-10 w-10 rounded-full border-2 transition-transform ${
        selected ? "border-brand scale-110" : "border-black/10 hover:scale-105"
      }`}
      style={{ backgroundColor: color.hex }}
    />
  );
}
