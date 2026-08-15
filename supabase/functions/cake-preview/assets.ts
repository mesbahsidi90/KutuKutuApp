import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "cake-assets";

async function downloadOptional(
  supabase: SupabaseClient,
  path: string
): Promise<Uint8Array | null> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  return new Uint8Array(await data.arrayBuffer());
}

async function downloadRequired(supabase: SupabaseClient, path: string): Promise<Uint8Array> {
  const bytes = await downloadOptional(supabase, path);
  if (!bytes) throw new Error(`Missing required asset in cake-assets: ${path}`);
  return bytes;
}

// shapes/{shapeId}/{view}-shading.png -- always required for a given view.
export function loadShading(supabase: SupabaseClient, shapeId: string, view: string) {
  return downloadRequired(supabase, `shapes/${shapeId}/${view}-shading.png`);
}

// flavors/{flavorId}-slice.png -- only meaningful on the sliced cross-section
// view; missing is fine (front/top never request it).
export function loadFlavorSlice(supabase: SupabaseClient, flavorId: string) {
  return downloadOptional(supabase, `flavors/${flavorId}-slice.png`);
}

// designs/{designId}/{view}-overlay.png -- optional per view; a design may
// only have art for some views (e.g. front but not sliced).
export function loadDesignOverlay(supabase: SupabaseClient, designId: string, view: string) {
  return downloadOptional(supabase, `designs/${designId}/${view}-overlay.png`);
}
