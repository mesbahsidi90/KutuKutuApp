import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import type { PreviewRequest } from "./validate.ts";

const BUCKET = "cake-previews";

// Cache key is the exact input combination, so identical requests always
// resolve to the same object instead of re-compositing.
export function cacheKeyFor(req: PreviewRequest): string {
  const hex = req.colorHex.replace("#", "");
  const design = req.designId ?? "none";
  return `${req.shapeId}/${req.flavorId}/${hex}/${design}/${req.view}.png`;
}

export async function tryGetCached(
  supabase: SupabaseClient,
  path: string
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadToCache(
  supabase: SupabaseClient,
  path: string,
  bytes: Uint8Array
): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
