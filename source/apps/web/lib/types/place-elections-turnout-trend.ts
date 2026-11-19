import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Elections Turnout Trend */
export interface PlaceElectionsTurnoutTrend {
  registered: number;
  turnout: number;
  year: number;
}

/** Field metadata for forms and results. */
export const PlaceElectionsTurnoutTrendFields: readonly FieldMeta[] = [
  { name: "registered", label: "Registered", kind: "number", required: true },
  { name: "turnout", label: "Turnout", kind: "number", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
