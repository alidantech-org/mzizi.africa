import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Leader Profile Election */
export interface LeaderProfileElection {
  candidates: number;
  heldOn: string;
  margin: number;
  registered: number;
  runnerUp: number;
  share: number;
  total: number;
  votes: number;
  year: number;
}

/** Field metadata for forms and results. */
export const LeaderProfileElectionFields: readonly FieldMeta[] = [
  { name: "candidates", label: "Candidates", kind: "number", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "margin", label: "Margin", kind: "number", required: true },
  { name: "registered", label: "Registered", kind: "number", required: true },
  { name: "runnerUp", label: "Runner Up", kind: "number", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "votes", label: "Votes", kind: "number", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
