"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import type { PaymentMethod } from "@/types/order";

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}) {
  const { t } = useLocale();

  const options: { method: PaymentMethod; labelKey: string }[] = [
    { method: "cib", labelKey: "checkout.payWithCib" },
    { method: "edahabia", labelKey: "checkout.payWithEdahabia" },
  ];

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("checkout.paymentMethod")}
      </h2>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.method}
            type="button"
            onClick={() => onChange(option.method)}
            aria-pressed={value === option.method}
            className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              value === option.method
                ? "border-brand bg-brand-light text-brand-dark"
                : "border-black/10 text-foreground/70 hover:border-black/20"
            }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
