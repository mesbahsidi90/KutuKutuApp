"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore, cartItemLineTotal } from "@/lib/store/cart-store";
import type { CartItem } from "@/types/cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const { t } = useLocale();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const previewImage = item.previewFrontUrl ?? item.shapeImageUrl;

  return (
    <div className="flex gap-4 rounded-xl border border-black/10 p-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-light">
        {previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewImage} alt={item.shapeName} className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: item.colorHex }}
            aria-hidden
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-semibold text-foreground">{item.shapeName}</h3>
        <p className="text-sm text-foreground/60">{item.flavorName}</p>
        <div className="flex items-center gap-1.5 text-sm text-foreground/60">
          <span
            className="h-3.5 w-3.5 rounded-full border border-black/10"
            style={{ backgroundColor: item.colorHex }}
          />
          <span>{item.colorHex}</span>
        </div>
        {item.designName && <p className="text-sm text-foreground/60">{item.designName}</p>}
        {item.messageText && (
          <p className="text-sm italic text-foreground/70">&ldquo;{item.messageText}&rdquo;</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-7 w-7 rounded-full border border-black/10 text-sm"
              aria-label={t("common.remove")}
            >
              -
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 rounded-full border border-black/10 text-sm"
            >
              +
            </button>
          </div>
          <span className="font-semibold text-brand-dark">
            {cartItemLineTotal(item)} {t("common.currency")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="self-start text-sm text-foreground/40 hover:text-red-600"
        aria-label={t("common.remove")}
      >
        &times;
      </button>
    </div>
  );
}
