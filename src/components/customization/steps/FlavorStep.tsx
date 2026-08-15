"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { FlavorCard } from "@/components/customization/FlavorCard";
import type { Flavor } from "@/types/catalog";

export function FlavorStep({ flavors }: { flavors: Flavor[] }) {
  const { t } = useLocale();
  const draft = useCustomizationStore((s) => s.draft);
  const setDraft = useCustomizationStore((s) => s.setDraft);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("customization.chooseFlavor")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {flavors.map((flavor) => (
          <FlavorCard
            key={flavor.id}
            flavor={flavor}
            selected={draft.flavorId === flavor.id}
            onSelect={() => setDraft({ flavorId: flavor.id })}
          />
        ))}
      </div>
    </div>
  );
}
