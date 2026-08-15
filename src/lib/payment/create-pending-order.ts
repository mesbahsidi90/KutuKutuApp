import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { computeUnitPrice } from "@/lib/pricing";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE, PRINT_PHOTO_FEE } from "@/lib/constants";
import type { CheckoutSubmission } from "./order-validation";
import type { Shape, Flavor, Design, Addon } from "@/types/catalog";

export interface PendingOrder {
  orderId: string;
  orderNumber: string;
  total: number;
}

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; contentType: string } {
  const [header, base64] = dataUrl.split(",");
  const contentType = header.match(/data:(.*);base64/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, contentType };
}

// Creates the order (status pending_payment) plus its items/addons, with
// every price recomputed from the live catalog -- client-submitted prices
// are never trusted for money. Runs before redirecting to the payment
// gateway; the order is finalized (status -> confirmed) only once the
// gateway callback independently confirms payment.
export async function createPendingOrder(
  submission: CheckoutSubmission,
  locale: "ar" | "en" | "fr"
): Promise<PendingOrder> {
  const supabase = await createClient();
  const serviceRole = createServiceRoleClient();

  const shapeIds = [...new Set(submission.items.map((i) => i.shapeId))];
  const flavorIds = [...new Set(submission.items.map((i) => i.flavorId))];
  const designIds = [...new Set(submission.items.map((i) => i.designId).filter((id): id is string => !!id))];
  const addonIds = [...new Set(submission.addons.map((a) => a.addonId))];

  const [{ data: shapes }, { data: flavors }, { data: designs }, { data: addons }] =
    await Promise.all([
      supabase.from("shapes").select("*").in("id", shapeIds),
      supabase.from("flavors").select("*").in("id", flavorIds),
      designIds.length
        ? supabase.from("designs").select("*").in("id", designIds)
        : Promise.resolve({ data: [] as Design[] }),
      addonIds.length
        ? supabase.from("addons").select("*").in("id", addonIds)
        : Promise.resolve({ data: [] as Addon[] }),
    ]);

  const shapeById = new Map((shapes as Shape[] | null)?.map((s) => [s.id, s]));
  const flavorById = new Map((flavors as Flavor[] | null)?.map((f) => [f.id, f]));
  const designById = new Map((designs as Design[] | null)?.map((d) => [d.id, d]));
  const addonById = new Map((addons as Addon[] | null)?.map((a) => [a.id, a]));

  const lineItems = submission.items.map((item) => {
    const shape = shapeById.get(item.shapeId);
    const flavor = flavorById.get(item.flavorId);
    if (!shape || !flavor) {
      throw new Error("Order contains an unknown or inactive shape/flavor");
    }
    const design = item.designId ? designById.get(item.designId) ?? null : null;
    const unitPrice = computeUnitPrice(shape, flavor, design);
    const photoPrintFee = item.photoPrintDataUrl ? PRINT_PHOTO_FEE : 0;
    const lineTotal = (unitPrice + photoPrintFee) * item.quantity;
    return { item, unitPrice, photoPrintFee, lineTotal };
  });

  const addonLines = submission.addons.map((a) => {
    const addon = addonById.get(a.addonId);
    if (!addon) throw new Error("Order contains an unknown or inactive add-on");
    return { addon, quantity: a.quantity, lineTotal: addon.price * a.quantity };
  });

  const subtotal =
    lineItems.reduce((sum, l) => sum + l.lineTotal, 0) +
    addonLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "pending_payment",
      currency: "DZD",
      subtotal,
      delivery_fee: deliveryFee,
      total,
      order_message: submission.orderMessage || null,
      recipient_name: submission.recipient.name,
      recipient_phone: submission.recipient.phone,
      recipient_address: submission.recipient.address,
      recipient_city: submission.recipient.city,
      recipient_lat: submission.recipient.lat,
      recipient_lng: submission.recipient.lng,
      hide_identity: submission.recipient.hideIdentity,
      note_to_store: submission.recipient.noteToStore || null,
      payment_method: submission.paymentMethod,
      payment_status: "pending",
    })
    .select("id, order_number, total")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  for (const line of lineItems) {
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        shape_id: line.item.shapeId,
        flavor_id: line.item.flavorId,
        color_hex: line.item.colorHex,
        design_id: line.item.designId,
        message_text: line.item.messageText || null,
        photo_print_fee: line.photoPrintFee,
        additional_instructions: line.item.additionalInstructions || null,
        quantity: line.item.quantity,
        unit_price: line.unitPrice,
        line_total: line.lineTotal,
        preview_front_url: line.item.previewFrontUrl,
        preview_top_url: line.item.previewTopUrl,
        preview_sliced_url: line.item.previewSlicedUrl,
      })
      .select("id")
      .single();

    if (itemError || !orderItem) {
      throw new Error(itemError?.message ?? "Failed to create order item");
    }

    if (line.item.photoPrintDataUrl) {
      const { bytes, contentType } = dataUrlToBytes(line.item.photoPrintDataUrl);
      const ext = contentType.split("/")[1] ?? "png";
      const path = `prints/${orderItem.id}.${ext}`;
      const { error: uploadError } = await serviceRole.storage
        .from("cake-assets")
        .upload(path, bytes, { contentType, upsert: true });
      if (!uploadError) {
        const { data: publicUrl } = serviceRole.storage.from("cake-assets").getPublicUrl(path);
        await supabase
          .from("order_items")
          .update({ photo_print_url: publicUrl.publicUrl })
          .eq("id", orderItem.id);
      }
    }
  }

  if (addonLines.length > 0) {
    const { error: addonsError } = await supabase.from("order_addons").insert(
      addonLines.map((line) => ({
        order_id: order.id,
        addon_id: line.addon.id,
        quantity: line.quantity,
        unit_price: line.addon.price,
      }))
    );
    if (addonsError) throw new Error(addonsError.message);
  }

  return { orderId: order.id, orderNumber: order.order_number, total: order.total };
}
