import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Elections Elections Contests Candidates */
export interface PlaceElectionsElectionsContestsCandidates {
  individualId: string;
  name: string;
  party: string;
  partyCode: string;
  share: number;
  votes: number;
  won: boolean;
}

/** Field metadata for forms and results. */
export const PlaceElectionsElectionsContestsCandidatesFields: readonly FieldMeta[] =
  [
    {
      name: "individualId",
      label: "Individual Id",
      kind: "string",
      required: true,
    },
    { name: "name", label: "Name", kind: "string", required: true },
    { name: "party", label: "Party", kind: "string", required: true },
    { name: "partyCode", label: "Party Code", kind: "string", required: true },
    { name: "share", label: "Share", kind: "number", required: true },
    { name: "votes", label: "Votes", kind: "number", required: true },
    { name: "won", label: "Won", kind: "boolean", required: true },
  ];
