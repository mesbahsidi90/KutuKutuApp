"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { updateOrderStatus } from "@/app/actions/order-actions";
import type { Order, OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, status: string) {
    setPendingId(orderId);
    await updateOrderStatus(orderId, status);
    setPendingId(null);
    router.refresh();
  }

  if (orders.length === 0) {
    return <p className="text-sm text-foreground/60">{t("admin.noOrders")}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {orders.map((order) => {
        const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(order.created_at)
        );
        return (
          <li
            key={order.id}
            className="flex flex-col gap-2 rounded-lg border border-black/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground">{order.order_number}</span>
              <span className="text-xs text-foreground/50">{date}</span>
              <span className="text-xs text-foreground/60">
                {t("admin.orderCustomer")}: {order.recipient_name} &middot; {order.recipient_phone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-brand-dark">
                {order.total} {t("common.currency")}
              </span>
              <span className="text-xs text-foreground/60">
                {t("admin.orderPayment")}: {order.payment_method ?? "-"} ({order.payment_status})
              </span>
              <select
                value={order.status}
                disabled={pendingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="rounded-md border border-black/10 px-2 py-1 text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t(`orderStatuses.${status}`)}
                  </option>
                ))}
              </select>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
