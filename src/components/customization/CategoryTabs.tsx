"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { categoryLabel } from "@/lib/catalog-categories";

export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          active === null ? "bg-brand text-white" : "bg-black/5 text-foreground/70 hover:bg-black/10"
        }`}
      >
        {t("customization.allCategories")}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === category
              ? "bg-brand text-white"
              : "bg-black/5 text-foreground/70 hover:bg-black/10"
          }`}
        >
          {categoryLabel(t, category)}
        </button>
      ))}
    </div>
  );
}
