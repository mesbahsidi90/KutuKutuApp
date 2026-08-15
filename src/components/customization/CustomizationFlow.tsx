"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { useCartStore } from "@/lib/store/cart-store";
import { computeUnitPrice } from "@/lib/pricing";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { PRINT_PHOTO_FEE } from "@/lib/constants";
import type { Shape, Flavor, Color, Design } from "@/types/catalog";
import type { CustomizationDraft } from "@/types/customization";
import { PreviewCarousel, type PreviewUrls } from "@/components/customization/PreviewCarousel";
import { ProgressBar } from "@/components/customization/ProgressBar";
import { ShapeStep } from "@/components/customization/steps/ShapeStep";
import { FlavorStep } from "@/components/customization/steps/FlavorStep";
import { ColorStep } from "@/components/customization/steps/ColorStep";
import { DesignStep } from "@/components/customization/steps/DesignStep";
import { MessageStep } from "@/components/customization/steps/MessageStep";

interface CustomizationFlowProps {
  shapes: Shape[];
  flavors: Flavor[];
  colors: Color[];
  designs: Design[];
  initialSelection: Partial<CustomizationDraft> | null;
}

export function CustomizationFlow({
  shapes,
  flavors,
  colors,
  designs,
  initialSelection,
}: CustomizationFlowProps) {
  const { locale, t } = useLocale();
  const router = useRouter();

  const step = useCustomizationStore((s) => s.step);
  const draft = useCustomizationStore((s) => s.draft);
  const setStep = useCustomizationStore((s) => s.setStep);
  const goNext = useCustomizationStore((s) => s.goNext);
  const goBack = useCustomizationStore((s) => s.goBack);
  const resetDraft = useCustomizationStore((s) => s.resetDraft);
  const addItem = useCartStore((s) => s.addItem);

  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({
    front: null,
    top: null,
    sliced: null,
  });

  // Seed the draft once: from the tapped ready-made cake, or sensible
  // defaults (first shape/flavor/color) so the preview has something to
  // render immediately.
  useEffect(() => {
    if (draft.shapeId) return;
    if (initialSelection) {
      resetDraft(initialSelection);
      return;
    }
    resetDraft({
      shapeId: shapes[0]?.id ?? null,
      flavorId: flavors[0]?.id ?? null,
      colorHex: colors[0]?.hex ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shape = shapes.find((s) => s.id === draft.shapeId);
  const flavor = flavors.find((f) => f.id === draft.flavorId);
  const design = designs.find((d) => d.id === draft.designId) ?? null;

  const canGoNext =
    (step === "shape" && Boolean(draft.shapeId)) ||
    (step === "flavor" && Boolean(draft.flavorId)) ||
    (step === "color" && Boolean(draft.colorHex)) ||
    step === "design" ||
    step === "message";

  function handleAddToCart() {
    if (!shape || !flavor || !draft.colorHex) return;

    addItem({
      shapeId: shape.id,
      shapeName: pickLocale(locale, shape.name_ar, shape.name_en, shape.name_fr),
      shapeImageUrl: shape.image_url,
      flavorId: flavor.id,
      flavorName: pickLocale(locale, flavor.name_ar, flavor.name_en, flavor.name_fr),
      colorHex: draft.colorHex,
      designId: design?.id ?? null,
      designName: design ? pickLocale(locale, design.name_ar, design.name_en, design.name_fr) : null,
      messageText: draft.messageText,
      photoPrintDataUrl: draft.photoPrintDataUrl,
      photoPrintFee: draft.photoPrintDataUrl ? PRINT_PHOTO_FEE : 0,
      additionalInstructions: draft.additionalInstructions,
      quantity: draft.quantity,
      unitPrice: computeUnitPrice(shape, flavor, design),
      previewFrontUrl: previewUrls.front,
      previewTopUrl: previewUrls.top,
      previewSlicedUrl: previewUrls.sliced,
    });

    resetDraft();
    router.push(`/${locale}/cart`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t("customization.title")}</h1>

      <div className="mb-8">
        <PreviewCarousel
          shapeId={draft.shapeId}
          flavorId={draft.flavorId}
          colorHex={draft.colorHex}
          designId={draft.designId}
          onUrlsChange={setPreviewUrls}
        />
      </div>

      <div className="mb-6">
        <ProgressBar current={step} onStepClick={setStep} />
      </div>

      <div className="min-h-[320px]">
        {step === "shape" && <ShapeStep shapes={shapes} />}
        {step === "flavor" && <FlavorStep flavors={flavors} />}
        {step === "color" && <ColorStep colors={colors} />}
        {step === "design" && <DesignStep designs={designs} />}
        {step === "message" && <MessageStep />}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === "shape"}
          className="rounded-full border border-black/10 px-5 py-2.5 font-medium text-foreground disabled:opacity-0"
        >
          {t("common.back")}
        </button>

        {step === "message" ? (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!shape || !flavor || !draft.colorHex}
            className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {t("customization.addToCart")}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {t("common.next")}
          </button>
        )}
      </div>
    </div>
  );
}
