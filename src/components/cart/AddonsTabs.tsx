"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Addon, AddonType } from "@/types/catalog";
import { AddonCard } from "./AddonCard";

const TABS: { type: AddonType; labelKey: string }[] = [
  { type: "candle", labelKey: "cart.addonsCandles" },
  { type: "card", labelKey: "cart.addonsCards" },
  { type: "topper", labelKey: "cart.addonsToppers" },
];

export function AddonsTabs({ addons }: { addons: Addon[] }) {
  const { t } = useLocale();
  const [activeType, setActiveType] = useState<AddonType>("candle");

  const visibleAddons = addons.filter((a) => a.type === activeType);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{t("cart.addonsTitle")}</h2>
      <div className="mb-4 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => setActiveType(tab.type)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeType === tab.type
                ? "bg-brand text-white"
                : "bg-black/5 text-foreground/70 hover:bg-black/10"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {visibleAddons.map((addon) => (
          <AddonCard key={addon.id} addon={addon} />
        ))}
      </div>
    </section>
  );
}
