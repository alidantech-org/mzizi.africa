import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Feature Window */
export interface FeatureWindow {
  codePrefix?: string;
  featureTypeId?: string;
  limit?: number;
  offset?: number;
}

/** Field metadata for forms and results. */
export const FeatureWindowFields: readonly FieldMeta[] = [
  { name: "codePrefix", label: "Code Prefix", kind: "string", required: false },
  {
    name: "featureTypeId",
    label: "Feature Type Id",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
];
