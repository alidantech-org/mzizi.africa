import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Country Choice */
export interface CountryChoice {
  code: string;
  isServed: boolean;
  name: string;
}

/** Field metadata for forms and results. */
export const CountryChoiceFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "isServed", label: "Is Served", kind: "boolean", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
