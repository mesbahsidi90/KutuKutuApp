"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";

// The order is now placed -- clear the persisted cart so the customer
// doesn't see stale items if they navigate back to /cart.
export function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
