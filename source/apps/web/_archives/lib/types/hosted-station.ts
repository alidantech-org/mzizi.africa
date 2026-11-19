import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Hosted Station */
export interface HostedStation {
  ballotsCast?: number | null;
  electionCode: string;
  electionYear: number;
  registeredVoters?: number | null;
  stationName: string;
  statusLabel: string;
  streamCount?: number | null;
}

/** Field metadata for forms and results. */
export const HostedStationFields: readonly FieldMeta[] = [
  {
    name: "ballotsCast",
    label: "Ballots Cast",
    kind: "number",
    required: false,
  },
  {
    name: "electionCode",
    label: "Election Code",
    kind: "string",
    required: true,
  },
  {
    name: "electionYear",
    label: "Election Year",
    kind: "number",
    required: true,
  },
  {
    name: "registeredVoters",
    label: "Registered Voters",
    kind: "number",
    required: false,
  },
  {
    name: "stationName",
    label: "Station Name",
    kind: "string",
    required: true,
  },
  {
    name: "statusLabel",
    label: "Status Label",
    kind: "string",
    required: true,
  },
  {
    name: "streamCount",
    label: "Stream Count",
    kind: "number",
    required: false,
  },
];
