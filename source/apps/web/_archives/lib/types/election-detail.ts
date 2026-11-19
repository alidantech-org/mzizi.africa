import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ElectionDetailContests } from "#/_archives/lib/types/election-detail-contests";
import { type ElectionDetailElection } from "#/_archives/lib/types/election-detail-election";
import { type ElectionDetailTotals } from "#/_archives/lib/types/election-detail-totals";
import { type ElectionDetailUnits } from "#/_archives/lib/types/election-detail-units";

/** Election Detail */
export interface ElectionDetail {
  contests: ElectionDetailContests[];
  election: ElectionDetailElection;
  gaps: string[];
  totals: ElectionDetailTotals[];
  units: ElectionDetailUnits[];
}

/** Field metadata for forms and results. */
export const ElectionDetailFields: readonly FieldMeta[] = [
  { name: "contests", label: "Contests", kind: "other", required: true },
  { name: "election", label: "Election", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "totals", label: "Totals", kind: "other", required: true },
  { name: "units", label: "Units", kind: "other", required: true },
];
