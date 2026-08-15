import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";
import type { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("getCurrentUser failed", err);
    return null;
  }
}

// RLS-respecting: orders_read_own only returns rows where user_id = auth.uid(),
// so this naturally can't leak another customer's orders.
export async function getMyOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Order[]) ?? [];
  } catch (err) {
    console.error("getMyOrders failed", err);
    return [];
  }
}
