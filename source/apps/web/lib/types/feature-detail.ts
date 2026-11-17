import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FeatureDetailNames } from "#/lib/types/feature-detail-names.ts";

/** Feature Detail */
export interface FeatureDetail {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: FeatureDetailNames[];
  validFrom: string | null;
  validUntil: string | null;
}

/** Field metadata for forms and results. */
export const FeatureDetailFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "featureTypeId", label: "Feature Type Id", kind: "string", required: true },
  { name: "names", label: "Names", kind: "other", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
];
