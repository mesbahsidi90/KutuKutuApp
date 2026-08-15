"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export function FreeDeliveryBanner({ subtotal }: { subtotal: number }) {
  const { t } = useLocale();
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="rounded-xl border border-black/10 p-4">
      <p className="mb-2 text-sm font-medium text-foreground">
        {remaining > 0
          ? t("cart.freeDeliveryProgress", { amount: remaining, currency: t("common.currency") })
          : t("cart.freeDeliveryUnlocked")}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
