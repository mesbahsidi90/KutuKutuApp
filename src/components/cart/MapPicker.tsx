"use client";

import { useLocale } from "@/lib/i18n/locale-provider";

// Placeholder map picker -- shows a static map-like surface with a pin the
// user can drop by clicking, and reports back a lat/lng. Swap for a real
// map SDK (Google Maps / Mapbox / Leaflet) once an API key is available;
// the onPick contract (lat, lng) stays the same either way.
export function MapPicker({
  lat,
  lng,
  onPick,
}: {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const { t } = useLocale();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    // Maps the click position onto a placeholder bounding box roughly
    // covering northern Algeria -- purely illustrative until a real map is wired up.
    const pickedLat = 37 - yRatio * 4;
    const pickedLng = 0 + xRatio * 6;
    onPick(pickedLat, pickedLng);
  }

  const hasPin = lat !== null && lng !== null;

  return (
    <div>
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={t("cart.pickOnMap")}
        className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-xl border border-black/10 bg-[repeating-linear-gradient(45deg,var(--brand-light),var(--brand-light)_10px,transparent_10px,transparent_20px)] bg-brand-light"
      >
        {hasPin && (
          <div
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-full rounded-full bg-brand shadow"
            style={{
              left: `${((lng! - 0) / 6) * 100}%`,
              top: `${((37 - lat!) / 4) * 100}%`,
            }}
          />
        )}
      </div>
      {hasPin && (
        <p className="mt-1 text-xs text-foreground/50">
          {lat!.toFixed(4)}, {lng!.toFixed(4)}
        </p>
      )}
    </div>
  );
}
