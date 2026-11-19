import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Election List Elections Winner */
export interface ElectionListElectionsWinner {
  name: string;
  party: string;
  votes: number;
}

/** Field metadata for forms and results. */
export const ElectionListElectionsWinnerFields: readonly FieldMeta[] = [
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: true },
  { name: "votes", label: "Votes", kind: "number", required: true },
];
