"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { OrderWithItems } from "@/lib/supabase/queries/orders";
import { ClearCartOnMount } from "./ClearCartOnMount";

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(new Date(iso));
}

export function ConfirmationContent({ data }: { data: OrderWithItems }) {
  const { locale, t } = useLocale();
  const { order, items, addons } = data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <ClearCartOnMount />

      <h1 className="mb-2 text-3xl font-bold text-brand-dark">{t("confirmation.title")}</h1>
      <p className="mb-8 text-foreground/70">{t("confirmation.thankYou")}</p>

      <div className="flex flex-col gap-4 rounded-xl border border-black/10 p-6 text-start">
        <div className="flex justify-between border-b border-black/10 pb-3">
          <span className="text-sm text-foreground/60">{t("confirmation.orderNumber")}</span>
          <span className="font-semibold text-foreground">{order.order_number}</span>
        </div>

        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground/80">
                {item.shapeName} ({item.flavorName}) &times; {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                {item.line_total} {t("common.currency")}
              </span>
            </li>
          ))}
          {addons.map((addon) => (
            <li key={addon.id} className="flex justify-between text-sm">
              <span className="text-foreground/80">
                {addon.name} &times; {addon.quantity}
              </span>
              <span className="font-medium text-foreground">
                {addon.unit_price * addon.quantity} {t("common.currency")}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-black/10 pt-3 font-semibold text-foreground">
          <span>{t("cart.total")}</span>
          <span>
            {order.total} {t("common.currency")}
          </span>
        </div>

        {order.estimated_delivery_at && (
          <div className="flex justify-between border-t border-black/10 pt-3">
            <span className="text-sm text-foreground/60">
              {t("confirmation.estimatedDelivery")}
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatDate(order.estimated_delivery_at, locale)}
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/${locale}`}
        className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        {t("confirmation.backToHome")}
      </Link>
    </div>
  );
}
