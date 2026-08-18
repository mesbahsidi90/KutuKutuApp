"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";

const LINKS = [
  { href: "orders", labelKey: "admin.orders" },
  { href: "shapes", labelKey: "admin.shapes" },
  { href: "flavors", labelKey: "admin.flavors" },
  { href: "colors", labelKey: "admin.colors" },
  { href: "designs", labelKey: "admin.designs" },
  { href: "addons", labelKey: "admin.addons" },
];

export function AdminNav() {
  const { locale, t } = useLocale();
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-black/10 pb-3">
      {LINKS.map((link) => {
        const href = `/${locale}/admin/${link.href}`;
        const active = pathname === href;
        return (
          <Link
            key={link.href}
            href={href}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-brand text-white" : "bg-black/5 text-foreground/70 hover:bg-black/10"
            }`}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
