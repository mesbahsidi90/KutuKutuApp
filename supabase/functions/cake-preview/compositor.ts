// Composites a cake preview frame: grayscale shading -> multiply-blend with
// the chosen color -> optional flavor slice texture -> optional design
// overlay. Built on @cf-wasm/photon (a WASM build of the Rust `photon`
// image library), using its Deno/browser entry point.
//
// NOTE ON WASM INIT: `initPhoton`'s `module_or_path` below follows
// @cf-wasm/photon's documented Deno usage. Supabase Edge Functions run on
// Deno, not a bundler, so this is the one piece of this file that should be
// smoke-tested against a real deployment before relying on it -- if the
// WASM module fails to resolve this way, fetch the .wasm binary explicitly
// (e.g. via its npm registry URL) and pass the resulting bytes/ArrayBuffer
// as `module_or_path` instead.
import {
  initPhoton,
  PhotonImage,
  grayscale,
  watermark,
  resize,
  SamplingFilter,
} from "npm:@cf-wasm/photon/others";

let photonReady: Promise<void> | undefined;

function ensurePhoton(): Promise<void> {
  if (!photonReady) {
    photonReady = initPhoton({
      module_or_path: new URL("@cf-wasm/photon/photon.wasm", import.meta.url),
    }).then(() => undefined);
  }
  return photonReady;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Multiply blend: each RGB channel is scaled by color/255; alpha (the
// shape's silhouette) is preserved as-is.
function tintWithColor(shading: InstanceType<typeof PhotonImage>, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const width = shading.get_width();
  const height = shading.get_height();
  const pixels = shading.get_raw_pixels();
  const tinted = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    tinted[i] = Math.round((pixels[i] * r) / 255);
    tinted[i + 1] = Math.round((pixels[i + 1] * g) / 255);
    tinted[i + 2] = Math.round((pixels[i + 2] * b) / 255);
    tinted[i + 3] = pixels[i + 3];
  }
  return new PhotonImage(tinted, width, height);
}

function resizeToMatchAndFree(
  image: InstanceType<typeof PhotonImage>,
  width: number,
  height: number
) {
  if (image.get_width() === width && image.get_height() === height) return image;
  const resized = resize(image, width, height, SamplingFilter.Lanczos3);
  image.free();
  return resized;
}

export interface CompositeLayers {
  shadingPng: Uint8Array;
  flavorSlicePng: Uint8Array | null; // only composited for the "sliced" view
  overlayPng: Uint8Array | null; // per-view design overlay, if present
  colorHex: string;
}

export async function compositeCakePreview(layers: CompositeLayers): Promise<Uint8Array> {
  await ensurePhoton();

  const shading = PhotonImage.new_from_byteslice(layers.shadingPng);
  grayscale(shading); // normalize in case the source asset isn't purely grayscale
  const width = shading.get_width();
  const height = shading.get_height();

  const base = tintWithColor(shading, layers.colorHex);
  shading.free();

  if (layers.flavorSlicePng) {
    const flavor = resizeToMatchAndFree(
      PhotonImage.new_from_byteslice(layers.flavorSlicePng),
      width,
      height
    );
    watermark(base, flavor, 0n, 0n);
    flavor.free();
  }

  if (layers.overlayPng) {
    const overlay = resizeToMatchAndFree(
      PhotonImage.new_from_byteslice(layers.overlayPng),
      width,
      height
    );
    watermark(base, overlay, 0n, 0n);
    overlay.free();
  }

  const bytes = base.get_bytes();
  base.free();
  return bytes;
}
