"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { ReadyMadeCake } from "@/types/catalog";

export function ReadyMadeCakeCard({ cake }: { cake: ReadyMadeCake }) {
  const { locale, t } = useLocale();
  const name = pickLocale(locale, cake.name_ar, cake.name_en, cake.name_fr);
  const description = pickLocale(
    locale,
    cake.description_ar,
    cake.description_en,
    cake.description_fr
  );

  return (
    <Link
      href={`/${locale}/customize?readyMade=${cake.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-background transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-light">
        {cake.image_url ? (
          <Image
            src={cake.image_url}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 640px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-brand-dark/50">
            {name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-foreground">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-foreground/60">{description}</p>
        )}
        <p className="mt-auto pt-2 font-semibold text-brand-dark">
          {t("common.priceFrom", { price: cake.price, currency: t("common.currency") })}
        </p>
      </div>
    </Link>
  );
}
