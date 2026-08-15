"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { categoryLabel } from "@/lib/catalog-categories";
import type { ReadyMadeCake } from "@/types/catalog";
import { ReadyMadeCakeCard } from "./ReadyMadeCakeCard";

export function ReadyMadeSection({
  category,
  cakes,
}: {
  category: string;
  cakes: ReadyMadeCake[];
}) {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-xl font-bold text-foreground">{categoryLabel(t, category)}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cakes.map((cake) => (
          <ReadyMadeCakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </section>
  );
}
