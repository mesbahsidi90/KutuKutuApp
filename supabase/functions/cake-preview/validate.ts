import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const VIEWS = ["front", "top", "sliced"] as const;
export type View = (typeof VIEWS)[number];

export interface PreviewRequest {
  shapeId: string;
  flavorId: string;
  colorHex: string;
  designId: string | null;
  view: View;
}

export class ValidationError extends Error {}

export function parseRequestBody(body: unknown): PreviewRequest {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }
  const { shapeId, flavorId, colorHex, designId, view } = body as Record<string, unknown>;

  if (typeof shapeId !== "string" || !shapeId) {
    throw new ValidationError("shapeId is required");
  }
  if (typeof flavorId !== "string" || !flavorId) {
    throw new ValidationError("flavorId is required");
  }
  // Accepts both fixed palette swatches and free-picked custom colors --
  // any well-formed hex is valid, matching the customization page's
  // "palette + free color picker" design (spec section 3).
  if (typeof colorHex !== "string" || !HEX_RE.test(colorHex)) {
    throw new ValidationError("colorHex must be a #rrggbb hex color");
  }
  if (designId !== undefined && designId !== null && typeof designId !== "string") {
    throw new ValidationError("designId must be a string when provided");
  }
  if (typeof view !== "string" || !(VIEWS as readonly string[]).includes(view)) {
    throw new ValidationError(`view must be one of: ${VIEWS.join(", ")}`);
  }

  return {
    shapeId,
    flavorId,
    colorHex: colorHex.toLowerCase(),
    designId: (designId as string | undefined) ?? null,
    view: view as View,
  };
}

// Re-validates every id against the live catalog tables server-side. The
// client is never trusted: a stale or fabricated shapeId/flavorId/designId
// is rejected here even if it looked well-formed.
export async function validateAgainstCatalog(
  supabase: SupabaseClient,
  req: PreviewRequest
): Promise<void> {
  const [{ data: shape }, { data: flavor }] = await Promise.all([
    supabase.from("shapes").select("id").eq("id", req.shapeId).eq("active", true).maybeSingle(),
    supabase.from("flavors").select("id").eq("id", req.flavorId).eq("active", true).maybeSingle(),
  ]);

  if (!shape) throw new ValidationError("Unknown or inactive shapeId");
  if (!flavor) throw new ValidationError("Unknown or inactive flavorId");

  if (req.designId) {
    const { data: design } = await supabase
      .from("designs")
      .select("id")
      .eq("id", req.designId)
      .eq("active", true)
      .maybeSingle();
    if (!design) throw new ValidationError("Unknown or inactive designId");
  }
}
