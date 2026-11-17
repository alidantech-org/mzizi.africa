"use client";

/** A row of filter fields with an apply button. It holds the draft values and hands them over on submit. */
import { type FormEvent, useState } from "react";

import { SearchSelect } from "#ui/components/search-select.tsx";
import type { FieldSpec, FieldValues } from "#ui/lib/types.ts";

export interface FilterBarProps {
  readonly fields: readonly FieldSpec[];
  readonly initial: FieldValues;
  readonly submitLabel: string;
  readonly onSubmit: (values: FieldValues) => void;
}

export function FilterBar({ fields, initial, submitLabel, onSubmit }: FilterBarProps) {
  const [values, setValues] = useState<FieldValues>(initial);
  const set = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
      {fields.map((field) =>
        field.kind === "choice" ? (
          <SearchSelect
            key={field.name}
            name={field.name}
            label={field.label}
            value={values[field.name] ?? ""}
            loadOptions={field.loadOptions}
            onChange={(value) => set(field.name, value)}
          />
        ) : (
          <label key={field.name} className="flex flex-col gap-1 text-sm text-content-primary">
            {field.label}
            <input
              name={field.name}
              value={values[field.name] ?? ""}
              onChange={(event) => set(field.name, event.target.value)}
              className="rounded-[var(--radius-sm)] border border-border-default bg-surface-background px-3 py-2"
            />
          </label>
        ),
      )}
      <button
        type="submit"
        className="rounded-[var(--radius-sm)] bg-action-primary px-4 py-2 text-sm text-content-inverse"
      >
        {submitLabel}
      </button>
    </form>
  );
}
