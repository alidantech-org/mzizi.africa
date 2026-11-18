import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Place Civic */
export interface PlaceCivic {
  chain: PlaceCrumb[];
  classes: unknown[];
  fund?: unknown | null;
  gaps: string[];
  infrastructure: unknown;
  leadership: unknown[];
  place: PlaceCrumb;
  projects: unknown[];
  years: unknown[];
}

/** Field metadata for forms and results. */
export const PlaceCivicFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "classes", label: "Classes", kind: "other", required: true },
  { name: "fund", label: "Fund", kind: "other", required: false },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "infrastructure", label: "Infrastructure", kind: "other", required: true },
  { name: "leadership", label: "Leadership", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "projects", label: "Projects", kind: "other", required: true },
  { name: "years", label: "Years", kind: "other", required: true },
];
