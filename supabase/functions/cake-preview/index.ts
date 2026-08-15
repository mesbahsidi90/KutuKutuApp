import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import {
  parseRequestBody,
  validateAgainstCatalog,
  ValidationError,
  type PreviewRequest,
} from "./validate.ts";
import { cacheKeyFor, tryGetCached, uploadToCache } from "./cache.ts";
import { loadShading, loadFlavorSlice, loadDesignOverlay } from "./assets.ts";
import { compositeCakePreview } from "./compositor.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  // Service-role client: this function is a trusted server context that
  // needs to read the full catalog and write to the previews cache bucket,
  // which customers can't write to directly.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let parsed: PreviewRequest;
  try {
    parsed = parseRequestBody(await req.json());
    await validateAgainstCatalog(supabase, parsed);
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid request";
    return jsonResponse({ error: message }, 400);
  }

  const cachePath = cacheKeyFor(parsed);

  const cachedUrl = await tryGetCached(supabase, cachePath);
  if (cachedUrl) {
    return jsonResponse({ url: cachedUrl, cached: true });
  }

  try {
    const shadingPng = await loadShading(supabase, parsed.shapeId, parsed.view);
    const flavorSlicePng =
      parsed.view === "sliced" ? await loadFlavorSlice(supabase, parsed.flavorId) : null;
    const overlayPng = parsed.designId
      ? await loadDesignOverlay(supabase, parsed.designId, parsed.view)
      : null;

    const composited = await compositeCakePreview({
      shadingPng,
      flavorSlicePng,
      overlayPng,
      colorHex: parsed.colorHex,
    });

    const url = await uploadToCache(supabase, cachePath, composited);
    return jsonResponse({ url, cached: false });
  } catch (err) {
    console.error("cake-preview: compositing failed", err);
    return jsonResponse({ error: "Preview generation failed" }, 500);
  }
});
