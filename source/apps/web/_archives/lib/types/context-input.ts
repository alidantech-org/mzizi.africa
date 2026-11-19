import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Context Input */
export interface ContextInput {
  countryCode?: string;
  edgeCountry?: string;
  featureId?: string;
  languageCode?: string;
  path?: string;
}

/** Field metadata for forms and results. */
export const ContextInputFields: readonly FieldMeta[] = [
  {
    name: "countryCode",
    label: "Country Code",
    kind: "string",
    required: false,
  },
  {
    name: "edgeCountry",
    label: "Edge Country",
    kind: "string",
    required: false,
  },
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "path", label: "Path", kind: "string", required: false },
];
