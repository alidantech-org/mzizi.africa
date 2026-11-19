import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Facility Key */
export interface FacilityKey {
  code: string;
  languageCode?: string;
}

/** Field metadata for forms and results. */
export const FacilityKeyFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
];
