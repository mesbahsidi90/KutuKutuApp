export interface Shape {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  servings_range: string;
  weight_kg: number;
  base_price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export interface Flavor {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  description_ar: string;
  description_en: string;
  description_fr: string;
  extra_price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export interface Color {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  hex: string;
  active: boolean;
  sort_order: number;
}

export type DesignCategory =
  | "retro"
  | "birthday"
  | "graduation"
  | "love"
  | "ramadan"
  | "other";

export interface Design {
  id: string;
  category: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  extra_price: number;
  active: boolean;
  sort_order: number;
}

export type AddonType = "candle" | "card" | "topper";

export interface Addon {
  id: string;
  type: AddonType;
  name_ar: string;
  name_en: string;
  name_fr: string;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export interface ReadyMadeCake {
  id: string;
  category: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  description_ar: string;
  description_en: string;
  description_fr: string;
  image_url: string | null;
  price: number;
  shape_id: string;
  flavor_id: string;
  color_hex: string;
  design_id: string | null;
  active: boolean;
  sort_order: number;
}
