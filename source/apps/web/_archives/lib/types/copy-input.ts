import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Copy Input */
export interface CopyInput {
  countryCode?: string;
  languageCode?: string;
  prefix?: string;
}

/** Field metadata for forms and results. */
export const CopyInputFields: readonly FieldMeta[] = [
  {
    name: "countryCode",
    label: "Country Code",
    kind: "string",
    required: false,
  },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "prefix", label: "Prefix", kind: "string", required: false },
];
