import { create } from "zustand";
import { CUSTOMIZATION_STEPS, type CustomizationDraft, type CustomizationStep } from "@/types/customization";

interface CustomizationState {
  step: CustomizationStep;
  draft: CustomizationDraft;

  setStep: (step: CustomizationStep) => void;
  goNext: () => void;
  goBack: () => void;

  setDraft: (draft: Partial<CustomizationDraft>) => void;
  resetDraft: (initial?: Partial<CustomizationDraft>) => void;
}

const emptyDraft: CustomizationDraft = {
  shapeId: null,
  flavorId: null,
  colorHex: null,
  designId: null,
  messageText: "",
  photoPrintDataUrl: null,
  additionalInstructions: "",
  quantity: 1,
};

export const useCustomizationStore = create<CustomizationState>()((set, get) => ({
  step: "shape",
  draft: emptyDraft,

  setStep: (step) => set({ step }),

  goNext: () => {
    const idx = CUSTOMIZATION_STEPS.indexOf(get().step);
    const next = CUSTOMIZATION_STEPS[Math.min(idx + 1, CUSTOMIZATION_STEPS.length - 1)];
    set({ step: next });
  },

  goBack: () => {
    const idx = CUSTOMIZATION_STEPS.indexOf(get().step);
    const prev = CUSTOMIZATION_STEPS[Math.max(idx - 1, 0)];
    set({ step: prev });
  },

  setDraft: (partial) => set((state) => ({ draft: { ...state.draft, ...partial } })),

  resetDraft: (initial) => set({ step: "shape", draft: { ...emptyDraft, ...initial } }),
}));
