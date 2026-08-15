"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { CategoryTabs } from "@/components/customization/CategoryTabs";
import { DesignSwatch } from "@/components/customization/DesignSwatch";
import type { Design } from "@/types/catalog";

export function DesignStep({ designs }: { designs: Design[] }) {
  const { t } = useLocale();
  const draft = useCustomizationStore((s) => s.draft);
  const setDraft = useCustomizationStore((s) => s.setDraft);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(designs.map((d) => d.category))),
    [designs]
  );

  const visibleDesigns = activeCategory
    ? designs.filter((d) => d.category === activeCategory)
    : designs;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("customization.chooseDesign")}
      </h2>
      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleDesigns.map((design) => (
          <DesignSwatch
            key={design.id}
            design={design}
            selected={draft.designId === design.id}
            onSelect={() =>
              setDraft({ designId: draft.designId === design.id ? null : design.id })
            }
          />
        ))}
      </div>
    </div>
  );
}
