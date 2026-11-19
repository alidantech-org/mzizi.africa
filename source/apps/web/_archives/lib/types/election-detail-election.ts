import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Election Detail Election */
export interface ElectionDetailElection {
  code: string;
  contestKind?: string;
  electionId: string;
  heldOn: string;
  year: number;
}

/** Field metadata for forms and results. */
export const ElectionDetailElectionFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "contestKind",
    label: "Contest Kind",
    kind: "string",
    required: false,
  },
  { name: "electionId", label: "Election Id", kind: "string", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
