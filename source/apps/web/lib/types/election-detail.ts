import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ElectionDetailContests } from "#/lib/types/election-detail-contests.ts";
import { type ElectionDetailElection } from "#/lib/types/election-detail-election.ts";
import { type ElectionDetailTotals } from "#/lib/types/election-detail-totals.ts";
import { type ElectionDetailUnits } from "#/lib/types/election-detail-units.ts";

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
