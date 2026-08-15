"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore, cartItemLineTotal, selectSubtotal, selectDeliveryFee } from "@/lib/store/cart-store";

export function CheckoutSummary() {
  const { t } = useLocale();
  const items = useCartStore((s) => s.items);
  const addons = useCartStore((s) => s.addons);
  const subtotal = useCartStore(selectSubtotal);
  const deliveryFee = selectDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 p-4">
      <h2 className="text-lg font-semibold text-foreground">{t("checkout.orderSummary")}</h2>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-foreground/80">
              {item.shapeName} &times; {item.quantity}
            </span>
            <span className="font-medium text-foreground">
              {cartItemLineTotal(item)} {t("common.currency")}
            </span>
          </li>
        ))}
        {addons.map((addon) => (
          <li key={addon.addonId} className="flex justify-between text-sm">
            <span className="text-foreground/80">
              {addon.name} &times; {addon.quantity}
            </span>
            <span className="font-medium text-foreground">
              {addon.price * addon.quantity} {t("common.currency")}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-t border-black/10 pt-3 text-sm">
        <div className="flex justify-between text-foreground/70">
          <span>{t("cart.subtotal")}</span>
          <span>
            {subtotal} {t("common.currency")}
          </span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>{t("cart.deliveryFee")}</span>
          <span>
            {deliveryFee} {t("common.currency")}
          </span>
        </div>
        <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
          <span>{t("cart.total")}</span>
          <span>
            {total} {t("common.currency")}
          </span>
        </div>
      </div>
    </div>
  );
}
