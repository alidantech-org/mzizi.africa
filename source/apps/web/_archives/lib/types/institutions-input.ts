import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institutions Input */
export interface InstitutionsInput {
  armCode?: string;
  kindCode?: string;
  query?: string;
}

/** Field metadata for forms and results. */
export const InstitutionsInputFields: readonly FieldMeta[] = [
  { name: "armCode", label: "Arm Code", kind: "string", required: false },
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
  { name: "query", label: "Query", kind: "string", required: false },
];
