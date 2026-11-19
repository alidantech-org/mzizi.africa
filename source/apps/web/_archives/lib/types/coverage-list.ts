import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type CoverageItem } from "#/_archives/lib/types/coverage-item";

/** Coverage List */
export interface CoverageList {
  gaps: string[];
  items: CoverageItem[];
}

/** Field metadata for forms and results. */
export const CoverageListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "items", label: "Items", kind: "other", required: true },
];
