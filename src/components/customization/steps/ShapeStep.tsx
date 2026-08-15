"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { ShapeCard } from "@/components/customization/ShapeCard";
import type { Shape } from "@/types/catalog";

export function ShapeStep({ shapes }: { shapes: Shape[] }) {
  const { t } = useLocale();
  const draft = useCustomizationStore((s) => s.draft);
  const setDraft = useCustomizationStore((s) => s.setDraft);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("customization.chooseShape")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shapes.map((shape) => (
          <ShapeCard
            key={shape.id}
            shape={shape}
            selected={draft.shapeId === shape.id}
            onSelect={() => setDraft({ shapeId: shape.id })}
          />
        ))}
      </div>
    </div>
  );
}
