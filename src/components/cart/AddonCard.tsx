"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { useCartStore } from "@/lib/store/cart-store";
import type { Addon } from "@/types/catalog";

export function AddonCard({ addon }: { addon: Addon }) {
  const { locale, t } = useLocale();
  const [imageError, setImageError] = useState(false);
  const addAddon = useCartStore((s) => s.addAddon);
  const name = pickLocale(locale, addon.name_ar, addon.name_en, addon.name_fr);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/10">
      <div className="flex aspect-square items-center justify-center bg-brand-light">
        {addon.image_url && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={addon.image_url}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="px-2 text-center text-sm text-brand-dark/50">{name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-sm text-brand-dark">
          {addon.price} {t("common.currency")}
        </span>
        <button
          type="button"
          onClick={() => addAddon({ addonId: addon.id, name, price: addon.price })}
          className="mt-1 rounded-full border border-brand/30 py-1.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-light"
        >
          {t("common.add")}
        </button>
      </div>
    </div>
  );
}
