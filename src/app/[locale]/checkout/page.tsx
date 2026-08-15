import { Suspense } from "react";
import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageContent />
    </Suspense>
  );
}
