"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore, selectSubtotal, selectDeliveryFee } from "@/lib/store/cart-store";

export function PriceSummary() {
  const { locale, t } = useLocale();
  const subtotal = useCartStore(selectSubtotal);
  const deliveryFee = selectDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-black/10 p-4">
      <div className="flex justify-between text-sm text-foreground/70">
        <span>{t("cart.subtotal")}</span>
        <span>
          {subtotal} {t("common.currency")}
        </span>
      </div>
      <div className="flex justify-between text-sm text-foreground/70">
        <span>{t("cart.deliveryFee")}</span>
        <span>
          {deliveryFee} {t("common.currency")}
        </span>
      </div>
      <div className="flex justify-between border-t border-black/10 pt-2 font-semibold text-foreground">
        <span>{t("cart.total")}</span>
        <span>
          {total} {t("common.currency")}
        </span>
      </div>
      <Link
        href={`/${locale}/checkout`}
        className="mt-2 rounded-full bg-brand py-3 text-center font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        {t("cart.proceedToCheckout")}
      </Link>
    </div>
  );
}
