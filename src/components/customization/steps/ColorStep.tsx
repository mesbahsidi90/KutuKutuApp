"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { ColorSwatch } from "@/components/customization/ColorSwatch";
import type { Color } from "@/types/catalog";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function ColorStep({ colors }: { colors: Color[] }) {
  const { t } = useLocale();
  const draft = useCustomizationStore((s) => s.draft);
  const setDraft = useCustomizationStore((s) => s.setDraft);

  const isCustom = draft.colorHex !== null && !colors.some((c) => c.hex === draft.colorHex);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("customization.chooseColor")}
      </h2>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <ColorSwatch
            key={color.id}
            color={color}
            selected={draft.colorHex === color.hex}
            onSelect={() => setDraft({ colorHex: color.hex })}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-black/10 p-3">
        <input
          type="color"
          value={HEX_RE.test(draft.colorHex ?? "") ? draft.colorHex! : "#ffffff"}
          onChange={(e) => setDraft({ colorHex: e.target.value })}
          aria-label={t("customization.customColor")}
          className={`h-10 w-10 shrink-0 rounded-full border-2 ${
            isCustom ? "border-brand" : "border-black/10"
          }`}
        />
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            {t("customization.customColor")}
          </label>
          <input
            type="text"
            inputMode="text"
            placeholder="#f4c2c2"
            value={draft.colorHex ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setDraft({ colorHex: value });
            }}
            className="w-32 rounded-md border border-black/10 px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
