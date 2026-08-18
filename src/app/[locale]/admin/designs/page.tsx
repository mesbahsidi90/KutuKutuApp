import { getAllCatalogRows } from "@/lib/admin/queries";
import { EntityManager } from "@/components/admin/EntityManager";
import type { Design } from "@/types/catalog";

export default async function AdminDesignsPage() {
  const rows = await getAllCatalogRows<Design>("designs");
  return <EntityManager table="designs" rows={rows} />;
}
