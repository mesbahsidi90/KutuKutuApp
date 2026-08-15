"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Flavor } from "@/types/catalog";

export function FlavorCard({
  flavor,
  selected,
  onSelect,
}: {
  flavor: Flavor;
  selected: boolean;
  onSelect: () => void;
}) {
  const { locale, t } = useLocale();
  const [imageError, setImageError] = useState(false);
  const name = pickLocale(locale, flavor.name_ar, flavor.name_en, flavor.name_fr);
  const description = pickLocale(
    locale,
    flavor.description_ar,
    flavor.description_en,
    flavor.description_fr
  );

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
        {flavor.image_url && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={flavor.image_url}
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
        {description && <p className="line-clamp-2 text-xs text-foreground/60">{description}</p>}
        {flavor.extra_price > 0 && (
          <span className="text-sm font-semibold text-brand-dark">
            +{flavor.extra_price} {t("common.currency")}
          </span>
        )}
      </div>
    </button>
  );
}
