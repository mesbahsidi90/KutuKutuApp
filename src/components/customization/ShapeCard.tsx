"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Shape } from "@/types/catalog";

export function ShapeCard({
  shape,
  selected,
  onSelect,
}: {
  shape: Shape;
  selected: boolean;
  onSelect: () => void;
}) {
  const { locale, t } = useLocale();
  const [imageError, setImageError] = useState(false);
  const name = pickLocale(locale, shape.name_ar, shape.name_en, shape.name_fr);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col overflow-hidden rounded-xl border-2 text-start transition-colors ${
        selected ? "border-brand" : "border-black/10 hover:border-black/20"
      }`}
    >
      <div className="flex aspect-square items-center justify-center bg-brand-light">
        {shape.image_url && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shape.image_url}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="px-2 text-center text-sm text-brand-dark/50">{name}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <span className="font-semibold text-foreground">{name}</span>
        <span className="text-xs text-foreground/60">
          {t("common.servings")}: {shape.servings_range} &middot; {shape.weight_kg}kg
        </span>
        <span className="text-sm font-semibold text-brand-dark">
          {t("common.priceFrom", { price: shape.base_price, currency: t("common.currency") })}
        </span>
      </div>
    </button>
  );
}
