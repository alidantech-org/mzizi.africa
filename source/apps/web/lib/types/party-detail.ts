import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Party Detail */
export interface PartyDetail {
  funding: unknown[];
  gaps: string[];
  members: unknown[];
  party: unknown;
  results: unknown[];
}

/** Field metadata for forms and results. */
export const PartyDetailFields: readonly FieldMeta[] = [
  { name: "funding", label: "Funding", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "members", label: "Members", kind: "other", required: true },
  { name: "party", label: "Party", kind: "other", required: true },
  { name: "results", label: "Results", kind: "other", required: true },
];
