import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Party Detail Results */
export interface PartyDetailResults {
  candidates: number;
  contest: string;
  votes: number;
  won: number;
  year: number;
}

/** Field metadata for forms and results. */
export const PartyDetailResultsFields: readonly FieldMeta[] = [
  { name: "candidates", label: "Candidates", kind: "number", required: true },
  { name: "contest", label: "Contest", kind: "string", required: true },
  { name: "votes", label: "Votes", kind: "number", required: true },
  { name: "won", label: "Won", kind: "number", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
