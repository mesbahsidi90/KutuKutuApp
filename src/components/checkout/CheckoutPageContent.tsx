"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore, selectSubtotal, selectDeliveryFee } from "@/lib/store/cart-store";
import type { PaymentMethod } from "@/types/order";
import { CheckoutSummary } from "./CheckoutSummary";
import { RecipientForm, type RecipientFormErrors } from "./RecipientForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { EmptyCart } from "@/components/cart/EmptyCart";

export function CheckoutPageContent() {
  const { locale, t } = useLocale();
  const searchParams = useSearchParams();
  const paymentFailed = searchParams.get("paymentFailed") === "1";

  const items = useCartStore((s) => s.items);
  const addons = useCartStore((s) => s.addons);
  const orderMessage = useCartStore((s) => s.orderMessage);
  const recipient = useCartStore((s) => s.recipient);
  const subtotal = useCartStore(selectSubtotal);
  const deliveryFee = selectDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [errors, setErrors] = useState<RecipientFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  if (items.length === 0) return <EmptyCart />;

  function validate(): boolean {
    const nextErrors: RecipientFormErrors = {};
    if (!recipient.name.trim()) nextErrors.name = t("checkout.validation.nameRequired");
    if (recipient.phone.trim().length < 6) nextErrors.phone = t("checkout.validation.phoneInvalid");
    if (!recipient.address.trim()) nextErrors.address = t("checkout.validation.addressRequired");
    if (!recipient.city.trim()) nextErrors.city = t("checkout.validation.cityRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handlePay() {
    setSubmitError(false);
    if (!paymentMethod) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/payment/initiate?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            shapeId: item.shapeId,
            flavorId: item.flavorId,
            colorHex: item.colorHex,
            designId: item.designId,
            messageText: item.messageText,
            photoPrintDataUrl: item.photoPrintDataUrl,
            additionalInstructions: item.additionalInstructions,
            quantity: item.quantity,
            previewFrontUrl: item.previewFrontUrl,
            previewTopUrl: item.previewTopUrl,
            previewSlicedUrl: item.previewSlicedUrl,
          })),
          addons: addons.map((a) => ({ addonId: a.addonId, quantity: a.quantity })),
          orderMessage,
          recipient,
          paymentMethod,
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");
      const data = (await response.json()) as { formUrl: string };
      window.location.href = data.formUrl;
    } catch {
      setSubmitError(true);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-foreground">{t("checkout.title")}</h1>

        {(paymentFailed || submitError) && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("checkout.paymentFailed")}
          </p>
        )}

        <RecipientForm errors={errors} />
        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <div className="flex flex-col gap-4">
        <CheckoutSummary />
        <button
          type="button"
          onClick={handlePay}
          disabled={!paymentMethod || submitting}
          className="rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting
            ? t("checkout.redirectingToGateway")
            : t("checkout.payButton", { amount: total, currency: t("common.currency") })}
        </button>
      </div>
    </div>
  );
}
