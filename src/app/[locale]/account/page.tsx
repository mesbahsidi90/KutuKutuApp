import { getCurrentUser, getMyOrders } from "@/lib/supabase/queries/account";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { AccountInfo } from "@/components/account/AccountInfo";
import { OrderHistoryList } from "@/components/account/OrderHistoryList";
import { SignInForm } from "@/components/account/SignInForm";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-6 text-2xl font-bold text-foreground">{dict.account.title}</h1>
        <SignInForm />
      </div>
    );
  }

  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{dict.account.title}</h1>
      <div className="flex flex-col gap-8">
        <AccountInfo email={user.email ?? ""} />
        <OrderHistoryList orders={orders} />
      </div>
    </div>
  );
}
