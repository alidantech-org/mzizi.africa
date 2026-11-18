"use client";

/** A select whose choices come from an async loader, loaded once when the field first mounts. */
import { useEffect, useState } from "react";

import type { FieldOption } from "#ui/lib/types.ts";

export interface SearchSelectProps {
  readonly name: string;
  readonly label: string;
  readonly value: string;
  readonly loadOptions: () => Promise<readonly FieldOption[]>;
  readonly onChange: (value: string) => void;
}

export function SearchSelect({ name, label, value, loadOptions, onChange }: SearchSelectProps) {
  const [options, setOptions] = useState<readonly FieldOption[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadOptions().then(
      (loaded) => active && setOptions(loaded),
      () => active && setFailed(true),
    );
    return () => {
      active = false;
    };
  }, [loadOptions]);

  return (
    <label className="flex flex-col gap-1 text-sm text-content-primary">
      {label}
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={failed}
        className="rounded-[var(--radius-sm)] border border-border-default bg-surface-background px-3 py-2"
      >
        <option value="">{failed ? "Choices unavailable" : "Any"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
