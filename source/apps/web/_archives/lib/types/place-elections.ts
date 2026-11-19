import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";
import { type PlaceElectionsElections } from "#/_archives/lib/types/place-elections-elections";
import { type PlaceElectionsRegistrationTrend } from "#/_archives/lib/types/place-elections-registration-trend";
import { type PlaceElectionsTurnoutTrend } from "#/_archives/lib/types/place-elections-turnout-trend";

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
  {
    name: "registrationTrend",
    label: "Registration Trend",
    kind: "other",
    required: true,
  },
  {
    name: "turnoutTrend",
    label: "Turnout Trend",
    kind: "other",
    required: true,
  },
];
