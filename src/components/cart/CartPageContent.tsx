"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { useCartStore, selectSubtotal } from "@/lib/store/cart-store";
import type { Addon } from "@/types/catalog";
import { CartLineItem } from "./CartLineItem";
import { EmptyCart } from "./EmptyCart";
import { AddonsTabs } from "./AddonsTabs";
import { SelectedAddonsList } from "./SelectedAddonsList";
import { OrderMessageSection } from "./OrderMessageSection";
import { RecipientSection } from "./RecipientSection";
import { FreeDeliveryBanner } from "./FreeDeliveryBanner";
import { PriceSummary } from "./PriceSummary";

export function CartPageContent({ addons }: { addons: Addon[] }) {
  const { t } = useLocale();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">{t("cart.title")}</h1>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <AddonsTabs addons={addons} />
          <SelectedAddonsList />
        </div>

        <OrderMessageSection />
        <RecipientSection />
      </div>

      <div className="flex flex-col gap-4">
        <FreeDeliveryBanner subtotal={subtotal} />
        <PriceSummary />
      </div>
    </div>
  );
}
