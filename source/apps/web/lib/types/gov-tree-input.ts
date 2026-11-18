import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Gov Tree Input */
export interface GovTreeInput {
  featureId?: string;
  institution?: string;
  tab?: string;
}

/** Field metadata for forms and results. */
export const GovTreeInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "institution", label: "Institution", kind: "string", required: false },
  { name: "tab", label: "Tab", kind: "string", required: false },
];
