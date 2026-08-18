"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { FieldConfig } from "@/lib/admin/entity-configs";

type EntityRow = Record<string, unknown> & { id: string };

export function EntityForm({
  fields,
  initial,
  onSubmit,
  onCancel,
}: {
  fields: FieldConfig[];
  initial: EntityRow | null;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}) {
  const { t } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(formData);
    setPending(false);
    if (!result.success) {
      setError(result.error ?? t("admin.saveError"));
      return;
    }
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-black/10 bg-brand-light/40 p-4"
    >
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">{t(field.labelKey)}</span>
          {renderField(field, initial)}
        </label>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {t("common.save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-foreground"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}

function renderField(field: FieldConfig, initial: EntityRow | null) {
  const rawValue = initial?.[field.name];

  if (field.type === "checkbox") {
    const checked = initial ? Boolean(rawValue) : true;
    return (
      <input type="checkbox" name={field.name} defaultChecked={checked} className="h-5 w-5" />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        defaultValue={typeof rawValue === "string" ? rawValue : ""}
        rows={2}
        className="w-full rounded-md border border-black/10 px-3 py-2"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        name={field.name}
        defaultValue={typeof rawValue === "string" ? rawValue : field.options?.[0]?.value}
        className="w-full rounded-md border border-black/10 px-3 py-2"
      >
        {field.options?.map((opt) => (
          <FieldOption key={opt.value} value={opt.value} labelKey={opt.labelKey} />
        ))}
      </select>
    );
  }

  if (field.type === "color") {
    const value = typeof rawValue === "string" && rawValue ? rawValue : "#f4c2c2";
    return (
      <div className="flex items-center gap-2">
        <input type="color" name={field.name} defaultValue={value} className="h-9 w-12" />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        name={field.name}
        step={field.step ?? "1"}
        defaultValue={typeof rawValue === "number" ? rawValue : (rawValue as string) ?? "0"}
        className="w-full rounded-md border border-black/10 px-3 py-2"
      />
    );
  }

  return (
    <input
      type="text"
      name={field.name}
      defaultValue={typeof rawValue === "string" ? rawValue : ""}
      className="w-full rounded-md border border-black/10 px-3 py-2"
    />
  );
}

function FieldOption({ value, labelKey }: { value: string; labelKey: string }) {
  const { t } = useLocale();
  return <option value={value}>{t(labelKey)}</option>;
}
