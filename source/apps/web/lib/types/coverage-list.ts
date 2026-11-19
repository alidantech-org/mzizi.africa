import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type CoverageItem } from "#/lib/types/coverage-item.ts";

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
