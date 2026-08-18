import { getAllCatalogRows } from "@/lib/admin/queries";
import { EntityManager } from "@/components/admin/EntityManager";
import type { Addon } from "@/types/catalog";

export default async function AdminAddonsPage() {
  const rows = await getAllCatalogRows<Addon>("addons");
  return <EntityManager table="addons" rows={rows} />;
}
