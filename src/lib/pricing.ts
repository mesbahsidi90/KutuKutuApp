import type { Shape, Flavor, Design } from "@/types/catalog";

// Base cake price = shape base + flavor extra + design extra. The photo
// print fee is tracked separately (see CartItem.photoPrintFee) since it's
// conceptually an add-on charge, not part of the cake itself.
export function computeUnitPrice(
  shape: Shape | undefined,
  flavor: Flavor | undefined,
  design: Design | null | undefined
): number {
  return (shape?.base_price ?? 0) + (flavor?.extra_price ?? 0) + (design?.extra_price ?? 0);
}
