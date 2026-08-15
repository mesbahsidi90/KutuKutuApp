export interface CartItem {
  id: string; // client-generated line id
  shapeId: string;
  shapeName: string;
  shapeImageUrl: string | null;
  flavorId: string;
  flavorName: string;
  colorHex: string;
  designId: string | null;
  designName: string | null;
  messageText: string;
  photoPrintDataUrl: string | null;
  photoPrintFee: number;
  additionalInstructions: string;
  quantity: number;
  unitPrice: number;
  previewFrontUrl: string | null;
  previewTopUrl: string | null;
  previewSlicedUrl: string | null;
}

export interface CartAddonLine {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface RecipientInfo {
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
  hideIdentity: boolean;
  noteToStore: string;
}
