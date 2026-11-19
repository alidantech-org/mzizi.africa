import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ElectionDetailUnitsCandidates } from "#/_archives/lib/types/election-detail-units-candidates";
import { type ElectionDetailUnitsWinner } from "#/_archives/lib/types/election-detail-units-winner";

/** Election Detail Units */
export interface ElectionDetailUnits {
  ballotsCast: number;
  candidates: ElectionDetailUnitsCandidates[];
  featureId: string;
  geometry?: unknown | null;
  name: string;
  path: string;
  registered: number;
  rejected: number;
  turnout: number;
  validVotes: number;
  winner: ElectionDetailUnitsWinner;
}

/** Field metadata for forms and results. */
export const ElectionDetailUnitsFields: readonly FieldMeta[] = [
  {
    name: "ballotsCast",
    label: "Ballots Cast",
    kind: "number",
    required: true,
  },
  { name: "candidates", label: "Candidates", kind: "other", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "geometry", label: "Geometry", kind: "other", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "registered", label: "Registered", kind: "number", required: true },
  { name: "rejected", label: "Rejected", kind: "number", required: true },
  { name: "turnout", label: "Turnout", kind: "number", required: true },
  { name: "validVotes", label: "Valid Votes", kind: "number", required: true },
  { name: "winner", label: "Winner", kind: "other", required: true },
];
