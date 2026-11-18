import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Place Elections */
export interface PlaceElections {
  elections: unknown[];
  gaps: string[];
  place: PlaceCrumb;
  registrationTrend: unknown[];
  turnoutTrend: unknown[];
}

/** Field metadata for forms and results. */
export const PlaceElectionsFields: readonly FieldMeta[] = [
  { name: "elections", label: "Elections", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "registrationTrend", label: "Registration Trend", kind: "other", required: true },
  { name: "turnoutTrend", label: "Turnout Trend", kind: "other", required: true },
];
