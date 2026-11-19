import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Election Detail Units Winner */
export interface ElectionDetailUnitsWinner {
  margin: number;
  name: string;
  party: string;
  partyCode: string;
  share: number;
  votes: number;
}

/** Field metadata for forms and results. */
export const ElectionDetailUnitsWinnerFields: readonly FieldMeta[] = [
  { name: "margin", label: "Margin", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: true },
  { name: "partyCode", label: "Party Code", kind: "string", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "votes", label: "Votes", kind: "number", required: true },
];
