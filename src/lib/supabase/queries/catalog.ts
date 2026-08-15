import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Shape, Flavor, Color, Design, Addon, ReadyMadeCake } from "@/types/catalog";

// All catalog reads degrade to an empty list/null on failure (missing
// Supabase config, network error) so pages render instead of crashing.

export async function getActiveShapes(): Promise<Shape[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shapes")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data as Shape[]) ?? [];
  } catch (err) {
    console.error("getActiveShapes failed", err);
    return [];
  }
}

export async function getActiveFlavors(): Promise<Flavor[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("flavors")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data as Flavor[]) ?? [];
  } catch (err) {
    console.error("getActiveFlavors failed", err);
    return [];
  }
}

export async function getActiveColors(): Promise<Color[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("colors")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data as Color[]) ?? [];
  } catch (err) {
    console.error("getActiveColors failed", err);
    return [];
  }
}

export async function getActiveDesigns(): Promise<Design[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("designs")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data as Design[]) ?? [];
  } catch (err) {
    console.error("getActiveDesigns failed", err);
    return [];
  }
}

export async function getActiveAddons(): Promise<Addon[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("addons")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data as Addon[]) ?? [];
  } catch (err) {
    console.error("getActiveAddons failed", err);
    return [];
  }
}

export async function getReadyMadeCakeById(id: string): Promise<ReadyMadeCake | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("ready_made_cakes")
      .select("*")
      .eq("id", id)
      .eq("active", true)
      .maybeSingle();
    return (data as ReadyMadeCake | null) ?? null;
  } catch (err) {
    console.error("getReadyMadeCakeById failed", err);
    return null;
  }
}
