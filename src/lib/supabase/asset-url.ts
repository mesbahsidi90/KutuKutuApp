// Builds a public URL for an object in the cake-assets bucket. No secret is
// involved -- the bucket is public-read, and this only needs the public
// project URL (already exposed to the browser as NEXT_PUBLIC_SUPABASE_URL).
export function cakeAssetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/cake-assets/${path}`;
}

export function designThumbnailUrl(designId: string, view: "front" | "top" = "front"): string {
  return cakeAssetUrl(`designs/${designId}/${view}-overlay.png`);
}
