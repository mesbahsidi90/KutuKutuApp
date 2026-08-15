import { createClient } from "@/lib/supabase/client";

export type CakePreviewView = "front" | "top" | "sliced";

export interface CakePreviewRequest {
  shapeId: string;
  flavorId: string;
  colorHex: string;
  designId: string | null;
  view: CakePreviewView;
}

export interface CakePreviewResult {
  url: string;
  cached: boolean;
}

// Calls the cake-preview edge function. Front/top are meant to be fetched
// eagerly whenever shape/flavor/color/design changes; sliced is meant to be
// fetched lazily (e.g. only once its carousel slide is opened).
export async function fetchCakePreview(
  request: CakePreviewRequest
): Promise<CakePreviewResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke<CakePreviewResult>("cake-preview", {
    body: request,
  });
  if (error || !data) {
    throw new Error(error?.message ?? "Preview generation failed");
  }
  return data;
}
