import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Locale } from "@/lib/i18n/config";
import type { Order, OrderItem, OrderAddon } from "@/types/order";
import type { Shape, Flavor, Design, Addon } from "@/types/catalog";

export interface OrderItemDisplay extends OrderItem {
  shapeName: string;
  flavorName: string;
  designName: string | null;
}

export interface OrderAddonDisplay extends OrderAddon {
  name: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItemDisplay[];
  addons: OrderAddonDisplay[];
}

// Used by the confirmation page, which a guest (no session) may land on
// right after paying -- reads via the service-role client since a guest
// order has no owning user to satisfy the RLS read policy. Scoped to
// status = 'confirmed' only, so a guessed/incremented order number can't
// be used to peek at someone else's pending or cancelled order.
export async function getConfirmedOrderByNumber(
  orderNumber: string,
  locale: Locale
): Promise<OrderWithItems | null> {
  try {
    return await fetchConfirmedOrder(orderNumber, locale);
  } catch (err) {
    console.error("getConfirmedOrderByNumber failed", err);
    return null;
  }
}

async function fetchConfirmedOrder(
  orderNumber: string,
  locale: Locale
): Promise<OrderWithItems | null> {
  const supabase = createServiceRoleClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("status", "confirmed")
    .maybeSingle();

  if (!order) return null;

  const [{ data: items }, { data: addons }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id),
    supabase.from("order_addons").select("*").eq("order_id", order.id),
  ]);

  const shapeIds = [...new Set((items ?? []).map((i) => i.shape_id))];
  const flavorIds = [...new Set((items ?? []).map((i) => i.flavor_id))];
  const designIds = [...new Set((items ?? []).map((i) => i.design_id).filter((id): id is string => !!id))];
  const addonIds = [...new Set((addons ?? []).map((a) => a.addon_id))];

  const [{ data: shapes }, { data: flavors }, { data: designs }, { data: addonRows }] =
    await Promise.all([
      shapeIds.length ? supabase.from("shapes").select("*").in("id", shapeIds) : Promise.resolve({ data: [] }),
      flavorIds.length
        ? supabase.from("flavors").select("*").in("id", flavorIds)
        : Promise.resolve({ data: [] }),
      designIds.length
        ? supabase.from("designs").select("*").in("id", designIds)
        : Promise.resolve({ data: [] }),
      addonIds.length
        ? supabase.from("addons").select("*").in("id", addonIds)
        : Promise.resolve({ data: [] }),
    ]);

  const shapeById = new Map((shapes as Shape[] | null)?.map((s) => [s.id, s]));
  const flavorById = new Map((flavors as Flavor[] | null)?.map((f) => [f.id, f]));
  const designById = new Map((designs as Design[] | null)?.map((d) => [d.id, d]));
  const addonById = new Map((addonRows as Addon[] | null)?.map((a) => [a.id, a]));

  const displayItems: OrderItemDisplay[] = ((items as OrderItem[]) ?? []).map((item) => {
    const shape = shapeById.get(item.shape_id);
    const flavor = flavorById.get(item.flavor_id);
    const design = item.design_id ? designById.get(item.design_id) : undefined;
    return {
      ...item,
      shapeName: shape ? pickLocale(locale, shape.name_ar, shape.name_en, shape.name_fr) : "",
      flavorName: flavor ? pickLocale(locale, flavor.name_ar, flavor.name_en, flavor.name_fr) : "",
      designName: design ? pickLocale(locale, design.name_ar, design.name_en, design.name_fr) : null,
    };
  });

  const displayAddons: OrderAddonDisplay[] = ((addons as OrderAddon[]) ?? []).map((line) => {
    const addon = addonById.get(line.addon_id);
    return {
      ...line,
      name: addon ? pickLocale(locale, addon.name_ar, addon.name_en, addon.name_fr) : "",
    };
  });

  return { order: order as Order, items: displayItems, addons: displayAddons };
}
