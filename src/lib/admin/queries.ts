import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CatalogTable } from "./catalog-schemas";
import type { Order } from "@/types/order";

// Admin session satisfies the catalog RLS read policy's is_admin() branch,
// so this naturally returns inactive rows too (customers only ever see
// active = true).
export async function getAllCatalogRows<T>(table: CatalogTable): Promise<T[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as T[]) ?? [];
  } catch (err) {
    console.error(`getAllCatalogRows(${table}) failed`, err);
    return [];
  }
}

// Admin session satisfies orders_read_own's is_admin() branch, so this
// returns every order, not just the admin's own.
export async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Order[]) ?? [];
  } catch (err) {
    console.error("getAllOrders failed", err);
    return [];
  }
}
