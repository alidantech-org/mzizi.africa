import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Election Detail */
export interface ElectionDetail {
  contests: unknown[];
  election: unknown;
  gaps: string[];
  totals: unknown[];
  units: unknown[];
}

/** Field metadata for forms and results. */
export const ElectionDetailFields: readonly FieldMeta[] = [
  { name: "contests", label: "Contests", kind: "other", required: true },
  { name: "election", label: "Election", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "totals", label: "Totals", kind: "other", required: true },
  { name: "units", label: "Units", kind: "other", required: true },
];
