import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/queries/admin-auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  const admin = await getAdminUser();

  if (!admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="mb-4 text-foreground/70">{dict.admin.notAuthorized}</p>
        <Link href={`/${locale}`} className="text-brand-dark underline">
          {dict.confirmation.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground/50">
        {dict.admin.title}
      </p>
      <div className="flex flex-col gap-6">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
