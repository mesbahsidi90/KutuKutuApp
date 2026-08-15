"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore } from "@/lib/store/cart-store";
import { MapPicker } from "@/components/cart/MapPicker";

export interface RecipientFormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export function RecipientForm({ errors }: { errors: RecipientFormErrors }) {
  const { t } = useLocale();
  const recipient = useCartStore((s) => s.recipient);
  const setRecipient = useCartStore((s) => s.setRecipient);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">{t("checkout.recipientDetails")}</h2>

      <Field label={t("checkout.fullName")} error={errors.name}>
        <input
          type="text"
          value={recipient.name}
          onChange={(e) => setRecipient({ name: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </Field>

      <Field label={t("checkout.phone")} error={errors.phone}>
        <input
          type="tel"
          value={recipient.phone}
          onChange={(e) => setRecipient({ phone: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </Field>

      <Field label={t("checkout.address")} error={errors.address}>
        <input
          type="text"
          value={recipient.address}
          onChange={(e) => setRecipient({ address: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </Field>

      <Field label={t("checkout.city")} error={errors.city}>
        <input
          type="text"
          value={recipient.city}
          onChange={(e) => setRecipient({ city: e.target.value })}
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </Field>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
          {t("checkout.deliveryLocation")}
        </label>
        <MapPicker
          lat={recipient.lat}
          lng={recipient.lng}
          onPick={(lat, lng) => setRecipient({ lat, lng })}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
