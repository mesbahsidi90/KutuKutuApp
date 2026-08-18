import { getAllOrders } from "@/lib/admin/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const orders = await getAllOrders();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">{dict.admin.orders}</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
