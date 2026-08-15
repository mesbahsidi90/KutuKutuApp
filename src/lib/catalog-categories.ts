// Design/ready-made-cake categories are free-text in the database (admin can
// type any category when creating a design), but the common ones used
// throughout the app have translations in categories.*. Anything else falls
// back to a title-cased version of the raw value so custom categories still
// render sensibly instead of breaking i18n.
const KNOWN_CATEGORY_KEYS = new Set([
  "retro",
  "birthday",
  "graduation",
  "love",
  "ramadan",
  "wedding",
  "other",
]);

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function categoryLabel(
  t: (key: string) => string,
  category: string
): string {
  const key = category.trim().toLowerCase();
  if (KNOWN_CATEGORY_KEYS.has(key)) {
    return t(`categories.${key}`);
  }
  return titleCase(category);
}
