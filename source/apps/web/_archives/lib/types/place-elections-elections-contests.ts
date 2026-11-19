import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceElectionsElectionsContestsCandidates } from "#/_archives/lib/types/place-elections-elections-contests-candidates";

/** Place Elections Elections Contests */
export interface PlaceElectionsElectionsContests {
  ballotsCast: number;
  candidates: PlaceElectionsElectionsContestsCandidates[];
  kind: string;
  registered: number;
  turnout: number;
}

/** Field metadata for forms and results. */
export const PlaceElectionsElectionsContestsFields: readonly FieldMeta[] = [
  {
    name: "ballotsCast",
    label: "Ballots Cast",
    kind: "number",
    required: true,
  },
  { name: "candidates", label: "Candidates", kind: "other", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "registered", label: "Registered", kind: "number", required: true },
  { name: "turnout", label: "Turnout", kind: "number", required: true },
];
