"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { fetchCakePreview, type CakePreviewView } from "@/lib/cake-preview";

const VIEWS: CakePreviewView[] = ["front", "top", "sliced"];

interface ViewState {
  url: string | null;
  status: "idle" | "loading" | "ready" | "error";
}

const idleView: ViewState = { url: null, status: "idle" };

export interface PreviewUrls {
  front: string | null;
  top: string | null;
  sliced: string | null;
}

interface PreviewCarouselProps {
  shapeId: string | null;
  flavorId: string | null;
  colorHex: string | null;
  designId: string | null;
  onUrlsChange?: (urls: PreviewUrls) => void;
}

// Live 3-view preview (front/top/sliced) backed by the cake-preview edge
// function. Front/top load eagerly whenever shape/flavor/color/design
// change; sliced only loads once its slide is opened. Message/print step
// changes never trigger this component to re-fetch (it isn't given those
// props at all).
export function PreviewCarousel({
  shapeId,
  flavorId,
  colorHex,
  designId,
  onUrlsChange,
}: PreviewCarouselProps) {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [views, setViews] = useState<Record<CakePreviewView, ViewState>>({
    front: idleView,
    top: idleView,
    sliced: idleView,
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    onUrlsChange?.({ front: views.front.url, top: views.top.url, sliced: views.sliced.url });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views.front.url, views.top.url, views.sliced.url]);

  const ready = Boolean(shapeId && flavorId && colorHex);

  useEffect(() => {
    if (!ready) return;
    const requestId = ++requestIdRef.current;

    setViews((prev) => ({
      ...prev,
      front: { url: null, status: "loading" },
      top: { url: null, status: "loading" },
      sliced: idleView,
    }));
    setActiveIndex(0);

    const load = async (view: CakePreviewView) => {
      try {
        const result = await fetchCakePreview({
          shapeId: shapeId!,
          flavorId: flavorId!,
          colorHex: colorHex!,
          designId,
          view,
        });
        if (requestIdRef.current !== requestId) return;
        setViews((prev) => ({ ...prev, [view]: { url: result.url, status: "ready" } }));
      } catch {
        if (requestIdRef.current !== requestId) return;
        setViews((prev) => ({ ...prev, [view]: { url: null, status: "error" } }));
      }
    };

    load("front");
    load("top");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeId, flavorId, colorHex, designId, ready]);

  function ensureSlicedLoaded() {
    if (!ready) return;
    const current = views.sliced;
    if (current.status !== "idle") return;

    setViews((prev) => ({ ...prev, sliced: { url: null, status: "loading" } }));
    const requestId = requestIdRef.current;

    fetchCakePreview({
      shapeId: shapeId!,
      flavorId: flavorId!,
      colorHex: colorHex!,
      designId,
      view: "sliced",
    })
      .then((result) => {
        if (requestIdRef.current !== requestId) return;
        setViews((prev) => ({ ...prev, sliced: { url: result.url, status: "ready" } }));
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setViews((prev) => ({ ...prev, sliced: { url: null, status: "error" } }));
      });
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
    if (VIEWS[index] === "sliced") ensureSlicedLoaded();
  }

  const activeView = VIEWS[activeIndex];
  const activeState = views[activeView];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-brand-light">
        {activeState.status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-dark/70">
            {t("customization.previewPreparing")}
          </div>
        )}
        {activeState.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-brand-dark/70">
            {t("customization.previewFailed")}
          </div>
        )}
        {activeState.status === "ready" && activeState.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeState.url}
            alt={t(`customization.view${capitalize(activeView)}`)}
            className="h-full w-full object-contain"
          />
        )}
        {activeState.status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-dark/50">
            {t("customization.previewPreparing")}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {VIEWS.map((view, index) => (
          <button
            key={view}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={t(`customization.view${capitalize(view)}`)}
            aria-current={index === activeIndex}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === activeIndex ? "bg-brand" : "bg-black/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function capitalize(value: string): string {
  return value[0].toUpperCase() + value.slice(1);
}
