import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type Fund } from "#/_archives/lib/types/fund";

/** Fund List */
export interface FundList {
  funds: Fund[];
  gaps: string[];
  total: number;
}

/** Field metadata for forms and results. */
export const FundListFields: readonly FieldMeta[] = [
  { name: "funds", label: "Funds", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
