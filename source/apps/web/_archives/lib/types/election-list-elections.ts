import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ElectionListElectionsRunnerUp } from "#/_archives/lib/types/election-list-elections-runner-up";
import { type ElectionListElectionsWinner } from "#/_archives/lib/types/election-list-elections-winner";

/** Election List Elections */
export interface ElectionListElections {
  code: string;
  contests: number;
  electionId: string;
  heldOn: string;
  kind: string;
  registeredVoters?: number | null;
  runnerUp?: ElectionListElectionsRunnerUp | null;
  validVotes?: number | null;
  winner?: ElectionListElectionsWinner | null;
  year: number;
}

/** Field metadata for forms and results. */
export const ElectionListElectionsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "contests", label: "Contests", kind: "number", required: true },
  { name: "electionId", label: "Election Id", kind: "string", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  {
    name: "registeredVoters",
    label: "Registered Voters",
    kind: "number",
    required: false,
  },
  { name: "runnerUp", label: "Runner Up", kind: "other", required: false },
  { name: "validVotes", label: "Valid Votes", kind: "number", required: false },
  { name: "winner", label: "Winner", kind: "other", required: false },
  { name: "year", label: "Year", kind: "number", required: true },
];
