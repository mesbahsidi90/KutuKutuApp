import { getAllCatalogRows } from "@/lib/admin/queries";
import { EntityManager } from "@/components/admin/EntityManager";
import type { Color } from "@/types/catalog";

export default async function AdminColorsPage() {
  const rows = await getAllCatalogRows<Color>("colors");
  return <EntityManager table="colors" rows={rows} />;
}
