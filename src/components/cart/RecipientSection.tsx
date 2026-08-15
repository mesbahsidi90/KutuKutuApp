"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore } from "@/lib/store/cart-store";
import { MapPicker } from "./MapPicker";

export function RecipientSection() {
  const { t } = useLocale();
  const recipient = useCartStore((s) => s.recipient);
  const setRecipient = useCartStore((s) => s.setRecipient);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">{t("cart.recipientTitle")}</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
          {t("cart.recipientAddress")}
        </label>
        <input
          type="text"
          value={recipient.address}
          onChange={(e) => setRecipient({ address: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">{t("cart.pickOnMap")}</label>
        <MapPicker
          lat={recipient.lat}
          lng={recipient.lng}
          onPick={(lat, lng) => setRecipient({ lat, lng })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={recipient.hideIdentity}
          onChange={(e) => setRecipient({ hideIdentity: e.target.checked })}
        />
        {t("cart.hideIdentity")}
      </label>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">{t("cart.noteToStore")}</label>
        <textarea
          value={recipient.noteToStore}
          onChange={(e) => setRecipient({ noteToStore: e.target.value })}
          placeholder={t("cart.noteToStorePlaceholder")}
          rows={2}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </div>
    </section>
  );
}
