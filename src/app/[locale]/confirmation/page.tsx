import { getConfirmedOrderByNumber } from "@/lib/supabase/queries/orders";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { ConfirmationContent } from "@/components/confirmation/ConfirmationContent";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { order: orderNumber } = await searchParams;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const data = orderNumber ? await getConfirmedOrderByNumber(orderNumber, locale) : null;

  if (!data) {
    const dict = await getDictionary(locale);
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center text-foreground/60">
        {dict.confirmation.notFound}
      </div>
    );
  }

  return <ConfirmationContent data={data} />;
}
