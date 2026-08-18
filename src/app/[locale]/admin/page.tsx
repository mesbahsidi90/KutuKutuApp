import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export default async function AdminIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  redirect(`/${locale}/admin/orders`);
}
