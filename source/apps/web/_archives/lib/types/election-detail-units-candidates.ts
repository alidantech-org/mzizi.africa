import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Election Detail Units Candidates */
export interface ElectionDetailUnitsCandidates {
  name: string;
  party: string;
  partyCode: string;
  share: number;
  votes: number;
}

/** Field metadata for forms and results. */
export const ElectionDetailUnitsCandidatesFields: readonly FieldMeta[] = [
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: true },
  { name: "partyCode", label: "Party Code", kind: "string", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "votes", label: "Votes", kind: "number", required: true },
];
