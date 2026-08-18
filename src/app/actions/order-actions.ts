"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/queries/admin-auth";
import type { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized" };
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    return { success: false, error: "Invalid status" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/[locale]/admin/orders", "page");
  return { success: true };
}
