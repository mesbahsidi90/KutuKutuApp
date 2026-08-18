import { getAllCatalogRows } from "@/lib/admin/queries";
import { EntityManager } from "@/components/admin/EntityManager";
import type { Flavor } from "@/types/catalog";

export default async function AdminFlavorsPage() {
  const rows = await getAllCatalogRows<Flavor>("flavors");
  return <EntityManager table="flavors" rows={rows} />;
}
