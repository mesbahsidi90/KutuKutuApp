import { z } from "zod";

const localizedName = {
  name_ar: z.string().trim().min(1),
  name_en: z.string().trim().min(1),
  name_fr: z.string().trim().min(1),
};

export const shapeSchema = z.object({
  ...localizedName,
  servings_range: z.string().trim().min(1),
  weight_kg: z.coerce.number().positive(),
  base_price: z.coerce.number().min(0),
  image_url: z.string().trim().optional().nullable(),
  active: z.coerce.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

export const flavorSchema = z.object({
  ...localizedName,
  description_ar: z.string().trim().optional().default(""),
  description_en: z.string().trim().optional().default(""),
  description_fr: z.string().trim().optional().default(""),
  extra_price: z.coerce.number().min(0).default(0),
  image_url: z.string().trim().optional().nullable(),
  active: z.coerce.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

export const colorSchema = z.object({
  ...localizedName,
  hex: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a #rrggbb hex color"),
  active: z.coerce.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

export const designSchema = z.object({
  ...localizedName,
  category: z.string().trim().min(1),
  extra_price: z.coerce.number().min(0).default(0),
  active: z.coerce.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

export const addonSchema = z.object({
  ...localizedName,
  type: z.enum(["candle", "card", "topper"]),
  price: z.coerce.number().min(0).default(0),
  image_url: z.string().trim().optional().nullable(),
  active: z.coerce.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

export const CATALOG_TABLES = {
  shapes: shapeSchema,
  flavors: flavorSchema,
  colors: colorSchema,
  designs: designSchema,
  addons: addonSchema,
} as const;

export type CatalogTable = keyof typeof CATALOG_TABLES;
