import { z } from "zod";
import { MESSAGE_MAX_LENGTH } from "@/lib/constants";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color");
const uuid = z.uuid();
const url = z.url();

export const checkoutItemSchema = z.object({
  shapeId: uuid,
  flavorId: uuid,
  colorHex: hexColor,
  designId: uuid.nullable(),
  messageText: z.string().max(MESSAGE_MAX_LENGTH),
  photoPrintDataUrl: z.string().startsWith("data:image/").nullable(),
  additionalInstructions: z.string().max(500),
  quantity: z.number().int().min(1).max(20),
  previewFrontUrl: url.nullable(),
  previewTopUrl: url.nullable(),
  previewSlicedUrl: url.nullable(),
});

export const checkoutAddonSchema = z.object({
  addonId: uuid,
  quantity: z.number().int().min(1).max(20),
});

export const checkoutRecipientSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(20),
  address: z.string().trim().min(1).max(300),
  city: z.string().trim().min(1).max(120),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  hideIdentity: z.boolean(),
  noteToStore: z.string().max(500),
});

export const checkoutSubmissionSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  addons: z.array(checkoutAddonSchema),
  orderMessage: z.string().max(500),
  recipient: checkoutRecipientSchema,
  paymentMethod: z.enum(["cib", "edahabia"]),
});

export type CheckoutSubmission = z.infer<typeof checkoutSubmissionSchema>;
