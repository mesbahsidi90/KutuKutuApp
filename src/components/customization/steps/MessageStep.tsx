"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { MESSAGE_MAX_LENGTH, PRINT_PHOTO_FEE } from "@/lib/constants";

export function MessageStep() {
  const { t } = useLocale();
  const draft = useCustomizationStore((s) => s.draft);
  const setDraft = useCustomizationStore((s) => s.setDraft);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setDraft({ photoPrintDataUrl: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraft({ photoPrintDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("customization.messageLabel")}
        </label>
        <input
          type="text"
          maxLength={MESSAGE_MAX_LENGTH}
          value={draft.messageText}
          placeholder={t("customization.messagePlaceholder")}
          onChange={(e) => setDraft({ messageText: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
        <p className="mt-1 text-xs text-foreground/50">
          {t("customization.messageCharsLeft", {
            count: MESSAGE_MAX_LENGTH - draft.messageText.length,
          })}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("customization.attachPhoto")}
        </label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
        <p className="mt-1 text-xs text-foreground/50">
          {t("customization.attachPhotoFee", {
            price: PRINT_PHOTO_FEE,
            currency: t("common.currency"),
          })}
        </p>
        {draft.photoPrintDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={draft.photoPrintDataUrl}
            alt=""
            className="mt-2 h-20 w-20 rounded-md object-cover"
          />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("customization.additionalInstructions")}
        </label>
        <textarea
          value={draft.additionalInstructions}
          placeholder={t("customization.additionalInstructionsPlaceholder")}
          onChange={(e) => setDraft({ additionalInstructions: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </div>
    </div>
  );
}
