"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import type { Order } from "@/types/order";
import { OrderHistoryItem } from "./OrderHistoryItem";

export function OrderHistoryList({ orders }: { orders: Order[] }) {
  const { t } = useLocale();

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{t("account.orderHistory")}</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-foreground/60">{t("account.noOrders")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}
