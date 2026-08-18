"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/queries/admin-auth";
import { CATALOG_TABLES, type CatalogTable } from "@/lib/admin/catalog-schemas";

const BOOLEAN_FIELDS = new Set(["active"]);

function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const key of formData.keys()) {
    if (BOOLEAN_FIELDS.has(key)) continue;
    const value = formData.get(key);
    if (value !== null) obj[key] = value;
  }
  for (const key of BOOLEAN_FIELDS) {
    obj[key] = formData.get(key) === "on";
  }
  return obj;
}

export interface CatalogActionResult {
  success: boolean;
  error?: string;
}

async function assertAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized");
}

export async function createCatalogRow(
  table: CatalogTable,
  formData: FormData
): Promise<CatalogActionResult> {
  try {
    await assertAdmin();
    const schema = CATALOG_TABLES[table];
    const parsed = schema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const supabase = await createClient();
    // `table` is a dynamic union at this point, so its row shape can't be
    // statically correlated with `parsed.data` -- runtime validation above
    // (zod, keyed off the same `table`) is what actually guarantees the shape.
    const { error } = await supabase.from(table).insert(parsed.data as never);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/[locale]/admin/${table}`, "page");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed" };
  }
}

export async function updateCatalogRow(
  table: CatalogTable,
  id: string,
  formData: FormData
): Promise<CatalogActionResult> {
  try {
    await assertAdmin();
    const schema = CATALOG_TABLES[table];
    const parsed = schema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from(table).update(parsed.data as never).eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/[locale]/admin/${table}`, "page");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed" };
  }
}

export async function deleteCatalogRow(
  table: CatalogTable,
  id: string
): Promise<CatalogActionResult> {
  try {
    await assertAdmin();
    const supabase = await createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/[locale]/admin/${table}`, "page");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed" };
  }
}
