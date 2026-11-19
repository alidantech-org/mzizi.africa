import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";
import { type PlaceElectionsElections } from "#/lib/types/place-elections-elections.ts";
import { type PlaceElectionsRegistrationTrend } from "#/lib/types/place-elections-registration-trend.ts";
import { type PlaceElectionsTurnoutTrend } from "#/lib/types/place-elections-turnout-trend.ts";

/** Place Elections */
export interface PlaceElections {
  elections: PlaceElectionsElections[];
  gaps: string[];
  place: PlaceCrumb;
  registrationTrend: PlaceElectionsRegistrationTrend[];
  turnoutTrend: PlaceElectionsTurnoutTrend[];
}

/** Field metadata for forms and results. */
export const PlaceElectionsFields: readonly FieldMeta[] = [
  { name: "elections", label: "Elections", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "registrationTrend", label: "Registration Trend", kind: "other", required: true },
  { name: "turnoutTrend", label: "Turnout Trend", kind: "other", required: true },
];
