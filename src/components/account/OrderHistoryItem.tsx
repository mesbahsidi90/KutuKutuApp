"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import type { Order } from "@/types/order";

export function OrderHistoryItem({ order }: { order: Order }) {
  const { locale, t } = useLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(order.created_at)
  );

  return (
    <li className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">
          {t("account.orderNumber")} {order.order_number}
        </span>
        <span className="text-xs text-foreground/50">{t("account.orderDate", { date })}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-medium text-brand-dark">
          {order.total} {t("common.currency")}
        </span>
        <span className="text-xs text-foreground/60">{t(`orderStatuses.${order.status}`)}</span>
      </div>
    </li>
  );
}
