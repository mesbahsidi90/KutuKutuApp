export const CUSTOMIZATION_STEPS = ["shape", "flavor", "color", "design", "message"] as const;
export type CustomizationStep = (typeof CUSTOMIZATION_STEPS)[number];

export interface CustomizationDraft {
  shapeId: string | null;
  flavorId: string | null;
  colorHex: string | null;
  designId: string | null;
  messageText: string;
  photoPrintDataUrl: string | null;
  additionalInstructions: string;
  quantity: number;
}
