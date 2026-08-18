import { getAllCatalogRows } from "@/lib/admin/queries";
import { EntityManager } from "@/components/admin/EntityManager";
import type { Shape } from "@/types/catalog";

export default async function AdminShapesPage() {
  const rows = await getAllCatalogRows<Shape>("shapes");
  return <EntityManager table="shapes" rows={rows} />;
}
