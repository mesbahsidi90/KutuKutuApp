"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { ENTITY_CONFIGS } from "@/lib/admin/entity-configs";
import type { CatalogTable } from "@/lib/admin/catalog-schemas";
import {
  createCatalogRow,
  updateCatalogRow,
  deleteCatalogRow,
} from "@/app/actions/catalog-actions";
import { EntityForm } from "./EntityForm";

interface CatalogEntityRow {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  active: boolean;
}

// Takes the table name rather than the resolved config object: EntityConfig
// carries functions (assetPaths), which can't cross the server->client
// prop boundary from a Server Component page. Looking it up here (already
// inside a Client Component) avoids that entirely.
export function EntityManager<T extends CatalogEntityRow>({
  table,
  rows,
}: {
  table: CatalogTable;
  rows: T[];
}) {
  const config = ENTITY_CONFIGS[table];
  const { locale, t } = useLocale();
  const router = useRouter();
  const [editing, setEditing] = useState<"new" | string | null>(null);

  function closeForm() {
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    await deleteCatalogRow(config.table, id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t(config.titleKey)}</h1>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("admin.addNew")}
          </button>
        )}
      </div>

      {editing === "new" && (
        <EntityForm
          fields={config.fields}
          initial={null}
          onSubmit={(formData) => createCatalogRow(config.table, formData)}
          onCancel={closeForm}
        />
      )}

      {rows.length === 0 && editing === null && (
        <p className="text-sm text-foreground/60">{t("admin.noEntries")}</p>
      )}

      <ul className="flex flex-col gap-2">
        {rows.map((row) =>
          editing === row.id ? (
            <li key={row.id}>
              <EntityForm
                fields={config.fields}
                initial={row as unknown as Record<string, unknown> & { id: string }}
                onSubmit={(formData) => updateCatalogRow(config.table, row.id, formData)}
                onCancel={closeForm}
              />
            </li>
          ) : (
            <li
              key={row.id}
              className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {pickLocale(locale, row.name_ar, row.name_en, row.name_fr)}
                </span>
                <span className="text-xs text-foreground/50">
                  {row.active ? t("admin.active") : t("admin.inactive")}
                </span>
                {config.assetPaths && (
                  <span className="text-xs text-foreground/40">
                    {config.assetPaths(row.id).map((path) => (
                      <span key={path} className="me-2">
                        {t("admin.assetHint", { path })}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(row.id)}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {t("admin.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
                >
                  {t("common.delete")}
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
