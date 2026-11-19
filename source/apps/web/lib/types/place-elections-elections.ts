import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceElectionsElectionsContests } from "#/lib/types/place-elections-elections-contests.ts";

/** Place Elections Elections */
export interface PlaceElectionsElections {
  contests: PlaceElectionsElectionsContests[];
  electionId: string;
  heldOn: string;
  kind: string;
  year: number;
}

/** Field metadata for forms and results. */
export const PlaceElectionsElectionsFields: readonly FieldMeta[] = [
  { name: "contests", label: "Contests", kind: "other", required: true },
  { name: "electionId", label: "Election Id", kind: "string", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
