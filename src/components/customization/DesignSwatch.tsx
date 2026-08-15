"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { designThumbnailUrl } from "@/lib/supabase/asset-url";
import type { Design } from "@/types/catalog";

export function DesignSwatch({
  design,
  selected,
  onSelect,
}: {
  design: Design;
  selected: boolean;
  onSelect: () => void;
}) {
  const { locale, t } = useLocale();
  const [imageError, setImageError] = useState(false);
  const name = pickLocale(locale, design.name_ar, design.name_en, design.name_fr);

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
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={designThumbnailUrl(design.id)}
            alt={name}
            className="h-full w-full object-contain p-2"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="px-2 text-center text-sm text-brand-dark/50">{name}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <span className="font-semibold text-foreground">{name}</span>
        {design.extra_price > 0 && (
          <span className="text-sm font-semibold text-brand-dark">
            +{design.extra_price} {t("common.currency")}
          </span>
        )}
      </div>
    </button>
  );
}
