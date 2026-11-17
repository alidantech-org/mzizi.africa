import type { FieldMeta } from "../dryv/transport.ts";
import { ValueLabelKind } from "./value-label-kind.enum.ts";
import { type ValidityEntity } from "./validity-entity.ts";
import { type Value } from "./value.ts";

/** A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text. */
export interface ValueLabel {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  labelKind: ValueLabelKind;
  languageTag: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  valueId: string;
  version: number;
}

/** Field metadata for forms and results. */
export const ValueLabelFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  {
    name: "labelKind",
    label: "Label Kind",
    kind: "enum",
    required: true,
    options: Object.values(ValueLabelKind),
  },
  {
    name: "languageTag",
    label: "Language Tag",
    kind: "string",
    required: true,
  },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  { name: "valueId", label: "Value Id", kind: "string", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
