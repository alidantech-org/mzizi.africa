import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceCivicClasses } from "#/_archives/lib/types/place-civic-classes";
import { type PlaceCivicFund } from "#/_archives/lib/types/place-civic-fund";
import { type PlaceCivicInfrastructure } from "#/_archives/lib/types/place-civic-infrastructure";
import { type PlaceCivicLeadership } from "#/_archives/lib/types/place-civic-leadership";
import { type PlaceCivicProjects } from "#/_archives/lib/types/place-civic-projects";
import { type PlaceCivicYears } from "#/_archives/lib/types/place-civic-years";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

/** Place Civic */
export interface PlaceCivic {
  chain: PlaceCrumb[];
  classes: PlaceCivicClasses[];
  fund: PlaceCivicFund;
  gaps: string[];
  infrastructure: PlaceCivicInfrastructure;
  leadership: PlaceCivicLeadership[];
  place: PlaceCrumb;
  projects: PlaceCivicProjects[];
  years: PlaceCivicYears[];
}

/** Field metadata for forms and results. */
export const PlaceCivicFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "classes", label: "Classes", kind: "other", required: true },
  { name: "fund", label: "Fund", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  {
    name: "infrastructure",
    label: "Infrastructure",
    kind: "other",
    required: true,
  },
  { name: "leadership", label: "Leadership", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "projects", label: "Projects", kind: "other", required: true },
  { name: "years", label: "Years", kind: "other", required: true },
];
