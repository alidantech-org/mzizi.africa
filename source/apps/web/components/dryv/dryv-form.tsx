"use client";

import { type FormEvent, useState } from "react";

import type { FieldMeta } from "../../lib/dryv/transport.ts";

/** A form built from a schema's field metadata. Values are typed by each field's kind. */
export function DryvForm({
  fields,
  submitLabel,
  onSubmit,
}: {
  fields: readonly FieldMeta[];
  submitLabel: string;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = data.get(field.name);
      if (field.kind === "boolean") values[field.name] = raw === "on";
      else if (raw === null || raw === "") continue;
      else if (field.kind === "number") values[field.name] = Number(raw);
      else values[field.name] = String(raw);
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="dryv-form">
      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          {field.kind === "enum" ? (
            <select name={field.name} required={field.required}>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              required={field.required && field.kind !== "boolean"}
              type={
                field.kind === "number"
                  ? "number"
                  : field.kind === "boolean"
                    ? "checkbox"
                    : field.kind === "date"
                      ? "datetime-local"
                      : "text"
              }
            />
          )}
        </label>
      ))}
      <button type="submit" disabled={busy}>
        {submitLabel}
      </button>
      {error === null ? null : <p role="alert">{error}</p>}
    </form>
  );
}
