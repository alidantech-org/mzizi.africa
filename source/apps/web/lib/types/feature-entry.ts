import type { FieldMeta } from "../dryv/transport.ts";
import { type FeatureEntryNames } from "./feature-entry-names.ts";

/** Feature Entry */
export interface FeatureEntry {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: FeatureEntryNames[];
  validFrom: string | null;
  validUntil: string | null;
}

/** Field metadata for forms and results. */
export const FeatureEntryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  {
    name: "featureTypeId",
    label: "Feature Type Id",
    kind: "string",
    required: true,
  },
  { name: "names", label: "Names", kind: "other", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
];
