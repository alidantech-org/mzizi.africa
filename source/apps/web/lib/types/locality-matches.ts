import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LocalityUnit } from "#/lib/types/locality-unit.ts";

/** Locality Matches */
export interface LocalityMatches {
  places: LocalityUnit[];
}

/** Field metadata for forms and results. */
export const LocalityMatchesFields: readonly FieldMeta[] = [
  { name: "places", label: "Places", kind: "other", required: true },
];
