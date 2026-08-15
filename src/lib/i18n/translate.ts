import type { Dictionary } from "./get-dictionary";

type Vars = Record<string, string | number>;

function getByPath(dict: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

// Dotted-path translation lookup, e.g. t(dict, "cart.freeDeliveryProgress", { amount, currency }).
export function t(dict: Dictionary, key: string, vars?: Vars): string {
  const value = getByPath(dict, key);
  if (typeof value !== "string") return key;
  return interpolate(value, vars);
}
