import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCivicClasses } from "#/lib/types/place-civic-classes.ts";
import { type PlaceCivicFund } from "#/lib/types/place-civic-fund.ts";
import { type PlaceCivicInfrastructure } from "#/lib/types/place-civic-infrastructure.ts";
import { type PlaceCivicLeadership } from "#/lib/types/place-civic-leadership.ts";
import { type PlaceCivicProjects } from "#/lib/types/place-civic-projects.ts";
import { type PlaceCivicYears } from "#/lib/types/place-civic-years.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

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
  { name: "infrastructure", label: "Infrastructure", kind: "other", required: true },
  { name: "leadership", label: "Leadership", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "projects", label: "Projects", kind: "other", required: true },
  { name: "years", label: "Years", kind: "other", required: true },
];
