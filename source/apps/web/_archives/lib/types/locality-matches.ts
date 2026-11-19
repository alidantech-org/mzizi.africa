import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LocalityUnit } from "#/_archives/lib/types/locality-unit";

/** Locality Matches */
export interface LocalityMatches {
  places: LocalityUnit[];
}

/** Field metadata for forms and results. */
export const LocalityMatchesFields: readonly FieldMeta[] = [
  { name: "places", label: "Places", kind: "other", required: true },
];
