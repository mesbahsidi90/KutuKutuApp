"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore } from "@/lib/store/cart-store";

export function SelectedAddonsList() {
  const { t } = useLocale();
  const addons = useCartStore((s) => s.addons);
  const updateAddonQuantity = useCartStore((s) => s.updateAddonQuantity);
  const removeAddon = useCartStore((s) => s.removeAddon);

  if (addons.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {addons.map((addon) => (
        <li
          key={addon.addonId}
          className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <span className="text-foreground">{addon.name}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateAddonQuantity(addon.addonId, addon.quantity - 1)}
                className="h-6 w-6 rounded-full border border-black/10"
              >
                -
              </button>
              <span className="w-4 text-center">{addon.quantity}</span>
              <button
                type="button"
                onClick={() => updateAddonQuantity(addon.addonId, addon.quantity + 1)}
                className="h-6 w-6 rounded-full border border-black/10"
              >
                +
              </button>
            </div>
            <span className="font-medium text-brand-dark">
              {addon.price * addon.quantity} {t("common.currency")}
            </span>
            <button
              type="button"
              onClick={() => removeAddon(addon.addonId)}
              className="text-foreground/40 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
