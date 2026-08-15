"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { CUSTOMIZATION_STEPS, type CustomizationStep } from "@/types/customization";

const STEP_LABEL_KEYS: Record<CustomizationStep, string> = {
  shape: "customization.stepShape",
  flavor: "customization.stepFlavor",
  color: "customization.stepColor",
  design: "customization.stepDesign",
  message: "customization.stepMessage",
};

export function ProgressBar({
  current,
  onStepClick,
}: {
  current: CustomizationStep;
  onStepClick: (step: CustomizationStep) => void;
}) {
  const { t } = useLocale();
  const currentIndex = CUSTOMIZATION_STEPS.indexOf(current);

  return (
    <ol className="flex items-center gap-2">
      {CUSTOMIZATION_STEPS.map((step, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              disabled={index > currentIndex}
              aria-current={active}
              className={`h-1.5 w-full rounded-full transition-colors ${
                completed || active ? "bg-brand" : "bg-black/10"
              }`}
            />
            <span
              className={`hidden text-xs sm:block ${
                active ? "font-semibold text-brand-dark" : "text-foreground/50"
              }`}
            >
              {t(STEP_LABEL_KEYS[step])}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
