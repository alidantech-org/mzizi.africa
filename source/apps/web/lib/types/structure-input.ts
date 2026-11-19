import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Structure Input */
export interface StructureInput {
  countryCode: string;
}

/** Field metadata for forms and results. */
export const StructureInputFields: readonly FieldMeta[] = [
  { name: "countryCode", label: "Country Code", kind: "string", required: true },
];
