"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore } from "@/lib/store/cart-store";

export function OrderMessageSection() {
  const { t } = useLocale();
  const orderMessage = useCartStore((s) => s.orderMessage);
  const setOrderMessage = useCartStore((s) => s.setOrderMessage);

  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{t("cart.yourMessageTitle")}</h2>
      <textarea
        value={orderMessage}
        onChange={(e) => setOrderMessage(e.target.value)}
        placeholder={t("cart.yourMessagePlaceholder")}
        rows={2}
        className="w-full rounded-md border border-black/10 px-3 py-2"
      />
    </section>
  );
}
