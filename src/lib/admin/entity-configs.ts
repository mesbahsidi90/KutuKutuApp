import type { CatalogTable } from "./catalog-schemas";

export interface FieldConfig {
  name: string;
  labelKey: string;
  type: "text" | "textarea" | "number" | "checkbox" | "color" | "select";
  options?: { value: string; labelKey: string }[];
  step?: string;
}

export interface EntityConfig {
  table: CatalogTable;
  titleKey: string;
  fields: FieldConfig[];
  assetPaths?: (id: string) => string[];
}

const localizedNameFields: FieldConfig[] = [
  { name: "name_ar", labelKey: "admin.fieldNameAr", type: "text" },
  { name: "name_en", labelKey: "admin.fieldNameEn", type: "text" },
  { name: "name_fr", labelKey: "admin.fieldNameFr", type: "text" },
];

const activeSortFields: FieldConfig[] = [
  { name: "sort_order", labelKey: "admin.fieldSortOrder", type: "number" },
  { name: "active", labelKey: "admin.active", type: "checkbox" },
];

export const ENTITY_CONFIGS: Record<CatalogTable, EntityConfig> = {
  shapes: {
    table: "shapes",
    titleKey: "admin.shapes",
    fields: [
      ...localizedNameFields,
      { name: "servings_range", labelKey: "admin.fieldServingsRange", type: "text" },
      { name: "weight_kg", labelKey: "admin.fieldWeightKg", type: "number", step: "0.1" },
      { name: "base_price", labelKey: "admin.fieldBasePrice", type: "number", step: "1" },
      { name: "image_url", labelKey: "admin.fieldImageUrl", type: "text" },
      ...activeSortFields,
    ],
    assetPaths: (id) => [
      `shapes/${id}/front-shading.png`,
      `shapes/${id}/top-shading.png`,
      `shapes/${id}/sliced-shading.png`,
    ],
  },
  flavors: {
    table: "flavors",
    titleKey: "admin.flavors",
    fields: [
      ...localizedNameFields,
      { name: "description_ar", labelKey: "admin.fieldDescriptionAr", type: "textarea" },
      { name: "description_en", labelKey: "admin.fieldDescriptionEn", type: "textarea" },
      { name: "description_fr", labelKey: "admin.fieldDescriptionFr", type: "textarea" },
      { name: "extra_price", labelKey: "admin.fieldExtraPrice", type: "number", step: "1" },
      { name: "image_url", labelKey: "admin.fieldImageUrl", type: "text" },
      ...activeSortFields,
    ],
    assetPaths: (id) => [`flavors/${id}-slice.png`],
  },
  colors: {
    table: "colors",
    titleKey: "admin.colors",
    fields: [
      ...localizedNameFields,
      { name: "hex", labelKey: "admin.fieldHex", type: "color" },
      ...activeSortFields,
    ],
  },
  designs: {
    table: "designs",
    titleKey: "admin.designs",
    fields: [
      ...localizedNameFields,
      { name: "category", labelKey: "admin.fieldCategory", type: "text" },
      { name: "extra_price", labelKey: "admin.fieldExtraPrice", type: "number", step: "1" },
      ...activeSortFields,
    ],
    assetPaths: (id) => [
      `designs/${id}/front-overlay.png`,
      `designs/${id}/top-overlay.png`,
      `designs/${id}/sliced-overlay.png`,
    ],
  },
  addons: {
    table: "addons",
    titleKey: "admin.addons",
    fields: [
      ...localizedNameFields,
      {
        name: "type",
        labelKey: "admin.fieldType",
        type: "select",
        options: [
          { value: "candle", labelKey: "admin.addonTypeCandle" },
          { value: "card", labelKey: "admin.addonTypeCard" },
          { value: "topper", labelKey: "admin.addonTypeTopper" },
        ],
      },
      { name: "price", labelKey: "admin.fieldPrice", type: "number", step: "1" },
      { name: "image_url", labelKey: "admin.fieldImageUrl", type: "text" },
      ...activeSortFields,
    ],
  },
};
