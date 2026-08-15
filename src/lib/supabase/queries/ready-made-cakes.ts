import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReadyMadeCake } from "@/types/catalog";

export interface ReadyMadeCategoryGroup {
  category: string;
  cakes: ReadyMadeCake[];
}

// Public catalog read -- degrades to an empty list on any failure (missing
// Supabase config, network error, empty catalog) so the home page always
// renders instead of crashing when the catalog isn't set up yet.
export async function getReadyMadeCakesByCategory(): Promise<ReadyMadeCategoryGroup[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ready_made_cakes")
      .select("*")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    const groups = new Map<string, ReadyMadeCake[]>();
    for (const cake of data as ReadyMadeCake[]) {
      const list = groups.get(cake.category) ?? [];
      list.push(cake);
      groups.set(cake.category, list);
    }

    return Array.from(groups.entries()).map(([category, cakes]) => ({ category, cakes }));
  } catch (err) {
    console.error("getReadyMadeCakesByCategory failed", err);
    return [];
  }
}
