import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Fund } from "#/lib/types/fund.ts";

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
