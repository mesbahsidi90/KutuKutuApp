import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartAddonLine, RecipientInfo } from "@/types/cart";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  addons: CartAddonLine[];
  orderMessage: string;
  recipient: RecipientInfo;

  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;

  addAddon: (addon: Omit<CartAddonLine, "quantity">) => void;
  updateAddonQuantity: (addonId: string, quantity: number) => void;
  removeAddon: (addonId: string) => void;

  setOrderMessage: (message: string) => void;
  setRecipient: (recipient: Partial<RecipientInfo>) => void;

  clear: () => void;
}

const defaultRecipient: RecipientInfo = {
  name: "",
  phone: "",
  address: "",
  city: "",
  lat: null,
  lng: null,
  hideIdentity: false,
  noteToStore: "",
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addons: [],
      orderMessage: "",
      recipient: defaultRecipient,

      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...item, id: crypto.randomUUID() },
          ],
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((it) => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it))
            .filter((it) => it.quantity > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

      addAddon: (addon) =>
        set((state) => {
          const existing = state.addons.find((a) => a.addonId === addon.addonId);
          if (existing) {
            return {
              addons: state.addons.map((a) =>
                a.addonId === addon.addonId ? { ...a, quantity: a.quantity + 1 } : a
              ),
            };
          }
          return { addons: [...state.addons, { ...addon, quantity: 1 }] };
        }),

      updateAddonQuantity: (addonId, quantity) =>
        set((state) => ({
          addons: state.addons
            .map((a) => (a.addonId === addonId ? { ...a, quantity: Math.max(1, quantity) } : a))
            .filter((a) => a.quantity > 0),
        })),

      removeAddon: (addonId) =>
        set((state) => ({ addons: state.addons.filter((a) => a.addonId !== addonId) })),

      setOrderMessage: (message) => set({ orderMessage: message }),

      setRecipient: (recipient) =>
        set((state) => ({ recipient: { ...state.recipient, ...recipient } })),

      clear: () =>
        set({ items: [], addons: [], orderMessage: "", recipient: defaultRecipient }),
    }),
    { name: "kutukutu-cart" }
  )
);

export function cartItemLineTotal(item: CartItem): number {
  return (item.unitPrice + item.photoPrintFee) * item.quantity;
}

export function selectSubtotal(state: CartState): number {
  const itemsTotal = state.items.reduce((sum, it) => sum + cartItemLineTotal(it), 0);
  const addonsTotal = state.addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
  return itemsTotal + addonsTotal;
}

export function selectDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
}

export function selectAmountToFreeDelivery(subtotal: number): number {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
}
